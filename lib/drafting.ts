// Server-only drafting agent: research an approved storyCandidate via Claude
// with web search/fetch, write an original article in the house voice, create
// a draft newsPost in Sanity, attach the source article's promo image, and
// send the Studio preview link to Telegram. Triggered from /api/telegram.

import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'crypto';

import {
  candidateCallbackData,
  sendMessage,
} from './telegram';
import { writeClient } from '@/sanity/write-client';

const AUTHOR_IDS: Record<string, string> = {
  michael: 'author-michael',
  jenna: 'e2e10eb1-8d9f-4029-a648-978eaa8f8b99',
};

const STUDIO_URL = 'https://lmp.sanity.studio';
const SITE_URL = 'https://lifemeetspixel.com';

// Vercel (Hobby) hard-kills a function at 300s WITHOUT running catch blocks,
// which strands the candidate in "approved" with no Telegram report. Research
// and writing therefore run as two chained invocations (each with its own 300s
// window), and each phase aborts its API calls at this budget so a slow run
// fails cleanly (status + Telegram) instead of being killed silently.
const PHASE_BUDGET_MS = 240_000;

interface Candidate {
  _id: string;
  headline: string;
  summary?: string;
  sourceUrl: string;
  sourceName?: string;
  alsoCoveredBy?: string[];
  storyType?: string;
  suggestedAuthor?: string;
  researchNotes?: string;
}

interface ArticleLink {
  anchor: string;
  href: string;
}

interface ArticleSection {
  kind: 'paragraph' | 'h2' | 'h3' | 'blockquote' | 'videoEmbed';
  text: string;
  videoUrl: string;
  links: ArticleLink[];
}

interface Article {
  title: string;
  slug: string;
  excerpt: string;
  breaking: boolean;
  metaDescription: string;
  keywords: string[];
  imageUrl: string;
  imageAlt: string;
  sections: ArticleSection[];
}

const ARTICLE_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Sharp, specific, 55-75 chars, not clickbait. No em dashes.' },
    slug: { type: 'string', description: 'kebab-case version of the title' },
    excerpt: { type: 'string', description: '2-3 sentence summary for the card + RSS, 150-250 chars. No em dashes.' },
    breaking: { type: 'boolean', description: 'true only for genuinely urgent stories' },
    metaDescription: { type: 'string', description: '145-160 chars, lede-style. No em dashes.' },
    keywords: { type: 'array', items: { type: 'string' }, description: '4-6 SEO keywords' },
    imageUrl: {
      type: 'string',
      description: 'Direct URL of the best official promo/press image found during research (og:image of the primary source, press-kit art, or official screenshot). Empty string if none found.',
    },
    imageAlt: { type: 'string', description: 'Alt text describing the image' },
    sections: {
      type: 'array',
      description: 'Article body in order: lede paragraph, h2 sections with paragraphs, optional blockquote, closing take. Optional final videoEmbed for an official trailer.',
      items: {
        type: 'object',
        properties: {
          kind: { type: 'string', enum: ['paragraph', 'h2', 'h3', 'blockquote', 'videoEmbed'] },
          text: { type: 'string', description: 'The text content (caption text for videoEmbed)' },
          videoUrl: { type: 'string', description: 'YouTube/Vimeo URL for videoEmbed, empty string otherwise' },
          links: {
            type: 'array',
            description: 'Inline source links: anchor must be an exact substring of text',
            items: {
              type: 'object',
              properties: {
                anchor: { type: 'string' },
                href: { type: 'string' },
              },
              required: ['anchor', 'href'],
              additionalProperties: false,
            },
          },
        },
        required: ['kind', 'text', 'videoUrl', 'links'],
        additionalProperties: false,
      },
    },
  },
  required: [
    'title', 'slug', 'excerpt', 'breaking', 'metaDescription',
    'keywords', 'imageUrl', 'imageAlt', 'sections',
  ],
  additionalProperties: false,
} as const;

const VOICE_RULES = `You are ghost-writing for Life Meets Pixel, a retro-gaming geek-culture review site written by Michael, a programmer and lifelong gamer from Sydney (Jenna covers cozy/design/K-content stories).

Voice and writing rules:
- Reporter tone, not press release. Open with a strong hook (the lede). End with a short editorial sting: an honest take, scepticism where warranted, what to watch for next.
- WRITE ORIGINAL PROSE. Never copy or lightly paraphrase sentences from the source articles. Digest the facts, then write the story fresh in this voice. Direct quotes are allowed ONLY when clearly attributed and found verbatim in a primary source.
- Attribute facts: "Bungie confirmed in a dev blog that...", "According to reporting by Kotaku...". Add inline links to sources via the links array.
- Australian English (colour, flavour, organise; licence as noun, license as verb).
- Be skeptical. If a publisher's announcement is clearly spin, say so. Don't parrot marketing copy.
- Length: 300-600 words of prose; 200-400 for breaking news. 2-4 h2 sections ("What Happened" / "The Details" / "Why It Matters" / "Our Take", pick what fits).
- No emoji in the title; at most 1 per section elsewhere.
- No AI tells: never "In conclusion", "It's worth noting", "Delve", "Tapestry", "Vibrant".
- NEVER use em dashes (U+2014) anywhere. Use colons, commas, periods, or parentheses instead.
- No unverifiable claims, no fake quotes.
- If there is an official trailer/announcement video, end with a videoEmbed section under an h2 like "Watch the Trailer".
- If the story is reputational (layoffs, allegations), stick to verified facts, attribute clearly, and skip the editorial sting if the situation is still developing.`;

// Runs one phase per call. Phase 1 (no researchNotes on the candidate yet):
// research the story, store the notes, return 'researched' — the /api/draft
// route then re-invokes itself so writing gets a fresh 300s window. Phase 2
// (notes present): write the article, create the draft, ping Telegram.
export async function draftFromCandidate(candidateId: string): Promise<'researched' | 'drafted'> {
  const candidate = await writeClient.fetch<Candidate | null>(
    `*[_type == "storyCandidate" && _id == $id][0]`,
    { id: candidateId }
  );
  if (!candidate) throw new Error(`Candidate ${candidateId} not found`);

  const deadline = Date.now() + PHASE_BUDGET_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PHASE_BUDGET_MS);

  try {
    const client = new Anthropic();

    // Phase 1: research, store notes, hand off.
    if (!candidate.researchNotes) {
      const research = await runResearch(client, candidate, controller.signal, deadline);
      await writeClient.patch(candidate._id).set({ researchNotes: research }).commit();
      await sendMessage(
        `🔎 Research done for "${escapeHtml(candidate.headline)}". Writing the draft now…`
      );
      return 'researched';
    }

    // Phase 2: write + image + draft doc + Telegram preview.
    // Style samples so the writing call can match recent published voice.
    const samples = await writeClient.fetch<
      { title: string; excerpt: string; body: string }[]
    >(
      `*[_type == "newsPost" && defined(slug.current)]|order(publishedAt desc)[0...3]{
        title, excerpt, "body": pt::text(content)[0...500]
      }`
    );

    const article = await writeArticle(
      client,
      candidate,
      candidate.researchNotes,
      samples,
      controller.signal
    );

    // 3. Unique slug.
    const slug = await ensureUniqueSlug(article.slug);

    // 4. Promo image: prefer what research found, fall back to the source
    //    article's og:image, else ping Telegram for a manual drop.
    const imageAsset = await sourcePromoImage(candidate, article.imageUrl);

    // 5. Create the draft newsPost.
    const draftId = `drafts.news-${randomUUID().slice(0, 8)}`;
    await writeClient.create({
      _id: draftId,
      _type: 'newsPost',
      title: article.title,
      slug: { _type: 'slug', current: slug },
      excerpt: article.excerpt,
      content: toPortableText(article.sections),
      ...(imageAsset
        ? {
            featuredImage: {
              _type: 'image',
              asset: { _type: 'reference', _ref: imageAsset },
              alt: article.imageAlt || article.title,
            },
          }
        : {}),
      publishedAt: new Date().toISOString(),
      breaking: article.breaking,
      author: {
        _type: 'reference',
        _ref: AUTHOR_IDS[candidate.suggestedAuthor || 'michael'] || AUTHOR_IDS.michael,
      },
      categories: [],
      tags: [],
      seo: {
        _type: 'seo',
        metaTitle: `${article.title} | Life Meets Pixel`,
        metaDescription: article.metaDescription,
        keywords: article.keywords,
      },
    });

    await writeClient
      .patch(candidate._id)
      .set({
        status: 'drafted',
        newsPostId: draftId,
        imageNeeded: !imageAsset,
        ...(imageAsset
          ? { promoImage: { _type: 'image', asset: { _type: 'reference', _ref: imageAsset } } }
          : {}),
      })
      .commit();

    // 6. Preview + publish gate in Telegram.
    await sendMessage(
      `📝 <b>Draft ready: ${escapeHtml(article.title)}</b>\n\n` +
        `${escapeHtml(article.excerpt)}\n\n` +
        `Review: ${STUDIO_URL}/structure/newsPost;${draftId}\n` +
        `Will publish at: ${SITE_URL}/news/${slug}\n\n` +
        (imageAsset
          ? ''
          : `🖼 <b>No promo image found.</b> Reply to this message with a photo to attach one.\n\n`) +
        `#cand:${candidate._id}`,
      {
        disablePreview: true,
        replyMarkup: {
          inline_keyboard: [
            [
              { text: '🚀 Publish', callback_data: candidateCallbackData('publish', candidate._id) },
              { text: '✏️ Needs edits', callback_data: candidateCallbackData('edits', candidate._id) },
            ],
          ],
        },
      }
    );
    return 'drafted';
  } catch (err) {
    await writeClient.patch(candidate._id).set({ status: 'failed' }).commit();
    await sendMessage(
      `⚠️ <b>Drafting failed</b> for "${escapeHtml(candidate.headline)}":\n` +
        `${escapeHtml(String(err).slice(0, 300))}\n\n` +
        `Retry: /api/draft?candidateId=${candidate._id}`
    );
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function runResearch(
  client: Anthropic,
  candidate: Candidate,
  signal: AbortSignal,
  deadline: number
): Promise<string> {
  let messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: `Research this gaming/geek-culture news story thoroughly for an article we are writing ourselves:

Headline: ${candidate.headline}
Primary source: ${candidate.sourceUrl} (${candidate.sourceName || 'unknown outlet'})
Radar summary: ${candidate.summary || 'n/a'}
Also covered by: ${candidate.alsoCoveredBy?.join(', ') || 'n/a'}

Start by fetching the primary source, then trace back to the ORIGINAL announcement (publisher statement, dev blog, press release, official post) and corroborate with 1-2 other outlets. Then report back with:
- The verified facts (who, what, when, platforms, dates, numbers), each with the URL it came from
- Any verbatim quotes worth using, with exact attribution
- The official announcement/primary-source URL
- An official trailer or announcement video URL (YouTube) if one exists
- The URL of the best official promo/press image you saw (og:image, press-kit art, key art)
- Anything that smells like spin or is unconfirmed, flagged as such

Report facts only. Do not write the article.`,
    },
  ];

  let wrapUp = false;
  for (let i = 0; i < 5; i++) {
    const remaining = deadline - Date.now();
    if (remaining < 20_000) throw new Error('Ran out of time during research');

    // Server-side web tools can stretch a single request for minutes, and the
    // deadline checks / wrap-up nudge only run BETWEEN calls — so an over-long
    // call would eat the whole phase with nothing salvaged. Cap each call and,
    // if it's the one that runs long, abort just that call and drop to wrap-up
    // mode (tiny tool budget, report-what-you-have) instead of failing the phase.
    const callCap = Math.max(Math.min(remaining - 40_000, 110_000), 30_000);
    const callController = new AbortController();
    const callTimer = setTimeout(() => callController.abort(), callCap);

    // Sonnet, not Opus: research is fact-gathering, and Opus + adaptive
    // thinking + web tools regularly blew the phase budget. Writing stays
    // on Opus where the voice matters.
    let response: Anthropic.Message;
    try {
      response = await client.messages.create(
        {
          model: 'claude-sonnet-5',
          max_tokens: 8000,
          tools: [
            { type: 'web_search_20260209', name: 'web_search', max_uses: wrapUp ? 1 : 2 },
            { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: wrapUp ? 1 : 3 },
          ],
          messages,
        },
        { signal: AbortSignal.any([signal, callController.signal]) }
      );
    } catch (err) {
      if (signal.aborted || !callController.signal.aborted) throw err;
      // This call ran long and was cut; nothing from it survives. Retry in
      // wrap-up mode — the model restarts its turn from the last kept message.
      if (!wrapUp) {
        wrapUp = true;
        messages.push({
          role: 'user',
          content:
            messages.length === 1
              ? 'Time is short. Fetch the primary source only, then immediately write your findings report from it in the requested format. No other tool calls.'
              : 'Stop researching now. Write your findings report immediately from what you have already verified, in the requested format. Do not make any more tool calls.',
        });
      }
      continue;
    } finally {
      clearTimeout(callTimer);
    }

    if (response.stop_reason === 'pause_turn') {
      // Cache the accumulated turn: continuations re-send the whole history
      // (including every fetched page) as input, so without a breakpoint each
      // loop iteration pays full price for the entire prefix again. With one,
      // the re-sent prefix bills at ~0.1x. Thinking blocks can't carry
      // cache_control (and must be passed back unmodified), so only mark the
      // last block when it's a cacheable type.
      const CACHEABLE = new Set([
        'text',
        'tool_use',
        'tool_result',
        'server_tool_use',
        'web_search_tool_result',
        'web_fetch_tool_result',
      ]);
      const last = response.content.length - 1;
      const content = response.content.map((block, i) =>
        i === last && CACHEABLE.has(block.type)
          ? ({ ...block, cache_control: { type: 'ephemeral' } } as Anthropic.ContentBlockParam)
          : block
      );
      messages = [messages[0], { role: 'assistant', content }];
      // Running short: tell the model to report what it has instead of
      // researching further, so we degrade to a thinner draft, not a timeout.
      if (wrapUp || deadline - Date.now() < 90_000) {
        wrapUp = true;
        messages.push({
          role: 'user',
          content:
            'Stop researching now. Write your findings report immediately from what you have already verified, in the requested format. Do not make any more tool calls.',
        });
      }
      continue;
    }
    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n');
    if (!text) throw new Error(`Research returned no text (stop_reason: ${response.stop_reason})`);
    return text;
  }
  throw new Error('Research did not complete within 5 continuations');
}

async function writeArticle(
  client: Anthropic,
  candidate: Candidate,
  research: string,
  samples: { title: string; excerpt: string; body: string }[],
  signal: AbortSignal
): Promise<Article> {
  const response = await client.messages.create(
    {
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      system: VOICE_RULES,
      output_config: { format: { type: 'json_schema', schema: ARTICLE_SCHEMA } },
      messages: [
        {
          role: 'user',
          content:
            `Recent published articles, for voice matching only (do NOT reuse their content):\n` +
            `${JSON.stringify(samples)}\n\n` +
            `Story type: ${candidate.storyType || 'news'}\n` +
            `Suggested author: ${candidate.suggestedAuthor || 'michael'}\n\n` +
            `Research notes (verified facts + sources):\n${research}\n\n` +
            `Write the article now. Original prose only, in the house voice.`,
        },
      ],
    },
    { signal }
  );

  if (response.stop_reason === 'max_tokens') {
    throw new Error('Article writing truncated: raise max_tokens');
  }
  const text = response.content.find((block) => block.type === 'text');
  if (!text) throw new Error(`Writing returned no text (stop_reason: ${response.stop_reason})`);
  return JSON.parse(text.text) as Article;
}

async function ensureUniqueSlug(slug: string): Promise<string> {
  const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const taken = await writeClient.fetch<string | null>(
    `*[_type == "newsPost" && slug.current == $slug][0]._id`,
    { slug: clean }
  );
  return taken ? `${clean}-${randomUUID().slice(0, 4)}` : clean;
}

async function sourcePromoImage(
  candidate: Candidate,
  researchImageUrl: string
): Promise<string | null> {
  const urls = [researchImageUrl, await extractOgImage(candidate.sourceUrl)].filter(Boolean) as string[];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'LifeMeetsPixel-Radar/1.0' },
        signal: AbortSignal.timeout(15000),
      });
      const type = res.headers.get('content-type') || '';
      if (!res.ok || !type.startsWith('image/')) continue;
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 10_000) continue; // skip tracking pixels / tiny icons
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: `${candidate._id}-promo`,
      });
      return asset._id;
    } catch {
      continue;
    }
  }
  return null;
}

async function extractOgImage(articleUrl: string): Promise<string | null> {
  try {
    const res = await fetch(articleUrl, {
      headers: { 'User-Agent': 'LifeMeetsPixel-Radar/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 200_000);
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function toPortableText(sections: ArticleSection[]) {
  const blocks: Record<string, unknown>[] = [];
  for (const section of sections) {
    if (section.kind === 'videoEmbed') {
      if (section.videoUrl) {
        blocks.push({
          _type: 'videoEmbed',
          _key: key(),
          url: section.videoUrl,
          caption: section.text || undefined,
        });
      }
      continue;
    }

    const style = section.kind === 'paragraph' ? 'normal' : section.kind;
    const markDefs: { _key: string; _type: 'link'; href: string }[] = [];
    const children: { _type: 'span'; _key: string; text: string; marks?: string[] }[] = [];

    let remaining = section.text;
    for (const link of section.links || []) {
      const idx = remaining.indexOf(link.anchor);
      if (idx === -1 || !link.anchor) continue;
      const defKey = key();
      markDefs.push({ _key: defKey, _type: 'link', href: link.href });
      if (idx > 0) children.push({ _type: 'span', _key: key(), text: remaining.slice(0, idx) });
      children.push({ _type: 'span', _key: key(), text: link.anchor, marks: [defKey] });
      remaining = remaining.slice(idx + link.anchor.length);
    }
    if (remaining) children.push({ _type: 'span', _key: key(), text: remaining });
    if (children.length === 0) continue;

    blocks.push({
      _type: 'block',
      _key: key(),
      style,
      ...(markDefs.length ? { markDefs } : {}),
      children,
    });
  }
  return blocks;
}

function key() {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

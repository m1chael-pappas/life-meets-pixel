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

// Vercel (Hobby) hard-kills the function at 300s WITHOUT running catch blocks,
// which strands the candidate in "approved" with no Telegram report. Budget the
// whole run to finish, or fail cleanly, inside that window.
const DRAFT_BUDGET_MS = 270_000;
// Held back from the research phase for writing + image sourcing + Sanity writes.
const WRITE_RESERVE_MS = 90_000;

interface Candidate {
  _id: string;
  headline: string;
  summary?: string;
  sourceUrl: string;
  sourceName?: string;
  alsoCoveredBy?: string[];
  storyType?: string;
  suggestedAuthor?: string;
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

export async function draftFromCandidate(candidateId: string): Promise<void> {
  const candidate = await writeClient.fetch<Candidate | null>(
    `*[_type == "storyCandidate" && _id == $id][0]`,
    { id: candidateId }
  );
  if (!candidate) throw new Error(`Candidate ${candidateId} not found`);

  const startedAt = Date.now();
  const remaining = () => DRAFT_BUDGET_MS - (Date.now() - startedAt);

  try {
    const client = new Anthropic();

    // Style samples so the writing call can match recent published voice.
    const samples = await writeClient.fetch<
      { title: string; excerpt: string; body: string }[]
    >(
      `*[_type == "newsPost" && defined(slug.current)]|order(publishedAt desc)[0...3]{
        title, excerpt, "body": pt::text(content)[0...500]
      }`
    );

    // 1. Research: web search + fetch, primary source first.
    const research = await runResearch(client, candidate, remaining);

    // 2. Write: structured output in the house voice.
    const article = await writeArticle(client, candidate, research, samples, remaining);

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
  } catch (err) {
    await writeClient.patch(candidate._id).set({ status: 'failed' }).commit();
    await sendMessage(
      `⚠️ <b>Drafting failed</b> for "${escapeHtml(candidate.headline)}":\n` +
        `${escapeHtml(String(err).slice(0, 300))}\n\n` +
        `Retry: /api/draft?candidateId=${candidate._id}`
    );
    throw err;
  }
}

async function runResearch(
  client: Anthropic,
  candidate: Candidate,
  remaining: () => number
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
    const budget = remaining() - WRITE_RESERVE_MS;
    if (budget < 20_000) throw new Error('Ran out of time during research');

    const response = await client.messages.create(
      {
        model: 'claude-opus-4-8',
        max_tokens: 16000,
        thinking: { type: 'adaptive' },
        tools: [
          { type: 'web_search_20260209', name: 'web_search', max_uses: wrapUp ? 1 : 4 },
          { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: wrapUp ? 1 : 5 },
        ],
        messages,
      },
      { timeout: budget, maxRetries: 1 }
    );

    if (response.stop_reason === 'pause_turn') {
      messages = [messages[0], { role: 'assistant', content: response.content }];
      // Running short: tell the model to report what it has instead of
      // researching further, so we degrade to a thinner draft, not a timeout.
      if (wrapUp || remaining() - WRITE_RESERVE_MS < 60_000) {
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
  remaining: () => number
): Promise<Article> {
  // Leave ~30s after writing for image sourcing + Sanity writes + Telegram.
  const budget = remaining() - 30_000;
  if (budget < 30_000) throw new Error('Ran out of time before writing');

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
    { timeout: budget, maxRetries: 1 }
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

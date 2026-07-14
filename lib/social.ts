// Server-only social publishing: generate captions in the house voice,
// render the branded template via headless Chromium, upload the PNG to
// Sanity (public CDN URL, required by the Instagram API), then post to
// Instagram + Facebook. Falls back to delivering the rendered image +
// captions to Telegram when Meta credentials are not configured.

import Anthropic from '@anthropic-ai/sdk';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

// chromium-min downloads this pack to /tmp at cold start (the full package
// can't be bundled: pnpm's symlinked node_modules breaks Vercel's function
// packaging). Keep the version in lockstep with the installed package.
const CHROMIUM_PACK =
  'https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar';

import {
  metaConfigured,
  postToFacebook,
  postToInstagram,
} from './meta';
import {
  sendMessage,
  sendPhoto,
} from './telegram';
import { writeClient } from '@/sanity/write-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lifemeetspixel.com';

interface SocialCandidate {
  _id: string;
  headline: string;
  pillLabel?: string;
  newsPostId?: string;
  status: string;
}

interface PublishedPost {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl?: string;
}

interface SocialCopy {
  hook: string;
  subtext: string;
  igCaption: string;
  fbMessage: string;
}

const COPY_SCHEMA = {
  type: 'object',
  properties: {
    hook: {
      type: 'string',
      description: 'Punchy template headline, 1-2 lines, max 90 chars. Opinionated, in Michael\'s voice. Not the article title verbatim.',
    },
    subtext: {
      type: 'string',
      description: 'Template supporting text, 1-3 sentences, max 220 chars, factual.',
    },
    igCaption: {
      type: 'string',
      description: 'Instagram caption: catchy opener, 2-sentence hook with a key fact, then "Full story: <link>" on its own line, then 4-6 tasteful hashtags (always include #LifeMeetsPixel). Max 2000 chars.',
    },
    fbMessage: {
      type: 'string',
      description: 'Facebook post text: hook + link, max 300 chars, no hashtag spam.',
    },
  },
  required: ['hook', 'subtext', 'igCaption', 'fbMessage'],
  additionalProperties: false,
} as const;

export async function postToSocials(candidateId: string): Promise<void> {
  const candidate = await writeClient.fetch<SocialCandidate | null>(
    `*[_type == "storyCandidate" && _id == $id][0]{_id, headline, pillLabel, newsPostId, status}`,
    { id: candidateId }
  );
  if (!candidate) throw new Error(`Candidate ${candidateId} not found`);
  const publishedId = candidate.newsPostId?.replace(/^drafts\./, '');
  if (!publishedId) throw new Error(`Candidate ${candidateId} has no linked newsPost`);

  const post = await writeClient.fetch<PublishedPost | null>(
    `*[_id == $id][0]{title, excerpt, "slug": slug.current, "imageUrl": featuredImage.asset->url}`,
    { id: publishedId }
  );
  if (!post) throw new Error(`Published post ${publishedId} not found`);
  if (!post.imageUrl) throw new Error(`Post ${publishedId} has no featured image to render`);

  try {
    const copy = await generateCopy(candidate, post);
    const png = await renderTemplate({
      img: `${post.imageUrl}?w=1600&q=85&auto=format`,
      pill: candidate.pillLabel || 'Gaming News',
      hook: copy.hook,
      sub: copy.subtext,
      fmt: 'feed',
    });

    const asset = await writeClient.assets.upload('image', png, {
      filename: `${candidate._id}-social-feed.png`,
      contentType: 'image/png',
    });
    const imagePublicUrl = asset.url;

    if (!metaConfigured()) {
      // Telegram photo captions cap at 1024 chars; send the copy separately.
      await sendPhoto(
        imagePublicUrl,
        `🖼 <b>Social template ready</b> (Meta not configured yet, post manually)`
      );
      await sendMessage(
        `<b>IG caption:</b>\n${escapeHtml(copy.igCaption)}\n\n` +
          `<b>FB post:</b>\n${escapeHtml(copy.fbMessage)}\n\n` +
          `Full-size image: ${imagePublicUrl}\n\n#cand:${candidate._id}`,
        { disablePreview: true }
      );
      return;
    }

    const igLink = await postToInstagram(imagePublicUrl, copy.igCaption);
    const fbLink = await postToFacebook(imagePublicUrl, copy.fbMessage);

    await writeClient.patch(candidate._id).set({ status: 'posted' }).commit();
    await sendMessage(
      `📣 <b>Posted to socials: ${escapeHtml(post.title)}</b>\n\n` +
        `Instagram: ${igLink}\nFacebook: ${fbLink}\n\n#cand:${candidate._id}`,
      { disablePreview: true }
    );
  } catch (err) {
    await sendMessage(
      `⚠️ <b>Social posting failed</b> for "${escapeHtml(post.title)}":\n` +
        `${escapeHtml(String(err).slice(0, 300))}\n\n` +
        `Retry: /api/social?candidateId=${candidate._id}`
    );
    throw err;
  }
}

async function generateCopy(
  candidate: SocialCandidate,
  post: PublishedPost
): Promise<SocialCopy> {
  const client = new Anthropic();
  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4000,
    thinking: { type: 'adaptive' },
    system: `You write social media copy for Life Meets Pixel, a retro-gaming geek-culture site run by Michael (Sydney, programmer, lifelong gamer). Voice: punchy, honest, lightly skeptical, no hype, Australian English. NEVER use em dashes (U+2014). Hashtags tasteful, 4-6 max.`,
    output_config: { format: { type: 'json_schema', schema: COPY_SCHEMA } },
    messages: [
      {
        role: 'user',
        content: JSON.stringify({
          articleTitle: post.title,
          excerpt: post.excerpt,
          storyHeadline: candidate.headline,
          category: candidate.pillLabel,
          link: `${SITE_URL}/news/${post.slug}`,
        }),
      },
    ],
  });
  const text = response.content.find((block) => block.type === 'text');
  if (!text) throw new Error(`Copy generation returned no text (${response.stop_reason})`);
  return JSON.parse(text.text) as SocialCopy;
}

async function renderTemplate(params: {
  img: string;
  pill: string;
  hook: string;
  sub: string;
  fmt: 'feed' | 'story' | 'fb';
}): Promise<Buffer> {
  const dims = { feed: [1080, 1350], story: [1080, 1920], fb: [1200, 630] }[params.fmt];
  const query = new URLSearchParams({
    ...params,
    secret: process.env.CRON_SECRET || '',
  });
  const url = `${SITE_URL}/social-template?${query}`;

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(CHROMIUM_PACK),
    headless: true,
    defaultViewport: { width: dims[0], height: dims[1], deviceScaleFactor: 1 },
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');
    const png = await page.screenshot({ type: 'png' });
    return Buffer.from(png);
  } finally {
    await browser.close();
  }
}

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

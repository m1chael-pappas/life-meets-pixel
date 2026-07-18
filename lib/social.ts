// Server-only social publishing: generate carousel copy in the house voice,
// render the branded template slides via headless Chromium, upload the PNGs
// to Sanity (public CDN URLs, required by the Instagram API), then post a
// carousel to Instagram + a multi-photo post to Facebook. Falls back to
// delivering the rendered slides + captions to Telegram when Meta
// credentials are not configured.
//
// Posting is QUEUED, not immediate: approving a story books it into the next
// free slot (08:00 / 18:00 Sydney), and the /api/social cron drains at most
// one due candidate per run. Burst-publishing five stories in one evening
// used to cannibalise reach; now it fills two and a half days of slots.

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
  postCarouselToInstagram,
  postPhotosToFacebook,
} from './meta';
import {
  sendMessage,
  sendPhoto,
} from './telegram';
import type { SlidePayload } from './social-templates';
import { writeClient } from '@/sanity/write-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lifemeetspixel.com';

// Posting slots in Sydney local time. Two per day: evening AEST catches
// US morning, morning AEST catches US evening.
const SLOT_HOURS_SYDNEY = [8, 18];

interface SocialCandidate {
  _id: string;
  headline: string;
  pillLabel?: string;
  newsPostId?: string;
  status: string;
  tagHandles?: string[];
}

interface PublishedPost {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl?: string;
  inlineImages?: string[];
}

interface SocialCopy {
  hook: string;
  bullets: string[];
  bulletsHeading: string;
  dateLabel: string;
  dateBig: string;
  chips: string[];
  shareTitle: string;
  shareSub: string;
  question: string;
  igCaption: string;
  fbMessage: string;
}

// Copy for the "news — hype mode" carousel from the approved claude.design
// doc: hook slide → bullets slide → date card (optional) → share CTA.
const COPY_SCHEMA = {
  type: 'object',
  properties: {
    hook: {
      type: 'string',
      description: 'Hook slide headline, max 70 chars, opinionated, in Michael\'s voice, works in uppercase pixel type. Not the article title verbatim.',
    },
    bulletsHeading: {
      type: 'string',
      description: 'Heading for the facts slide, e.g. "What we know". Max 24 chars.',
    },
    bullets: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 4,
      description: 'Facts slide bullets: one concrete fact each, max 60 chars, no repetition of the hook.',
    },
    dateLabel: {
      type: 'string',
      description: 'Label for the date card, e.g. "RELEASE DATE" / "EARLY ACCESS". Empty string if the story has no headline date.',
    },
    dateBig: {
      type: 'string',
      description: 'Giant date-card text, e.g. "OCT 15" or "LATE 2026". Empty string to skip the date slide.',
    },
    chips: {
      type: 'array',
      items: { type: 'string' },
      maxItems: 3,
      description: 'Platform chips for the date card, e.g. ["PS5","Switch","PC"]. Empty if unknown.',
    },
    shareTitle: {
      type: 'string',
      description: 'Share-CTA slide headline, e.g. "Know a Castlevania fan?". Max 45 chars.',
    },
    shareSub: {
      type: 'string',
      description: 'Share-CTA slide subtext, e.g. "Send them this. They\'ll owe you one." Max 70 chars.',
    },
    question: {
      type: 'string',
      description: 'Closing comment-bait question for the end of the caption, max 80 chars. Genuine, not clickbait.',
    },
    igCaption: {
      type: 'string',
      description: 'Instagram caption. Front-load search keywords in the first line. NEVER include a raw URL: say "Full story: link in bio". If tagHandles are provided, weave the @mentions in naturally (e.g. "from @studio"). End with the comment-bait question, then 4-6 tasteful hashtags (always include #LifeMeetsPixel). Max 2000 chars.',
    },
    fbMessage: {
      type: 'string',
      description: 'Facebook post text: hook + full article link (links ARE clickable on Facebook), max 300 chars, no hashtag spam.',
    },
  },
  required: [
    'hook', 'bulletsHeading', 'bullets', 'dateLabel', 'dateBig', 'chips',
    'shareTitle', 'shareSub', 'question', 'igCaption', 'fbMessage',
  ],
  additionalProperties: false,
} as const;

// Book a candidate into the next free posting slot. Called on approval
// instead of posting immediately.
export async function queueForSocials(candidateId: string): Promise<string> {
  const candidate = await writeClient.fetch<SocialCandidate | null>(
    `*[_type == "storyCandidate" && _id == $id][0]{_id, headline, status}`,
    { id: candidateId }
  );
  if (!candidate) throw new Error(`Candidate ${candidateId} not found`);

  const taken = await writeClient.fetch<string[]>(
    `*[_type == "storyCandidate" && status == "queued" && defined(scheduledAt)].scheduledAt`
  );
  const takenSet = new Set(taken);
  const slot = upcomingSlots(new Date(), 60).find((s) => !takenSet.has(s.toISOString()));
  if (!slot) throw new Error('No free social slot found in the next 30 days');

  await writeClient
    .patch(candidateId)
    .set({ status: 'queued', scheduledAt: slot.toISOString() })
    .commit();

  const local = slot.toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  await sendMessage(
    `🗓 <b>Queued for socials: ${escapeHtml(candidate.headline)}</b>\n\n` +
      `Slot: ${local} (Sydney)\n\n#cand:${candidateId}`,
    { disablePreview: true }
  );
  return slot.toISOString();
}

// Drain the queue: post at most ONE due candidate per invocation, so a
// backlog still goes out spaced rather than in a burst.
export async function processSocialQueue(): Promise<string[]> {
  const due = await writeClient.fetch<{ _id: string }[]>(
    `*[_type == "storyCandidate" && status == "queued" && scheduledAt <= now()] | order(scheduledAt asc)[0...1]{_id}`
  );
  const posted: string[] = [];
  for (const candidate of due) {
    await postToSocials(candidate._id);
    posted.push(candidate._id);
  }
  return posted;
}

export async function postToSocials(candidateId: string): Promise<void> {
  const candidate = await writeClient.fetch<SocialCandidate | null>(
    `*[_type == "storyCandidate" && _id == $id][0]{_id, headline, pillLabel, newsPostId, status, tagHandles}`,
    { id: candidateId }
  );
  if (!candidate) throw new Error(`Candidate ${candidateId} not found`);
  const publishedId = candidate.newsPostId?.replace(/^drafts\./, '');
  if (!publishedId) throw new Error(`Candidate ${candidateId} has no linked newsPost`);

  const post = await writeClient.fetch<PublishedPost | null>(
    `*[_id == $id][0]{title, excerpt, "slug": slug.current, "imageUrl": featuredImage.asset->url, "inlineImages": content[_type == "image"].asset->url}`,
    { id: publishedId }
  );
  if (!post) throw new Error(`Published post ${publishedId} not found`);
  if (!post.imageUrl) throw new Error(`Post ${publishedId} has no featured image to render`);

  try {
    const copy = await generateCopy(candidate, post);
    const pill = candidate.pillLabel || 'Gaming News';
    const size = (url: string) => `${url}?w=1600&q=85&auto=format`;
    const hero = size(post.imageUrl);
    // Bullets slide gets the first inline article image so the deck isn't
    // one photo repeated; falls back to the hero.
    const second = post.inlineImages?.[0] ? size(post.inlineImages[0]) : hero;

    // "News — hype mode" deck from the approved design doc:
    // hook → bullets → date card (when the story has one) → share CTA.
    const deck: SlidePayload[] = [
      { t: 'hype.hook', img: hero, kicker: pill, kickerPill: true, title: copy.hook, cue: 'everything we know' },
      { t: 'hype.bullets', img: second, heading: copy.bulletsHeading, items: copy.bullets.slice(0, 4) },
      ...(copy.dateBig
        ? [{ t: 'hype.date', label: copy.dateLabel || 'RELEASE DATE', big: copy.dateBig, chips: copy.chips.slice(0, 3) } as SlidePayload]
        : []),
      { t: 'hype.cta', title: copy.shareTitle, sub: copy.shareSub, button: 'Share ➤', handle: '@life_meets_pixel' },
    ];
    const slides = await renderSlides(deck);

    const slideUrls: string[] = [];
    for (let i = 0; i < slides.length; i++) {
      const asset = await writeClient.assets.upload('image', slides[i], {
        filename: `${candidate._id}-social-slide-${i + 1}.png`,
        contentType: 'image/png',
      });
      slideUrls.push(asset.url);
    }

    if (!metaConfigured()) {
      // Telegram photo captions cap at 1024 chars; send the copy separately.
      await sendPhoto(
        slideUrls[0],
        `🖼 <b>Social carousel ready</b> (Meta not configured yet, post manually)`
      );
      await sendMessage(
        `<b>IG caption:</b>\n${escapeHtml(copy.igCaption)}\n\n` +
          `<b>FB post:</b>\n${escapeHtml(copy.fbMessage)}\n\n` +
          `Slides:\n${slideUrls.join('\n')}\n\n#cand:${candidate._id}`,
        { disablePreview: true }
      );
      return;
    }

    const igLink = await postCarouselToInstagram(slideUrls, copy.igCaption);
    const fbLink = await postPhotosToFacebook(slideUrls, copy.fbMessage);

    await writeClient.patch(candidate._id).set({ status: 'posted' }).commit();
    await sendMessage(
      `📣 <b>Posted to socials: ${escapeHtml(post.title)}</b>\n\n` +
        `Instagram (${slideUrls.length} slides): ${igLink}\nFacebook: ${fbLink}\n\n#cand:${candidate._id}`,
      { disablePreview: true }
    );
  } catch (err) {
    await sendMessage(
      `⚠️ <b>Social posting failed</b> for "${escapeHtml(post.title)}":\n` +
        `${escapeHtml(String(err).slice(0, 300))}\n\n` +
        `Retry: /api/social?candidateId=${candidate._id}&mode=now`
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
    // Sonnet: short caption copy doesn't need Opus (2026-07-16 cost review).
    model: 'claude-sonnet-5',
    max_tokens: 4000,
    thinking: { type: 'adaptive' },
    system: `You write social media copy for Life Meets Pixel, a retro-gaming geek-culture site run by Michael (Sydney, programmer, lifelong gamer). Voice: punchy, honest, lightly skeptical, no hype, Australian English. NEVER use em dashes (U+2014). Hashtags tasteful, 4-6 max. Only @mention the handles provided in tagHandles; never invent a handle.`,
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
          tagHandles: candidate.tagHandles || [],
        }),
      },
    ],
  });
  const text = response.content.find((block) => block.type === 'text');
  if (!text) throw new Error(`Copy generation returned no text (${response.stop_reason})`);
  return JSON.parse(text.text) as SocialCopy;
}

// One browser, one page per slide: launching Chromium is the expensive part.
async function renderSlides(deck: SlidePayload[]): Promise<Buffer[]> {
  const dims: [number, number] = [1080, 1350]; // feed format
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(CHROMIUM_PACK),
    headless: true,
    defaultViewport: { width: dims[0], height: dims[1], deviceScaleFactor: 1 },
  });
  try {
    const buffers: Buffer[] = [];
    for (const slide of deck) {
      const query = new URLSearchParams({
        p: JSON.stringify(slide),
        secret: process.env.CRON_SECRET || '',
      });
      const page = await browser.newPage();
      await page.goto(`${SITE_URL}/social-template?${query}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });
      await page.evaluateHandle('document.fonts.ready');
      const png = await page.screenshot({ type: 'png' });
      buffers.push(Buffer.from(png));
      await page.close();
    }
    return buffers;
  } finally {
    await browser.close();
  }
}

// Upcoming posting slots in UTC, derived from Sydney wall-clock hours so the
// schedule survives DST shifts.
function upcomingSlots(from: Date, count: number): Date[] {
  const offsetMs = sydneyOffsetMs(from);
  const sydNow = new Date(from.getTime() + offsetMs);
  const slots: Date[] = [];
  for (let day = 0; slots.length < count && day < 30; day++) {
    for (const hour of SLOT_HOURS_SYDNEY) {
      const sydSlot = Date.UTC(
        sydNow.getUTCFullYear(),
        sydNow.getUTCMonth(),
        sydNow.getUTCDate() + day,
        hour,
        0,
        0
      );
      const utcSlot = new Date(sydSlot - sydneyOffsetMs(new Date(sydSlot - offsetMs)));
      if (utcSlot > from) slots.push(utcSlot);
    }
  }
  return slots;
}

function sydneyOffsetMs(at: Date): number {
  const name =
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Australia/Sydney',
      timeZoneName: 'longOffset',
    })
      .formatToParts(at)
      .find((part) => part.type === 'timeZoneName')?.value || 'GMT+10:00';
  const match = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 10 * 3_600_000;
  const sign = match[1] === '-' ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] || 0)) * 60_000;
}

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

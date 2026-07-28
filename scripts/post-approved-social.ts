/* eslint-disable no-console */
// One-off poster for a carousel that Michael has already approved slide by
// slide in /social-preview. Deliberately does NOT call generateCopy: the whole
// point is that what ships is what was signed off.
//
// Renders with a locally installed chrome-headless-shell against the dev
// server, because @sparticuz/chromium-min in lib/social.ts targets Vercel's
// Lambda environment.
//
//   RENDER_ONLY=1 pnpm tsx scripts/post-approved-social.ts   # render + preview, no posting
//   POST=1        pnpm tsx scripts/post-approved-social.ts   # render + post to IG/FB

import fs from 'node:fs';
import path from 'node:path';

import dotenv from 'dotenv';
import puppeteer from 'puppeteer-core';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const OUT = process.env.OUT_DIR || '/tmp/approved-social';
const TEMPLATE_ORIGIN = process.env.TEMPLATE_ORIGIN || 'http://localhost:3000';
const EXEC =
  process.env.CHROME_PATH ||
  `${process.env.HOME}/.cache/puppeteer/chrome-headless-shell/linux-150.0.7871.24/chrome-headless-shell-linux64/chrome-headless-shell`;

const HERO =
  'https://cdn.sanity.io/images/1ir3sv5r/production/dfb986d9210068e03f94a544d0a270dcd97ef872-1900x1080.jpg?w=1600&q=85&auto=format';
const SECOND =
  'https://cdn.sanity.io/images/1ir3sv5r/production/319dfa4586ee7a6f3ceedb973d28a2664a0d7495-1900x1080.jpg?w=1600&q=85&auto=format';
// Third official still so the fact slide isn't a repeat of the hook slide.
const THIRD =
  'https://cdn.sanity.io/images/1ir3sv5r/production/19412427d5ad30c884998b13c86af770314154ef-1900x1080.jpg?w=1600&q=85&auto=format';
const LINK = 'https://lifemeetspixel.com/news/xbox-exclusives-game-pass-studio-backlash';
const HANDLE = '@life_meets_pixel';

const deck = [
  {
    t: 'hype.hook',
    img: HERO,
    kicker: 'Gaming News',
    kickerPill: true,
    title: 'Xbox wants exclusives back. Its own studios want off Game Pass.',
    cue: 'both things are true',
  },
  {
    t: 'hype.bullets',
    img: SECOND,
    heading: 'What Xbox said',
    items: [
      'Gears of War: E-Day and Clockwork Revolution are permanent exclusives',
      'Not timed, and not the last, says strategy chief Matthew Ball',
      'Large live service games still go multiplatform',
      'Halo and Fable still ship to PS5 anyway',
    ],
  },
  {
    t: 'hype.fact',
    img: THIRD,
    heading: 'The other half',
    body: 'Bloomberg\'s Jason Schreier says plenty of Xbox studio leadership "absolutely detest" Game Pass and think it destroyed the value of their games.',
  },
  {
    t: 'hype.date',
    label: 'E-DAY LAUNCHES',
    big: 'OCT 6',
    chips: ['Xbox', 'PC', 'Day one on Game Pass'],
    img: HERO,
  },
  {
    t: 'hype.cta',
    title: 'When did you last PAY for an Xbox game?',
    sub: 'Be honest. Your answer is the entire argument happening inside Xbox right now.',
    button: '💬 Say the year',
    handle: HANDLE,
  },
];

const igCaption = `Xbox console exclusives are back, and the timing could not be stranger.

@xbox strategy chief Matthew Ball says Gears of War: E-Day and Clockwork Revolution are permanent exclusives, not timed, with more coming. The same week, Bloomberg's Jason Schreier reported that plenty of Xbox studio leadership "absolutely detest" Game Pass and believe it destroyed the value of their games. E-Day still lands day one on Game Pass on 6 October.

Full story: link in bio

When did you last actually PAY for an Xbox game?

#LifeMeetsPixel #GamingNews #Xbox #GamePass #GearsOfWar`;

const fbMessage = `Xbox says permanent exclusives are back, while reporting suggests its own studio bosses have turned on day-one Game Pass. Both are true at once, and Gears of War: E-Day still lands on Game Pass day one in October. ${LINK}`;

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: EXEC,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1080, height: 1350, deviceScaleFactor: 1 },
  });

  const files: string[] = [];
  try {
    for (let i = 0; i < deck.length; i++) {
      const page = await browser.newPage();
      const url = `${TEMPLATE_ORIGIN}/social-template?p=${encodeURIComponent(JSON.stringify(deck[i]))}`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
      await page.evaluateHandle('document.fonts.ready');
      const file = path.join(OUT, `slide-${i + 1}.png`);
      await page.screenshot({ path: file as `${string}.png` });
      files.push(file);
      console.log('rendered', file);
      await page.close();
    }
  } finally {
    await browser.close();
  }

  if (!process.env.POST) {
    console.log('\nRENDER ONLY. Set POST=1 to publish.');
    return;
  }

  const { createClient } = await import('@sanity/client');
  const client = createClient({
    projectId: '1ir3sv5r',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });

  const slideUrls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const asset = await client.assets.upload('image', fs.createReadStream(files[i]), {
      filename: `xbox-gamepass-social-slide-${i + 1}.png`,
      contentType: 'image/png',
    });
    slideUrls.push(asset.url);
    console.log('uploaded', asset.url);
  }

  const { metaConfigured, postCarouselToInstagram, postPhotosToFacebook } = await import(
    '../lib/meta'
  );
  if (!metaConfigured()) throw new Error('Meta not configured');

  const igLink = await postCarouselToInstagram(slideUrls, igCaption);
  console.log('IG:', igLink);
  const fbLink = await postPhotosToFacebook(slideUrls, fbMessage);
  console.log('FB:', fbLink);

  await client.patch('candidate-xbox-gamepass-exclusives').set({ status: 'posted' }).commit();
  console.log('candidate marked posted');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

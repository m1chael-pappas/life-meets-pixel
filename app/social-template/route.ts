import { NextRequest } from 'next/server';

import {
  renderSlideHtml,
  type SlidePayload,
} from '@/lib/social-templates';

// Renders the Life Meets Pixel social template as a plain HTML page. The
// headless renderer in lib/social.ts screenshots this page once per slide.
//
// New carousel slide system (from the claude.design "Carousel Templates" doc):
//   ?p=<URI-encoded JSON SlidePayload> — grid/hype/zine slide families,
//   see lib/social-templates.ts.
//
// Legacy flat params (?variant=hook|photo|fact|cta) are kept for the older
// single-card flow. Palette + proportions sampled from
// templates/social/reference/*.png.

const FORMATS: Record<string, { width: number; height: number; imageShare: number }> = {
  feed: { width: 1080, height: 1350, imageShare: 0.55 },
  story: { width: 1080, height: 1920, imageShare: 0.62 },
  fb: { width: 1200, height: 630, imageShare: 0 }, // image as full background
};

const SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  // Localhost preview (pnpm dev) skips the secret so /social-preview can
  // showcase slides without leaking CRON_SECRET into page source.
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev && (!SECRET || params.get('secret') !== SECRET)) {
    return new Response('Not found', { status: 404 });
  }

  const payloadRaw = params.get('p');
  if (payloadRaw) {
    let payload: SlidePayload;
    try {
      payload = JSON.parse(payloadRaw) as SlidePayload;
    } catch {
      return new Response('Bad payload', { status: 400 });
    }
    return new Response(renderSlideHtml(payload), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const fmt = FORMATS[params.get('fmt') || 'feed'] || FORMATS.feed;
  const variant = params.get('variant') || 'hook';
  const img = params.get('img') || '';
  const pill = params.get('pill') || 'Gaming News';
  const hook = params.get('hook') || '';
  const sub = params.get('sub') || '';
  const idx = params.get('idx') || '';

  const shared = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${fmt.width}px; height: ${fmt.height}px; overflow: hidden; }
  body {
    font-family: 'JetBrains Mono', monospace;
    background: #fcf8ed;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .pill {
    position: absolute;
    top: ${Math.round(fmt.height * 0.033)}px;
    right: ${Math.round(fmt.width * 0.055)}px;
    background: #9659fc;
    color: #fffef8;
    font-weight: 700;
    font-size: ${Math.round(fmt.width * 0.033)}px;
    padding: ${Math.round(fmt.width * 0.011)}px ${Math.round(fmt.width * 0.024)}px;
    border-radius: ${Math.round(fmt.width * 0.012)}px;
    letter-spacing: 0.5px;
    z-index: 2;
  }
  .hook {
    color: #9659fc;
    font-weight: 800;
    font-size: ${Math.round(fmt.width * 0.045)}px;
    line-height: 1.35;
  }
  .sub {
    color: #191613;
    font-weight: 500;
    font-size: ${Math.round(fmt.width * 0.028)}px;
    line-height: 1.5;
    white-space: pre-line;
  }
  .site {
    position: absolute;
    bottom: ${Math.round(fmt.height * 0.033)}px;
    left: 0; right: 0;
    text-align: center;
    color: #191613;
    opacity: 0.55;
    font-weight: 700;
    font-size: ${Math.round(fmt.width * 0.022)}px;
    letter-spacing: 1px;
  }
  .idx {
    color: #9659fc;
    font-weight: 800;
    font-size: ${Math.round(fmt.width * 0.033)}px;
    opacity: 0.75;
    letter-spacing: 2px;
  }`;

  let bodyHtml: string;
  let extraCss = '';

  if (variant === 'photo') {
    extraCss = `
  .image { position: absolute; inset: 0; background-image: url("${escapeAttr(img)}"); background-size: cover; background-position: center; }`;
    bodyHtml = `
  <div class="image"></div>
  <div class="pill">${escapeHtml(pill)}</div>`;
  } else if (variant === 'fact' || variant === 'cta') {
    extraCss = `
  .panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: ${Math.round(fmt.width * 0.09)}px;
    gap: ${Math.round(fmt.height * 0.035)}px;
  }`;
    bodyHtml = `
  <div class="pill">${escapeHtml(pill)}</div>
  <div class="panel">
    ${idx ? `<div class="idx">${escapeHtml(idx)}</div>` : ''}
    <div class="hook">${escapeHtml(hook)}</div>
    ${sub ? `<div class="sub">${escapeHtml(sub)}</div>` : ''}
  </div>
  <div class="site">lifemeetspixel.com</div>`;
  } else {
    extraCss = `
  .image {
    height: ${fmt.imageShare > 0 ? Math.round(fmt.height * fmt.imageShare) + 'px' : '100%'};
    ${fmt.imageShare === 0 ? 'position: absolute; inset: 0;' : ''}
    background-image: url("${escapeAttr(img)}");
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
  }
  .panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: ${Math.round(fmt.width * 0.06)}px;
    gap: ${Math.round(fmt.height * 0.03)}px;
    ${fmt.imageShare === 0 ? `
    position: absolute; left: 0; right: 0; bottom: 0;
    background: rgba(252, 248, 237, 0.96);
    padding: 28px 48px;
    ` : ''}
  }`;
    bodyHtml = `
  <div class="image"></div>
  <div class="pill">${escapeHtml(pill)}</div>
  <div class="panel">
    <div class="hook">${escapeHtml(hook)}</div>
    ${sub ? `<div class="sub">${escapeHtml(sub)}</div>` : ''}
  </div>`;
  }

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
<style>${shared}${extraCss}
</style>
</head>
<body>${bodyHtml}
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(text: string) {
  return text.replace(/"/g, '%22').replace(/</g, '%3C');
}

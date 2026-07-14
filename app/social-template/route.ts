import { NextRequest } from 'next/server';

// Renders the Life Meets Pixel social template as a plain HTML page, sized
// by ?fmt=. The headless renderer in lib/social.ts screenshots this page.
// Palette + proportions sampled from templates/social/reference/*.png.

const FORMATS: Record<string, { width: number; height: number; imageShare: number }> = {
  feed: { width: 1080, height: 1350, imageShare: 0.55 },
  story: { width: 1080, height: 1920, imageShare: 0.62 },
  fb: { width: 1200, height: 630, imageShare: 0 }, // image as full background
};

const SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  if (!SECRET || params.get('secret') !== SECRET) {
    return new Response('Not found', { status: 404 });
  }

  const fmt = FORMATS[params.get('fmt') || 'feed'] || FORMATS.feed;
  const img = params.get('img') || '';
  const pill = params.get('pill') || 'Gaming News';
  const hook = params.get('hook') || '';
  const sub = params.get('sub') || '';

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${fmt.width}px; height: ${fmt.height}px; overflow: hidden; }
  body {
    font-family: 'JetBrains Mono', monospace;
    background: #fcf8ed;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .image {
    height: ${fmt.imageShare > 0 ? Math.round(fmt.height * fmt.imageShare) + 'px' : '100%'};
    ${fmt.imageShare === 0 ? 'position: absolute; inset: 0;' : ''}
    background-image: url("${escapeAttr(img)}");
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
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
</style>
</head>
<body>
  <div class="image"></div>
  <div class="pill">${escapeHtml(pill)}</div>
  <div class="panel">
    <div class="hook">${escapeHtml(hook)}</div>
    ${sub ? `<div class="sub">${escapeHtml(sub)}</div>` : ''}
  </div>
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

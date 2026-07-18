// Carousel slide templates, ported 1:1 from the approved claude.design doc
// ("Carousel Templates.dc.html", project 3c47c41e). Three families:
//   grid — dark frame + cream panels + purple pills (extends the site feed)
//   hype — full-bleed art, giant Press Start 2P type, gradient scrims
//   zine — inverted cream "print magazine" pages
// Per the design doc's test plan: reviews rotate grid/hype for A/B data,
// news + hot takes use hype, top-5 countdowns use grid.

export type SlidePayload =
  // grid family
  | { t: 'grid.hook'; img: string; pill: string; title: string; sub: string; cue: string }
  | { t: 'grid.context'; label: string; statement: string; img: string; body: string }
  | { t: 'grid.verdict'; label: string; points: { sign: '+' | '-'; text: string }[]; cue?: string; img?: string }
  | { t: 'grid.score'; kicker: string; score: string; blurb: string }
  | { t: 'grid.rank'; img: string; rank: string; name: string; blurb: string; date?: string; top?: boolean }
  | { t: 'grid.cta'; title: string; sub: string; button: string; handle: string; cream?: boolean }
  // hype family
  | { t: 'hype.hook'; img: string; kicker: string; title: string; cue: string; kickerPill?: boolean; fit?: 'contain' }
  | { t: 'hype.fact'; img: string; heading: string; body: string; fit?: 'contain' }
  | { t: 'hype.bullets'; img: string; heading: string; items: string[]; fit?: 'contain' }
  | { t: 'hype.date'; label: string; big: string; chips: string[] }
  | { t: 'hype.score'; kicker: string; big: string; button: string }
  | { t: 'hype.cta'; title: string; sub: string; button: string; handle?: string }
  // zine family
  | { t: 'zine.cover'; img: string; label: string; issue: string; title: string; cue: string }
  | { t: 'zine.summary'; label: string; body: string; quote: string; handle: string }
  | { t: 'zine.stats'; img: string; label: string; cells: { big: string; small: string }[] }
  | { t: 'zine.verdict'; label: string; score: string; blurb: string }
  | { t: 'zine.save'; label: string; title: string; button: string; foot: string };

const W = 1080;
const H = 1350;

const esc = (t: string) =>
  (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escAttr = (t: string) => (t || '').replace(/"/g, '%22').replace(/</g, '%3C');

const PSTART = "'Press Start 2P',monospace";
const MONO = "'JetBrains Mono',monospace";

const img = (src: string, style = '') =>
  `<div style="position:absolute;inset:0;background-image:url(&quot;${escAttr(src)}&quot;);background-size:cover;background-position:center;${style}"></div>`;

// Wide or small art can't full-bleed a 4:5 frame without ugly cropping.
// fit:'contain' keeps the art sharp and whole over a blurred copy of itself.
const hypeImg = (src: string, fit?: 'contain') =>
  fit === 'contain'
    ? `<div style="position:absolute;inset:0;filter:blur(18px) brightness(.4) saturate(.9);transform:scale(1.08)">${img(src)}</div>
  <div style="position:absolute;inset:0;background-image:url(&quot;${escAttr(src)}&quot;);background-size:contain;background-repeat:no-repeat;background-position:center 22%"></div>`
    : img(src);


function body(slide: SlidePayload): string {
  switch (slide.t) {
    // ── grid ──────────────────────────────────────────────────────────
    case 'grid.hook':
      return `<div style="width:${W}px;height:${H}px;background:#0f0e11;position:relative;display:flex;flex-direction:column;overflow:hidden">
  <div style="position:relative;height:680px">${img(slide.img)}
    <div style="position:absolute;top:32px;right:32px;background:#7c5cff;color:#fff;font-family:${MONO};font-weight:700;font-size:26px;padding:10px 26px;border-radius:10px">${esc(slide.pill)}</div>
  </div>
  <div style="flex:1;background:#faf3e4;color:#17141c;display:flex;flex-direction:column;justify-content:center;gap:36px;padding:64px 72px">
    <div style="color:#6a48f0;font-family:${PSTART};font-size:38px;line-height:1.6;text-wrap:pretty">${esc(slide.title)}</div>
    <div style="font-size:32px;line-height:1.6;color:#3c3545">${esc(slide.sub)}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;font-size:26px;color:#6a48f0;font-weight:700"><span>${esc(slide.cue)}</span><span>→</span></div>
  </div>
</div>`;
    case 'grid.context':
      return `<div style="width:${W}px;height:${H}px;background:#0f0e11;position:relative;display:flex;flex-direction:column;padding:88px 80px;box-sizing:border-box;gap:48px">
  <div style="color:#7c5cff;font-weight:800;font-size:30px;letter-spacing:.12em">${esc(slide.label)}</div>
  <div style="color:#faf3e4;font-family:${PSTART};font-size:34px;line-height:1.7;text-wrap:pretty">${esc(slide.statement)}</div>
  <div style="position:relative;flex:1;min-height:380px;border-radius:18px;overflow:hidden">${img(slide.img)}</div>
  <div style="color:#b7aec6;font-size:32px;line-height:1.65">${esc(slide.body)}</div>
</div>`;
    case 'grid.verdict':
      return `<div style="width:${W}px;height:${H}px;background:#0f0e11;position:relative;display:flex;flex-direction:column;padding:88px 80px;box-sizing:border-box;gap:56px;overflow:hidden">
  ${slide.img ? `<div style="position:absolute;inset:0;filter:blur(14px) brightness(.35) saturate(.85);transform:scale(1.06)">${img(slide.img)}</div>` : ''}
  <div style="position:relative;color:#a88bff;font-weight:800;font-size:30px;letter-spacing:.12em">${esc(slide.label)}</div>
  <div style="position:relative;display:flex;flex-direction:column;gap:44px">
    ${slide.points
      .map(
        (p) => `<div style="display:flex;gap:28px;align-items:flex-start">
      <div style="background:${p.sign === '+' ? '#7c5cff' : '#faf3e4'};color:${p.sign === '+' ? '#fff' : '#17141c'};font-weight:800;font-size:30px;min-width:64px;height:64px;border-radius:12px;display:flex;align-items:center;justify-content:center">${p.sign === '+' ? '+' : '−'}</div>
      <div style="color:${p.sign === '+' ? '#faf3e4' : '#b7aec6'};font-size:38px;font-weight:700;line-height:1.5">${esc(p.text)}</div>
    </div>`
      )
      .join('\n')}
  </div>
  ${slide.cue ? `<div style="position:relative;margin-top:auto;color:#a88bff;font-size:26px;font-weight:700;display:flex;justify-content:space-between"><span>${esc(slide.cue)}</span><span>→</span></div>` : ''}
</div>`;
    case 'grid.score':
      return `<div style="width:${W}px;height:${H}px;background:#7c5cff;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;padding:80px;box-sizing:border-box">
  <div style="color:rgba(255,255,255,.75);font-weight:700;font-size:30px;letter-spacing:.14em">${esc(slide.kicker)}</div>
  <div style="color:#fff;font-family:${PSTART};font-size:200px;line-height:1">${esc(slide.score)}</div>
  <div style="color:#fff;font-family:${PSTART};font-size:26px">out of 10</div>
  <div style="border-top:3px solid rgba(255,255,255,.35);padding-top:40px;color:rgba(255,255,255,.9);font-size:32px;line-height:1.6;text-align:center;max-width:800px">${esc(slide.blurb)}</div>
</div>`;
    case 'grid.rank':
      return `<div style="width:${W}px;height:${H}px;background:#0f0e11;position:relative;display:flex;flex-direction:column;overflow:hidden">
  <div style="position:relative;height:760px">${img(slide.img)}
    ${slide.top ? `<div style="position:absolute;top:32px;right:32px;background:#7c5cff;color:#fff;font-family:${PSTART};font-size:26px;padding:14px 28px;border-radius:10px">#1</div>` : ''}
  </div>
  <div style="flex:1;background:${slide.top ? '#7c5cff' : '#faf3e4'};color:${slide.top ? '#fff' : '#17141c'};display:flex;align-items:center;gap:52px;padding:56px 72px">
    <div style="color:${slide.top ? '#fff' : '#6a48f0'};font-family:${PSTART};font-size:100px;line-height:1">${esc(slide.rank)}</div>
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="font-weight:800;font-size:44px">${esc(slide.name)}</div>
      ${slide.date ? `<div style="color:${slide.top ? '#fff' : '#6a48f0'};font-weight:800;font-size:26px;letter-spacing:.1em">${esc(slide.date)}</div>` : ''}
      <div style="font-size:30px;line-height:1.55;color:${slide.top ? 'rgba(255,255,255,.85)' : '#3c3545'}">${esc(slide.blurb)}</div>
    </div>
  </div>
</div>`;
    case 'grid.cta':
      return `<div style="width:${W}px;height:${H}px;background:${slide.cream ? '#faf3e4' : '#0f0e11'};position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;padding:80px;box-sizing:border-box;text-align:center">
  <div style="color:${slide.cream ? '#17141c' : '#faf3e4'};font-family:${PSTART};font-size:42px;line-height:1.6;text-wrap:pretty">${esc(slide.title)}</div>
  <div style="color:${slide.cream ? '#3c3545' : '#b7aec6'};font-size:36px;line-height:1.6;max-width:760px">${esc(slide.sub)}</div>
  <div style="background:#7c5cff;color:#fff;font-weight:800;font-size:36px;padding:24px 56px;border-radius:14px">${esc(slide.button)}</div>
  <div style="color:${slide.cream ? '#6a48f0' : '#a88bff'};font-weight:700;font-size:30px">${esc(slide.handle)}</div>
</div>`;
    // ── hype ──────────────────────────────────────────────────────────
    case 'hype.hook':
      return `<div style="width:${W}px;height:${H}px;position:relative;background:#0f0e11;overflow:hidden">
  ${hypeImg(slide.img, slide.fit)}
  <div style="position:absolute;left:0;right:0;bottom:0;height:62%;background:linear-gradient(to top,rgba(10,8,14,.96) 30%,rgba(10,8,14,0))"></div>
  <div style="position:absolute;left:64px;right:64px;bottom:72px;display:flex;flex-direction:column;gap:32px">
    ${
      slide.kickerPill
        ? `<div style="display:flex"><div style="background:#7c5cff;color:#fff;font-weight:700;font-size:26px;padding:10px 26px;border-radius:10px">${esc(slide.kicker)}</div></div>`
        : `<div style="color:#a88bff;font-weight:800;font-size:30px;letter-spacing:.14em;font-family:${MONO}">${esc(slide.kicker)}</div>`
    }
    <div style="color:#fff;font-family:${PSTART};font-size:50px;line-height:1.5;text-transform:uppercase;text-wrap:pretty">${esc(slide.title)}</div>
    <div style="display:flex;align-items:center;gap:20px;color:#a88bff;font-weight:700;font-size:30px;font-family:${MONO}"><span>${esc(slide.cue)}</span><span style="letter-spacing:-2px">→→→</span></div>
  </div>
</div>`;
    case 'hype.fact':
      return `<div style="width:${W}px;height:${H}px;position:relative;background:#0f0e11;overflow:hidden">
  ${hypeImg(slide.img, slide.fit)}
  <div style="position:absolute;left:0;right:0;bottom:0;height:55%;background:linear-gradient(to top,rgba(10,8,14,.96) 25%,rgba(10,8,14,0))"></div>
  <div style="position:absolute;left:64px;right:64px;bottom:72px;display:flex;flex-direction:column;gap:24px">
    <div style="color:#a88bff;font-family:${PSTART};font-size:34px;line-height:1.5;text-transform:uppercase">${esc(slide.heading)}</div>
    <div style="color:#e9e2f4;font-size:36px;line-height:1.6;font-family:${MONO}">${esc(slide.body)}</div>
  </div>
</div>`;
    case 'hype.bullets':
      return `<div style="width:${W}px;height:${H}px;position:relative;background:#0f0e11;overflow:hidden">
  ${hypeImg(slide.img, slide.fit)}
  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(10,8,14,.97) 45%,rgba(10,8,14,.25))"></div>
  <div style="position:absolute;left:64px;right:64px;bottom:72px;display:flex;flex-direction:column;gap:40px">
    <div style="color:#a88bff;font-family:${PSTART};font-size:32px;line-height:1.5;text-transform:uppercase">${esc(slide.heading)}</div>
    <div style="display:flex;flex-direction:column;gap:28px;color:#e9e2f4;font-size:34px;line-height:1.55">
      ${slide.items.map((item) => `<div style="display:flex;gap:24px"><span style="color:#7c5cff;font-weight:800">▸</span><span>${esc(item)}</span></div>`).join('\n')}
    </div>
  </div>
</div>`;
    case 'hype.date':
      return `<div style="width:${W}px;height:${H}px;background:#7c5cff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px">
  <div style="color:rgba(255,255,255,.75);font-weight:700;font-size:30px;letter-spacing:.14em">${esc(slide.label)}</div>
  <div style="color:#fff;font-family:${PSTART};font-size:110px;line-height:1.3;text-align:center">${esc(slide.big)}</div>
  <div style="display:flex;gap:20px">
    ${slide.chips.map((chip) => `<div style="border:3px solid #fff;color:#fff;font-weight:700;font-size:30px;padding:14px 34px;border-radius:12px">${esc(chip)}</div>`).join('\n')}
  </div>
</div>`;
    case 'hype.score':
      return `<div style="width:${W}px;height:${H}px;position:relative;background:#7c5cff;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px">
  <div style="color:rgba(255,255,255,.75);font-weight:700;font-size:32px;letter-spacing:.14em;font-family:${MONO}">${esc(slide.kicker)}</div>
  <div style="color:#fff;font-family:${PSTART};font-size:250px;line-height:1">${esc(slide.big)}</div>
  <div style="background:#0f0e11;color:#fff;font-family:${PSTART};font-size:28px;text-transform:uppercase;padding:24px 48px;border-radius:12px">${esc(slide.button)}</div>
</div>`;
    case 'hype.cta':
      return `<div style="width:${W}px;height:${H}px;background:#0f0e11;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;text-align:center;padding:80px;box-sizing:border-box">
  <div style="color:#fff;font-family:${PSTART};font-size:44px;line-height:1.6;text-wrap:pretty">${esc(slide.title)}</div>
  <div style="color:#b7aec6;font-size:36px;line-height:1.6;max-width:780px;font-family:${MONO}">${esc(slide.sub)}</div>
  <div style="background:#7c5cff;color:#fff;font-weight:800;font-size:38px;padding:26px 60px;border-radius:14px;font-family:${MONO}">${esc(slide.button)}</div>
  ${slide.handle ? `<div style="color:#a88bff;font-weight:700;font-size:30px">${esc(slide.handle)}</div>` : ''}
</div>`;
    // ── zine ──────────────────────────────────────────────────────────
    case 'zine.cover':
      return `<div style="width:${W}px;height:${H}px;background:#faf3e4;position:relative;display:flex;flex-direction:column;padding:80px;box-sizing:border-box;gap:44px">
  <div style="display:flex;justify-content:space-between;border-bottom:4px solid #17141c;padding-bottom:24px;color:#17141c;font-weight:700;font-size:26px"><span>${esc(slide.label)}</span><span>${esc(slide.issue)}</span></div>
  <div style="position:relative;height:560px;border:4px solid #17141c;overflow:hidden">${img(slide.img)}</div>
  <div style="color:#17141c;font-family:${PSTART};font-size:36px;line-height:1.65;text-wrap:pretty">${esc(slide.title)}</div>
  <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;color:#6a48f0;font-weight:700;font-size:28px;border-top:2px solid #d8cfbc;padding-top:28px"><span>${esc(slide.cue)}</span><span>swipe →</span></div>
</div>`;
    case 'zine.summary':
      return `<div style="width:${W}px;height:${H}px;background:#faf3e4;position:relative;display:flex;flex-direction:column;padding:80px;box-sizing:border-box;gap:48px">
  <div style="color:#6a48f0;font-weight:800;font-size:28px;letter-spacing:.12em">${esc(slide.label)}</div>
  <div style="color:#17141c;font-size:44px;line-height:1.7;text-wrap:pretty">${esc(slide.body)}</div>
  <div style="border-left:6px solid #7c5cff;padding-left:36px;color:#3c3545;font-size:36px;line-height:1.65;font-style:italic">${esc(slide.quote)}</div>
  <div style="margin-top:auto;color:#9c94a8;font-size:26px;border-top:2px solid #d8cfbc;padding-top:28px">${esc(slide.handle)}</div>
</div>`;
    case 'zine.stats':
      return `<div style="width:${W}px;height:${H}px;background:#17141c;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;filter:blur(14px) brightness(.45) saturate(.85);transform:scale(1.06)">${img(slide.img)}</div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:80px;box-sizing:border-box;gap:48px">
    <div style="color:#a88bff;font-weight:800;font-size:28px;letter-spacing:.12em">${esc(slide.label)}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:44px;flex:1;align-content:center">
      ${slide.cells
        .map(
          (cell) => `<div style="border:2px solid rgba(168,139,255,.35);background:rgba(15,13,20,.62);padding:44px;display:flex;flex-direction:column;gap:14px">
        <div style="color:#7c5cff;font-family:${PSTART};font-size:48px">${esc(cell.big)}</div>
        <div style="color:#b7aec6;font-size:28px;line-height:1.5">${esc(cell.small)}</div>
      </div>`
        )
        .join('\n')}
    </div>
  </div>
</div>`;
    case 'zine.verdict':
      return `<div style="width:${W}px;height:${H}px;background:#faf3e4;position:relative;display:flex;flex-direction:column;padding:80px;box-sizing:border-box;gap:40px;justify-content:center">
  <div style="color:#6a48f0;font-weight:800;font-size:28px;letter-spacing:.12em">${esc(slide.label)}</div>
  <div style="display:flex;align-items:baseline;gap:24px"><div style="color:#17141c;font-family:${PSTART};font-size:160px;line-height:1">${esc(slide.score)}</div><div style="color:#9c94a8;font-family:${PSTART};font-size:40px">/10</div></div>
  <div style="border-top:4px solid #17141c;padding-top:40px;color:#17141c;font-size:40px;line-height:1.65;text-wrap:pretty">${esc(slide.blurb)}</div>
</div>`;
    case 'zine.save':
      return `<div style="width:${W}px;height:${H}px;background:#faf3e4;position:relative;display:flex;flex-direction:column;padding:80px;box-sizing:border-box;align-items:center;justify-content:center;gap:44px;text-align:center">
  <div style="color:#6a48f0;font-weight:800;font-size:28px;letter-spacing:.12em">${esc(slide.label)}</div>
  <div style="color:#17141c;font-family:${PSTART};font-size:40px;line-height:1.65;text-wrap:pretty">${esc(slide.title)}</div>
  <div style="border:4px solid #17141c;color:#17141c;font-weight:800;font-size:34px;padding:22px 52px;border-radius:14px">${esc(slide.button)}</div>
  <div style="color:#9c94a8;font-size:28px">${esc(slide.foot)}</div>
</div>`;
  }
}

export function renderSlideHtml(slide: SlidePayload): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Press+Start+2P&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
  body { font-family: ${MONO}; background: #0f0e11; }
</style>
</head>
<body>${body(slide)}</body>
</html>`;
}

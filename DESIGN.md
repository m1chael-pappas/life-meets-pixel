---
name: Life Meets Pixel
description: A 1998 games magazine rendered in pixels — neon on near-black, zero radius, hard black shadows, and every verdict shown as stats you can audit.
colors:
  ground-deep: "#0a0820"
  ground: "#14112e"
  ground-raised: "#1f1a3d"
  ground-edge: "#2a2350"
  ink: "#f5f0ff"
  ink-dim: "#b9b0d8"
  ink-mute: "#8d84ad"
  attract-magenta: "#ff3d8b"
  phosphor-cyan: "#3ee8ff"
  insert-coin-lime: "#aaff3d"
  coin-op-gold: "#ffd23d"
  damage-red: "#ff5275"
  on-accent: "#0a0820"
  chip-ground: "#0a0820"
  focus-ring: "#3ee8ff"
  shadow-hard: "#000000"
typography:
  hero-numeral:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  portrait-initial:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "52px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  badge-glyph:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  badge-glyph-sm:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  hero-title:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.02em"
  page-title:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.02em"
  display:
    fontFamily: "VT323, monospace"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  headline:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.02em"
  title:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.02em"
  title-md:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.02em"
  subhead:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.02em"
  subhead-sm:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.02em"
  lede:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  body-article:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  body-lg:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  body-ui:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  body-sm:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  caption:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  meta:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.1em"
  label-lg:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
  label:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
  micro-label:
    fontFamily: "Press Start 2P, system-ui, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
  glyph:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  glyph-sm:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "8px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  none: "0"
spacing:
  pixel: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "56px"
components:
  button-primary:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 18px"
  button-primary-hover:
    backgroundColor: "{colors.phosphor-cyan}"
    textColor: "{colors.on-accent}"
  button-magenta-hover:
    backgroundColor: "{colors.attract-magenta}"
    textColor: "{colors.on-accent}"
  button-lime-hover:
    backgroundColor: "{colors.insert-coin-lime}"
    textColor: "{colors.on-accent}"
  card-review:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px"
  badge-category:
    backgroundColor: "#000000"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "6px 8px"
  badge-category-featured:
    backgroundColor: "{colors.attract-magenta}"
    textColor: "{colors.on-accent}"
  score-box:
    backgroundColor: "#000000"
    textColor: "{colors.insert-coin-lime}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 10px"
  tag:
    backgroundColor: "{colors.ground-raised}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.none}"
    padding: "3px 6px"
  input-field:
    backgroundColor: "rgba(62, 232, 255, 0.04)"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  input-field-focus:
    backgroundColor: "rgba(255, 61, 139, 0.06)"
    textColor: "{colors.ink}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-dim}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  nav-link-active:
    backgroundColor: "{colors.ground-raised}"
    textColor: "{colors.ink}"
---

# Design System: Life Meets Pixel

## Overview

**Creative North Star: "The 1998 Games Magazine"**

This is a newsstand games magazine that happens to be rendered in pixels. Not an arcade cabinet, not a nostalgia gag — a publication. The density is editorial: ruled section headers, boxed sidebars, ruled dividers, pull quotes, a scored verdict with its workings printed alongside. Every surface behaves like a page that was laid out by someone with an opinion and a deadline, then reproduced on a CRT instead of on paper.

The homepage is the one place the system plays the game it borrows from.
Its set pieces (the boss screen and High Scores cabinets, the hills band behind News & Previews, the character bio, the versus screen and the cartridge links) are arcade and platformer furniture, and they hold the only rounded shapes and soft light in the system.
Every page past the homepage stays a publication.

The mood is **warm and nostalgic, playful and irreverent**. The pixels are affection, not costume — the system loves the era it borrows from and never winks at it. That affection shows up as craft (a 9×9 hand-plotted sprite for every category, hearts that render in halves, a score meter built from twenty discrete cells) and the irreverence shows up as voice (a `CHARACTER BIO` that maxes out honesty and zeroes out sponsors, a `► TELL US WE ARE WRONG` button, a Konami code, an optional scanline overlay you can switch off). The distinction matters more than any single token: **an era rendered with care reads as design; an era rendered as a joke reads as kitsch, and kitsch is a confirmed anti-reference.**

The system is built to survive a full palette swap. Three complete palettes (Midnight Neon, Amber and Candy) swap under identical markup via `data-palette` on `<html>`, and Candy is the light mode: a white page with ink type and hard ink shadows. Nothing in the system may assume a dark background, a light accent, or a specific hue. That single constraint explains most of the token architecture below: `--on-accent`, `--scrim-rgb`, `--shadow-hard`, `--type-shadow` and `--focus-ring` all exist because a literal colour that worked on Midnight broke on Candy.

Confirmed anti-references, all three binding: **modern SaaS minimalism** (soft gradients, rounded cards, glassmorphism, thin grey type on white), **mainstream games press** (IGN/GameSpot chrome, red-and-white brand bars, dense ad rails, autoplay video), and **nostalgia kitsch** (Comic Sans, star fields, spinning GIFs, "under construction" gags).

**Key Characteristics:**

- Zero radius everywhere except the homepage arcade set pieces: the cabinet bezels and the VS coin
- Four fonts with four strictly separate jobs: Press Start 2P headings and labels, Fraunces prose, JetBrains Mono data, VT323 pull quotes only
- Hard, un-blurred, pure-black offset shadows as the entire depth model
- Three complete palettes under one markup, each independently WCAG AA
- Border weight (1 / 2 / 3 / 4 / 6px) encodes hierarchy the way a magazine uses rules
- Hand-plotted pixel sprites, never a vector icon set
- Controls are tactile: they lift toward you on hover and depress on click

## Colors

Neon on near-black with a magenta/cyan lead and lime reserved for good news — the Midnight Neon palette below is canonical, and three alternates re-map every token underneath it.

### Primary

- **Attract-Mode Magenta** (`#ff3d8b`): the brand's loudest voice. The header's 3px bottom rule, the ticker label fill, section-header numerals and underline, featured-card borders, the article hero frame, and every `h2` inside article body copy. It marks structure and importance, never body text.
- **Phosphor Cyan** (`#3ee8ff`): the interactive colour. Every link at rest, the default button border, card hover borders, the logo mark, article `h3`s, subject bylines, and the focus ring's source value. If something responds to you, it is cyan.

### Secondary

- **Insert-Coin Lime** (`#aaff3d`): the good-news accent. Scores of **8.0 and up**, filled HP cells, the live status dot, the `►` bullet in body lists, and the primary CTA button border. Its scarcity is what makes a high score read as a high score.
- **Coin-Op Gold** (`#ffd23d`): the middling-score accent (**6.0–7.9**) and the skip-link fill. It is a warning colour, not a decorative one.

### Tertiary

- **Damage Red** (`#ff5275`): failure and cost. Scores **under 6.0**, low HP cells, the `cons` column rule, required-field markers, and the heart sprite's fill. Never used for emphasis that isn't about something going badly.

### Neutral

- **Void** (`#0a0820`): the page ground. Also the topbar fill, and the value `--on-accent` points at, so text on a neon slab is always the page's own ground colour.
- **Deep Panel** (`#14112e`): the default raised surface. Cards, the header body, stat blocks, buttons at rest, article content panels.
- **Mid Panel** (`#1f1a3d`): the second layer up. Card media wells, tag fills, hero side items, nav hover fills.
- **Edge** (`#2a2350`): borders, dividers, dotted rules, empty HP cells, avatar grounds. The workhorse structural line colour.
- **Paper White** (`#f5f0ff`): primary text and headings.
- **Dim Ink** (`#b9b0d8`): body copy, excerpts, secondary labels. The most-used text colour on the site.
- **Muted Ink** (`#8d84ad`): timestamps, breadcrumbs, metadata, placeholders. Audited to ≥4.5:1 on grounds 0–2.

### Alternate Palettes

Two complete re-mappings ship alongside Midnight Neon, switched by `data-palette` on `<html>` and persisted to `localStorage`:

- **Amber** — monochrome phosphor terminal, ground `#0d0700`, ink `#ffb000`, with `#ff5252` as the only contrasting accent. Like Candy, its lit surfaces stay Midnight and its character art and marquee lettering keep the bright `--pop-*` accents.
- **Candy** — the light mode. Page `#ffffff`, panels `#f6f3fc` and `#ebe5f7`, border `#cdc3e6`, ink `#14112e`. Its accents are **not** the Midnight accents; each is dark enough to clear 4.5:1 as text on the three grounds and as a fill under white type (`#c8005a`, `#006f84`, `#2b7318`, `#a14c00`). `--shadow-hard` is the ink colour, so cards keep a hard dark offset shadow, and `--type-shadow` is white. Three kinds of surface stay lit and keep the Midnight tokens inside a Candy or Amber page: the homepage cabinet screens, the contact terminal and Clerk's cards. Card images carry no foot fade on Candy (`--media-fade: transparent`); on the dark palettes the fade is the palette scrim. Marquee lettering and character art use `--pop-1` to `--pop-4`, `--art-paper` and `--art-shade`, which hold the bright accents and the light and dark body colours in every palette.

### Named Rules

**The Palette-Agnostic Rule.** Never hardcode a colour that already exists as a token. Three palettes swap under identical markup, so a literal `rgba(10, 8, 32, …)` in a scrim is not a shortcut, it is a defect on the other two — this exact mistake put the hero headline at 1.31:1 on Candy. Scrims use `rgba(var(--scrim-rgb), …)`, hard box shadows use `var(--shadow-hard)`, hard type shadows use `var(--type-shadow)`, and darker accent shades use `--neon-1-deep` to `--neon-4-deep`, which mix each palette's own accent 72% with black.

**The Both-Ways Rule.** Any token used as both a foreground and a background needs its counterpart tokenised too. Text sitting on a neon fill is `var(--on-accent)`, never `#000` — when Candy's accents were darkened for legibility as *text*, black-on-accent fell to 3.32:1 as a *background*. The same trap runs the other way: the hard chips that sit on imagery (score box, category badge, social mark, author avatar) hardcoded a `#000` *ground* under a tokenised `color`, which put Candy's deliberately-darkened accents at 3.31:1 on black. Those grounds are now `var(--chip-ground)`, defined once as `var(--bg-0)` so it re-resolves per palette without an override. After changing any colour token, grep for it as a `background:` value, not just as a `color:` value.

**The No-CMS-Colour Rule.** A colour that arrives from Sanity is a literal hex and knows nothing about the palette. An author's `accentColor` was applied inline and rendered `#3ee8ff` on every palette — 1.24:1 on Candy — and no CSS audit could ever find it, because the value never appears in a stylesheet. Stored colours are snapped to the nearest accent token with `paletteAccent()` in `lib/content/mappings.ts` before they reach a `style` prop. Brand colours are subject to the same rule: Discord's blurple is a token here, not `#a3adf6`.

**The Focus Ring Is Not An Accent Rule.** `--focus-ring` is its own token and must never be pointed at `--neon-*`. The accent that reads on a dark ground is invisible on the light one; Candy's focus ring is near-black by design.

**The Four-Ground Audit Rule.** Contrast is checked against every background token the colour can land on (`--bg-0` through `--bg-3`), not just the page ground. Checking `--bg-0` alone is how body copy inside every card once shipped at 2.75:1 on a retired palette.

## Typography

**Display Font:** VT323 (with `monospace`)
**Prose Font:** Fraunces, variable, with the SOFT axis at 100 (with `Georgia, "Times New Roman", serif`)
**Data/Label Font:** JetBrains Mono (with `ui-monospace, monospace`)
**Heading Font:** Press Start 2P (with `system-ui, monospace`)

**Character:** Four fonts, four jobs, no overlap. Press Start 2P is the magazine's cover type — chunky, all-caps by habit, and physically unreadable in a paragraph. Fraunces carries running prose. JetBrains Mono carries everything that is *read as data*: summaries, stat rows, scores, tags, timestamps, metadata, code. VT323 appears exactly once in the vocabulary, as the pull-quote voice, which is why it still feels like an event.

**The prose face.** Fraunces, loaded through `next/font/google` as a variable font with the `SOFT` and `opsz` axes, and set with `font-variation-settings: "SOFT" 100` so its serifs are rounded. It replaced IBM Plex Sans on 2026-10-02. The owner's first choice was New Spirit, which Adobe Fonts only serves to websites on a paid Creative Cloud plan; Fraunces is the free face closest to it. `--font-prose` is declared on `body`, where next/font defines `--font-fraunces`. Labels that used the old prose face at 600 weight (cartridge names, player tags, the bio kicker and stat labels) are JetBrains Mono 700, the system's label voice.

### Hierarchy

The text ramp is 11 · 12 · 13 · 14 · 15 · 16 · 17 · 18 · 20 · 22 · 24 · 26px. Two faces run it in parallel — Press Start 2P owns the heading and label steps, JetBrains Mono owns the reading steps — and they never occupy the same step for the same purpose.

Two tiers sit outside that ramp on purpose, and neither is text:

- **Display tier** (32 · 44 · 52 · 64px, Press Start 2P): single characters used as artwork — the badge glyph on the contact and about heroes. These are shapes, not words, so the reading ramp does not apply.
- **Glyph tier** (8 · 9px, JetBrains Mono): the `◆` and `▸` marks in `::before` pseudo-elements. Decorative punctuation standing in as a bullet, never a label a reader has to parse.

**Anything a reader reads sits on the text ramp, at 11px or above.** If a value between 10px and the glyph tier appears, it is a defect rather than a new step.

**Press Start 2P (headings, labels, numbers):**

- **Display** (VT323 400, 26px, 1.4): pull quotes inside article body copy. Nowhere else, and VT323 appears nowhere else either.
- **Headline** (24px, 1.4, `text-shadow: 4px 4px 0 var(--shadow-hard)`): the article title in the hero. The offset text shadow is part of the role, not decoration.
- **Title** (22px, 1.4): page `h1` and article-body `h2` (magenta, 2px dashed bottom rule).
- **Extruded** (24 · 32 · 40 · 48 · 56 · 64px, `.extruded-title`): the homepage set-piece titles, meaning the boss title, HIGH SCORES, MULTIPLAYER and PRESS START. Arcade marquee lettering: a per-line vertical gradient face with a white band, a thin edge ring, then three stacked copies each darker than the last over a hard shadow, stepping down-right at 9% of the size snapped to whole pixels. Letters are tracked 0.12em so one letter's layers clear the next. Titles are set word by word with `MarqueeWords` (`components/retro/arcade-art.tsx`): each `.extruded-word` draws its face in `::after` from `data-text`, and a word whose first glyph has a left side bearing in Press Start 2P (I, L, T, Y, 1 and some punctuation) is pulled back to the cell edge so wrapped lines share one left edge. The homepage section titles (LATEST REVIEWS, NEWS & PREVIEWS) use the same lettering at 24px, with no section numbers.
- **Subhead** (16px): `h2`, article-body `h3`, the versus screen's lead and VS coin.
- **Subhead-sm** (14px, 1.5): `h3`, card titles, score boxes.
- **Label-lg** (12px, 0.1em): nav links, buttons, section numerals, stat keys.
- **Label** (11px, 0.1em): badges, field labels, HP row heads, breadcrumbs, section-header actions. The most-used role in the system by count.

**Fraunces (running prose):**

- **Lede** (20px, 1.6, max 34em): the article standfirst, rendered from `review.summary`.
- **Body** (19px, 1.7): article copy, in `--ink`, running the full width of the article column.

**JetBrains Mono (everything read as data):**

- **Body-ui** (15px, 1.55): the document base size.
- **Body-sm** (14px): card excerpts, footer links, form inputs.
- **Caption** (13px): card subjects, stat rows, author bios.
- **Meta** (12px, 0.1em, often uppercased): timestamps, tags, breadcrumb trails, ticker items, score-key bands.

### Named Rules

**The 8px Grid Rule.** Press Start 2P is drawn on an 8px grid and renders with **zero anti-aliasing only at multiples of 8** — 8, 16, 24, 32. Measured across 8–32px, every other size fringes 16–55% of its inked pixels, and `-webkit-font-smoothing: none` changes nothing (verified: byte-identical output). Display type is therefore snapped to 16 or 24. The small labels at 11–14px are a known, accepted exception: 8px is illegible and 16px would reflow the nav, badges and cards. **Any new Press Start 2P at display size must be 16, 24 or 32.**

**The Legibility Floor Rule.** The target floor for anything a reader has to
parse is **11px**. Press Start 2P is a bitmap face with no anti-aliasing
headroom, so 10px is not a smaller version of the type, it is a broken one.

Every readable rule now meets it (raised from 8, 9 and 10px on 2026-09-27).
The only declarations under 11px are the decorative glyphs in
`.lmp-ticker__item::before` and `.footer-col a::before`, which carry no text.
Check the responsive blocks when raising a base size: there are five of them,
and a base-size fix that misses one regresses at that breakpoint.

**The Press-Start-Is-A-Label-Font Rule.** Press Start 2P never sets a paragraph. It sets headings, labels, numbers and buttons. Any run of pixel type longer than about eight words is a defect — the reader's eye stalls and the nostalgia turns into work.

**The No-Weight Rule.** Press Start 2P and VT323 ship at 400 only, and headings explicitly set `font-weight: normal`. Hierarchy is built from size, colour and tracking, never from weight. JetBrains Mono loads 400/500/700 and is the only place a bold is available.

**The Measure Rule.** Article body copy runs the full width of its column (owner's direction, 2026-10-02); the standfirst keeps a **34em** cap. Caps on the prose face are set in `em`, never `ch`. `ch` is the advance of the character `0`: on a monospace face that equals one character, but on a proportional face it is much narrower than the average glyph, so an inherited `72ch` rendered 95 characters. Any surface still set in JetBrains Mono may keep `ch`. **When a face changes, every `ch`-based cap silently stops meaning what it says.**

## Layout

A centred 1280px container with a 24px gutter (20px under 1280, 16px under 1024), sections on a 56px vertical rhythm (48px, then 36px as the viewport narrows), and a fixed 48px background grid that never scrolls — `background-attachment: fixed` on two 1px linear gradients, so the page reads as content moving across a stationary board.

Spacing is built on a 4px pixel unit (`--pixel: 4px`) and stays on multiples of it: 4 / 6 / 8 / 10 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 56 / 64.

**Grids and how they collapse:**

| Region | ≥1281px | ≤1280px | ≤1024px | ≤640px |
|---|---|---|---|---|
| Hero | `1.85fr 1fr`, 32px | `1.85fr 1fr` | `1fr` | `1fr` |
| Character bio | `256px 1fr` | `256px 1fr` | `192px 1fr` | `1fr` |
| Versus screen | `1fr 1fr` | `1fr 1fr` | `1fr`, divider turns sideways | `1fr` |
| Reviews grid | `repeat(3, 1fr)`, 20px | 16px gap | `1fr 1fr` | `1fr` |
| News grid | `1.4fr 1fr 1fr`, 16px | 14px gap | `1fr 1fr` | `1fr` |
| Article body | `1fr 320px`, 40px | `1fr 300px`, 28px | `1fr`, 32px | `1fr` |
| Pros / cons | `1fr 1fr` | `1fr 1fr` | 10px gap | `1fr` |

Breakpoints in use: **1280** (laptop tightening), **1024** (tablet: hero and grids collapse, nav compresses), **1023.98** (mobile: drawer nav, reduced padding), **640** and **480** (phone type scale-down). The 1024/1023.98 pair is deliberate — one governs layout collapse, the other governs the nav becoming a drawer.

### Named Rules

**The Zero-Overflow Rule.** No route may scroll horizontally at any width from 320px up. The historical failure was the 721–831px band, where `.lmp-nav` was a `nowrap` flex row with a constant 832px right edge while the hamburger only engaged at 720px. Test the band, not just the breakpoints.

**The Min-Width-Auto Rule.** Any grid or flex child that can receive unbreakable content (an email address, a URL, a long title) needs an explicit `min-width: 0`. Default `min-width: auto` is what set a 355px min-content floor on the contact page and overflowed every viewport below ~383px.

## Elevation & Depth

Hybrid, and the split is strict: **hard offset shadows are the depth model for every UI surface; soft light is reserved exclusively for the arcade screens' inner glow and the sticky header's drop.** There is no ambient elevation, no blurred card shadow, no glow on hover. Depth reads as a solid black shape offset down-and-right, exactly as a sticker sits above a board — which is also why the whole system survives on a light palette by swapping `--shadow-hard` to a white glow instead.

Layering is otherwise tonal: four ground steps (`#0a0820` → `#2a2350`) do the work that blur would do in a soft system.

### Shadow Vocabulary

- **Rest** (`box-shadow: 4px 4px 0 var(--shadow-hard)`): the default for cards, buttons, stat blocks, article panels and body images.
- **Raised** (`box-shadow: 6px 6px 0 var(--shadow-hard)`): the about hero, the article cover plate — surfaces that outrank an ordinary card.
- **Hover** (`box-shadow: 6px 6px 0` on buttons, `8px 8px 0` on cards, paired with a negative translate): the offset deepens because the element moved toward you, not because a new shadow appeared.
- **Pressed** (`box-shadow: 0 0 0 var(--shadow-hard)` + `translate(2px, 2px)`): the shadow is consumed as the element goes down.
- **Structural** (`box-shadow: 0 4px 0 0 #000, 0 8px 24px rgba(0,0,0,0.5)` on the sticky header): the only place a hard offset and a blurred drop are stacked, because the header floats over scrolling content.
- **Heavy** (`var(--hard-shadow-lg)`, `12px 12px 0 var(--shadow-hard)`): the homepage set pieces, meaning the arcade cabinets, the character bio and the versus screen.
- **Screen glow** (`inset 0 0 90px` and `70px` of the bezel accent through `color-mix`): the two arcade screens only.

### Named Rules

**The No-Blur Rule.** A UI shadow has a blur radius of zero and is pure black. Blur exists in exactly two places in this system — the header drop and the arcade screen glow — and adding a third is a defect, not a refinement.

**The Lift-And-Press Rule.** Interactive surfaces move. Hover is `translate(-2px, -2px)` (cards: `-3px`) with a deeper offset; active is `translate(2px, 2px)` with the offset removed. The shadow and the transform always change together — a shadow change without movement reads as a glow, which this system does not have.

## Shapes

Rectangles. The form language is a magazine page: boxes, rules and borders, with border *weight* carrying hierarchy the way a printed spread uses hairlines and heavy rules.

- **Radius: 0, everywhere.** `--radius: 0`, and Tailwind's `--radius-sm/md/lg/xl` are all mapped to `0` so utility classes cannot reintroduce a corner. Even the focus ring sets `border-radius: 0`. The homepage arcade set pieces are the one exception (see the Zero-Radius Rule).
- **Border weights** are a scale: **1px** hairline dividers and inner frame lines · **2px** chips, badges, small controls, section rules, inputs · **3px** cards, buttons, panels, the header's bottom rule · **4px** the article hero and cover plate · **6px** the arcade cabinet bezels.
- **Border style** carries meaning: solid for structure, **dashed** for internal editorial dividers (article `h2` underlines, stat-block heads, card footers), **dotted** for list-row separators (HP rows, stat rows).
- **Pixel sprites** are the icon language: category glyphs and hearts are hand-plotted character grids (9×9 for hearts, uniform 9×9 for nav glyphs) rendered as `<rect>` SVGs with `shape-rendering: crispEdges` and `image-rendering: pixelated`. They scale to any size without softening.
- **Media wells** are 16:9 for cards, 3:4 for the article cover plate, with images at `saturate(1.1)` and a bottom-up scrim gradient.

### Named Rules

**The Zero-Radius Rule.** Nothing in this system is rounded — no card, no button, no input, no avatar, no focus ring. A single `border-radius` above 0 breaks the whole material premise, and there is no exception for third-party embeds; Clerk's UI is overridden to match.
The homepage arcade set pieces are the one deliberate exception: the cabinet bezels and screens (`--bezel-radius`, `--screen-radius`) and the round VS coin.
Nothing outside them gets a corner.

**The Pixel-Icon Rule.** Site-facing iconography is the sprite system, never a vector icon set. Lucide exists in the repo for one shadcn primitive's internals and must not migrate into site chrome — a smooth 24px stroke icon next to a 9×9 sprite instantly reads as a different product.

**The No-Rotation Rule.** Never rotate an element that holds text.
The one exception is the score burst on the boss screen, which tilts 12° with its text by design. The yellow kicker above the boss title sits level: a tilted plate behind a single line of upright text read as crooked text.
Any angle that is not a multiple of 90° resamples the glyphs, and pixel type loses its hard edges first.
Tilt the shape and keep the label upright, as the cartridge links do: only `.cart-tile__shell` carries `--tilt`.

## Components

### Buttons

Tactile and clicky: these are physical hardware, and they move.

- **Shape:** square (0 radius), 3px border, `4px 4px 0` black offset.
- **Primary:** deep panel ground (`#14112e`) with paper-white label, cyan border, Press Start 2P at 12px, `12px 18px` padding, 8px gap to an inline glyph.
- **Hover:** `translate(-2px, -2px)`, offset deepens to `6px 6px 0`, and the button **inverts** — the border colour becomes the fill and the label becomes `--on-accent`. 0.12s transition.
- **Active:** `translate(2px, 2px)` and the shadow drops to `0 0 0`. The button is now flat against the page.
- **Variants:** `--magenta` and `--lime` change the border colour, and therefore the hover fill. Lime is the affirmative CTA (`► READ THE REVIEWS`), magenta the emphatic one.

### Chips

- **Category badge:** pure black fill, white text, 2px cyan border, Press Start 2P 10px, `6px 8px`, with a 9×9 category sprite inline. Sits absolutely at the top-left of a card's media well. The featured variant flips to a magenta fill with an `--on-accent` label and border.
- **Tag:** mid-panel fill, dim ink, 1px edge border, JetBrains Mono 11px uppercase with 0.05em tracking, `3px 6px`. Deliberately quieter than a badge — tags are metadata, badges are identity.

### Cards / Containers

- **Corner style:** square, 3px border in `--bg-3` at rest.
- **Background:** deep panel (`#14112e`); the media well is mid panel (`#1f1a3d`) at 16:9 with a bottom scrim.
- **Shadow strategy:** Rest (`4px 4px 0`) → Hover (`8px 8px 0` with `translate(-3px, -3px)`), per Elevation.
- **Hover:** border becomes cyan and the image scales to 1.04 over 0.4s — the only slow transition in the system, and it belongs to imagery rather than chrome.
- **Featured state:** magenta border at rest, flipping to lime on hover.
- **Internal padding:** 16px body, 12px footer separation above a 1px dashed rule.

### Inputs / Fields

- **Style:** square, 2px `--bg-3` border, a 4%-cyan tinted fill (`rgba(62, 232, 255, 0.04)`), JetBrains Mono 14px, `12px 14px` padding, caret in lime.
- **Label:** Press Start 2P 10px in cyan, sitting above the field with a 6px gap; a required marker renders in damage red.
- **Focus:** the border goes magenta and the fill shifts to a 6% magenta tint — plus the global 3px focus ring, restored explicitly for form fields because the components clear the UA outline on `:focus`.
- **Placeholder:** muted ink.
- **Textarea:** 140px minimum height, vertical resize only, 1.6 line-height.

### Navigation

- **Style:** Press Start 2P 12px in dim ink, `12px 14px`, a 2px transparent border that becomes cyan on hover, with the same lift-and-press movement as a button (`translate(-2px, -2px)` plus a `2px 2px 0` shadow).
- **Active:** magenta border, mid-panel fill, paper-white label.
- **Structure:** a two-tier sticky header — a 12px monospace status topbar (blinking lime dot, live indicators) above the main bar carrying the logo, nav and auth controls, closed by a 3px magenta bottom rule.
- **Mobile:** below 1024px the links compress to 11px/`10px 8px`; below 1023.98px the nav becomes a drawer.

### Signature Components

**The HP Bar.** The core editorial artifact. A labelled row per score component, with a 20-cell discrete meter at 12px tall and 2px gaps — filled cells take lime, gold or damage red from the same `scoreTone` thresholds the score box uses, unfilled cells stay `--bg-3`. It carries a real `role="progressbar"` with `aria-valuenow`/`min`/`max` and a spoken label; the cells themselves are `aria-hidden`. Rows are separated by 1px dotted rules. **Never render a smooth or gradient-filled progress bar in this system** — the discreteness is the point, and it is the visual expression of "the breakdown matters more than the headline figure."

**The Score Box.** Black fill, 2px border, Press Start 2P 14px, one decimal place, colour-coded by tone with border and text always matching. `scoreTone()` in `lib/content/mappings.ts` is the single source of truth: **lime ≥8.0, gold 6.0–7.9, damage red <6.0**. These three tones group the six named bands published on `/about`, so the colour channel and the written scale stay in agreement — change one and you must change the other. Anchored bottom-right of a card's media well.

**The Heart Row.** Five hand-plotted 9×9 pixel hearts rendering the same score in halves — full, half, empty. It is redundant with the score box on purpose: the number is for the reader who wants precision, the hearts for the reader scanning.

**The Arcade Cabinets.** The homepage hero: two rounded bezels (6px `--shadow-hard` border, `--bezel-radius`, a 4px inset rule in the bezel accent, `--hard-shadow-lg`) housing the boss screen and the High Scores board.
The boss screen shows the feature review from `getHeroPool()`: the extruded game title, the score starburst, a quote from `reviewTagline()`, a segmented HP bar filled to the score, and the cabinet mascot holding a sword.
The High Scores board lists the all-time top ten from the same pool.
Scanlines sit under the text, never over it, because they slice pixel glyphs.

**The Hills Band.** The News & Previews backdrop: a full-bleed `--bg-1` band with 4px `--shadow-hard` rules top and bottom, two rolling hill bands in `--bg-2` and `--bg-3`, a black road with `--neon-4` dots, a cloud by the heading and one in the sky, and the smiling hill, all `aria-hidden` behind the unchanged news grid.
The hill swaps to a surprised face and stretches 6% while the pointer is on its body.
The scenery is pinned to the band's bottom edge, and the band carries extra bottom padding so the landscape shows below the cards.
Latest Reviews above it stays on the plain page ground, so the homepage alternates plain and scenic sections.

**The Multiplayer Band.** The homepage's last section: a full-bleed `--bg-1` band with faint `--bg-2` rays rising from its bottom edge, a black top rule, and the MULTIPLAYER title under a CONNECT WITH US label.
It runs flush into the footer, whose pink rule is its bottom edge.

**The Character Bio.** The about card: a P1 portrait panel of `--bg-3` rays on `--bg-2` with the smiling gamepad, the `G'DAY, PLAYER.` heading, a line of prose, and four joke stat bars that reuse `.hp-bar` with the `--stat` modifier.
It idles: the rays turn once every 90 seconds, the stat bars fill as the card scrolls into view, and the gamepad runs a 2.4s wave loop timed after SVGator's "fire morphing" flame (a fast body pulse, a lean to the left, an arm that slides out of the right grip and waves, squinting eyes, and two twinkles rising). The loop is eased rather than stepped, by the owner's request. All of it stops under `prefers-reduced-motion`.
The bars are solid because they are not scores.

**The Versus Screen.** The membership pitch: P1 (the site's promise) on `--bg-1` against P2 (the reader) on `--neon-1` rays, split by a slanted `--neon-4` divider with black edges and a VS coin on its midpoint.
The pink ground's edge, the divider and the coin all derive from `--vs-lean` and `--vs-slash`, so the dark and pink edges run parallel to the divider at every width.
Below 1024px the panels stack and the divider runs sideways.
The waving P2 heart stands on the floor of the pink side.

**The Cartridge Links.** One cartridge per social channel plus RSS, each in its channel's colour from `SOCIAL_CHANNELS`, on the homepage and the contact page.
Only the shell tilts, and the label stays upright (see the No-Rotation Rule).

**The Ticker.** A 32px marquee: a magenta label block with `--on-accent` text, then a 60s linear-scrolling monospace track of headlines separated by `◆` diamonds in cyan. The label carries a pause toggle, and the track also pauses on hover and on `:focus-within` — an infinite marquee with no stop control is a WCAG 2.2.2 failure at **Level A**, and `prefers-reduced-motion` is not a substitute because it only reaches readers who set the OS flag. The track is tripled for a seamless wrap, so the two duplicate sequences are `aria-hidden`; otherwise a screen reader wades through 30 headline strings before reaching `<main>`. The toggle is the one control in the system exempt from the 44px target: a 32px bar cannot hold one, so it meets WCAG 2.2 AA 2.5.8 (24×24) instead.

**The Tweaks Panel.** A user-facing control surface exposing palette (Midnight / Amber / Candy), the scanline overlay, and sound effects, persisted to `localStorage`. Its existence is a system constraint: **any new surface must be checked in all three palettes and with scanlines on.**

## Do's and Don'ts

### Do:

- **Do** reach for a token before a literal. `--on-accent` for text on an accent fill, `rgba(var(--scrim-rgb), …)` for scrims, `var(--shadow-hard)` for offsets, `--neon-N-deep` for a darker accent.
- **Do** verify every new surface in all three palettes, with scanlines on, before calling it finished. Candy is the one that breaks things — it is the only light ground.
- **Do** check contrast against all four ground tokens (`--bg-0` … `--bg-3`), and check accents in both roles, as text and as fill.
- **Do** keep running prose in Fraunces (see the Measure Rule), and reserve Press Start 2P for headings, labels, numbers and buttons.
- **Do** pair every hover transform with its shadow change (`-2px` / deeper offset), and give pressable things a real `:active` state (`+2px` / no offset).
- **Do** use border weight as hierarchy: 1px divides, 2px trims a control, 3px builds a card, 4px frames an article, 6px is an arcade bezel.
- **Do** render new iconography as pixel-grid sprites in `components/retro/sprites.tsx` and new item types through `lib/content/mappings.ts` — one card component serves all eight types.
- **Do** give focusable elements a visible ring; the global `:where(…):focus-visible` rule at `3px solid var(--focus-ring)` with a 2px offset is the floor, and components that clear the UA outline must restore it explicitly.
- **Do** state a score in more than one channel — number, colour tone, and meter fill — so the verdict never depends on colour alone.

### Don't:

- **Don't** introduce a border radius outside the homepage arcade set pieces. That includes third-party embedded UI, which is overridden to match.
- **Don't** add a blurred shadow. The header drop and the arcade screen glow are the only two in the system; everything else is a zero-blur black offset.
- **Don't** set body copy, or any run longer than roughly eight words, in Press Start 2P.
- **Don't** hardcode `#000` as the text colour on a neon fill, or `rgba(10, 8, 32, …)` in a gradient. Both break the moment the palette changes.
- **Don't** point `--focus-ring` at an accent token, or drop a focus indicator to the UA default — that default resolves from the element's own `color` and produced an invisible hairline on the largest target on the site.
- **Don't** bring in a vector icon set (Lucide, Heroicons, react-icons) for site-facing chrome. Smooth strokes beside 9×9 sprites read as two different products.
- **Don't** render a score as a smooth or gradient-filled bar; the meter is 20 discrete cells. The character bio's joke stats are solid bars because they are not scores.
- **Don't** wrap long-form text in an arcade cabinet. It is a set piece, and it turns an article into a slab.
- **Don't** rotate an element that holds text. Tilt the shape and keep the label upright.
- **Don't** let any route scroll horizontally between 320px and 1280px — test the 721–831px band specifically, and give grid children that hold unbreakable strings an explicit `min-width: 0`.
- **Don't** reach for SaaS-minimal, mainstream-games-press, or kitsch-retro moves: soft gradients and glassmorphism, red-and-white brand bars and ad rails, or star fields, spinning GIFs and joke fonts.

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
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  body-lg:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
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

This is a newsstand games magazine that happens to be rendered in pixels. Not an arcade cabinet, not a nostalgia gag — a publication. The density is editorial: numbered section headers, boxed sidebars, ruled dividers, pull quotes, a scored verdict with its workings printed alongside. Every surface behaves like a page that was laid out by someone with an opinion and a deadline, then reproduced on a CRT instead of on paper.

The mood is **warm and nostalgic, playful and irreverent**. The pixels are affection, not costume — the system loves the era it borrows from and never winks at it. That affection shows up as craft (a 9×9 hand-plotted sprite for every category, hearts that render in halves, a score meter built from twenty discrete cells) and the irreverence shows up as voice (`◆ NPC ENCOUNTER ◆` stamped on the about strip, a `► TELL US WE ARE WRONG` button, a Konami code, an optional scanline overlay you can switch off). The distinction matters more than any single token: **an era rendered with care reads as design; an era rendered as a joke reads as kitsch, and kitsch is a confirmed anti-reference.**

The system is built to survive a full palette swap. Four complete palettes — Midnight Neon, Gameboy, Amber and Candy — swap under identical markup via `data-palette` on `<html>`, and Candy inverts the whole thing to a light ground. Nothing in the system may assume a dark background, a light accent, or a specific hue. That single constraint explains most of the token architecture below: `--on-accent`, `--scrim-rgb`, `--shadow-hard`, `--frame-ground` and `--focus-ring` all exist because a literal colour that worked on Midnight broke on Candy.

Confirmed anti-references, all three binding: **modern SaaS minimalism** (soft gradients, rounded cards, glassmorphism, thin grey type on white), **mainstream games press** (IGN/GameSpot chrome, red-and-white brand bars, dense ad rails, autoplay video), and **nostalgia kitsch** (Comic Sans, star fields, spinning GIFs, "under construction" gags).

**Key Characteristics:**

- Zero radius everywhere — not one rounded corner in the system
- Three fonts with three strictly separate jobs: Press Start 2P labels and headings, JetBrains Mono body, VT323 pull quotes only
- Hard, un-blurred, pure-black offset shadows as the entire depth model
- Four complete palettes under one markup, each independently WCAG AA
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

Three complete re-mappings ship alongside Midnight Neon, switched by `data-palette` on `<html>` and persisted to `localStorage`:

- **Gameboy** — DMG green, ground `#0f380f` through `#4a7c4a`, ink `#9bbc0f`. Accents collapse to two greens; the palette deliberately has less colour information than the others. Note that the four *authentic* DMG shades cannot serve as both grounds and inks and still clear AA — `--bg-2` was darkened to `#1f421f` and `--ink-dim`/`--neon-2` lifted to `#a8c818` for exactly that reason. `--bg-3` remains a border colour and is still below AA as a text ground on `.hero-side-item:hover`.
- **Amber** — monochrome phosphor terminal, ground `#0d0700`, ink `#ffb000`, with `#ff5252` as the only contrasting accent.
- **Candy** — the light palette, ground `#fdf4ff`, ink `#2a1a3d`. Its accents are **not** the Midnight accents; every one was independently darkened for legibility on a light ground (`#bf004d`, `#006979`, `#346c20`, `#914f00`), and `--shadow-hard` becomes a white glow rather than black.

### Named Rules

**The Palette-Agnostic Rule.** Never hardcode a colour that already exists as a token. Four palettes swap under identical markup, so a literal `rgba(10, 8, 32, …)` in a scrim is not a shortcut, it is a defect on the other three — this exact mistake put the hero headline at 1.31:1 on Candy. Scrims use `rgba(var(--scrim-rgb), …)`, hard shadows use `var(--shadow-hard)`, media frames use `var(--frame-ground)`.

**The Both-Ways Rule.** Any token used as both a foreground and a background needs its counterpart tokenised too. Text sitting on a neon fill is `var(--on-accent)`, never `#000` — when Candy's accents were darkened for legibility as *text*, black-on-accent fell to 3.32:1 as a *background*. The same trap runs the other way: the hard chips that sit on imagery (score box, category badge, social mark, author avatar) hardcoded a `#000` *ground* under a tokenised `color`, which put Candy's deliberately-darkened accents at 3.31:1 on black. Those grounds are now `var(--chip-ground)`, defined once as `var(--bg-0)` so it re-resolves per palette without an override. After changing any colour token, grep for it as a `background:` value, not just as a `color:` value.

**The No-CMS-Colour Rule.** A colour that arrives from Sanity is a literal hex and knows nothing about the palette. An author's `accentColor` was applied inline and rendered `#3ee8ff` on every palette — 1.24:1 on Candy — and no CSS audit could ever find it, because the value never appears in a stylesheet. Stored colours are snapped to the nearest accent token with `paletteAccent()` in `lib/mappings.ts` before they reach a `style` prop. Brand colours are subject to the same rule: Discord's blurple is a token here, not `#a3adf6`.

**The Focus Ring Is Not An Accent Rule.** `--focus-ring` is its own token and must never be pointed at `--neon-*`. The accent that reads on a dark ground is invisible on the light one; Candy's focus ring is near-black by design.

**The Four-Ground Audit Rule.** Contrast is checked against every background token the colour can land on (`--bg-0` through `--bg-3`), not just the page ground. Checking `--bg-0` alone is how `--ink-dim` on `--bg-2` shipped at 2.75:1 in Gameboy — body copy inside every card.

## Typography

**Display Font:** VT323 (with `monospace`)
**Prose Font:** IBM Plex Sans (with `system-ui, sans-serif`)
**Data/Label Font:** JetBrains Mono (with `ui-monospace, monospace`)
**Heading Font:** Press Start 2P (with `system-ui, monospace`)

**Character:** Four fonts, four jobs, no overlap. Press Start 2P is the magazine's cover type — chunky, all-caps by habit, and physically unreadable in a paragraph. IBM Plex Sans carries running prose. JetBrains Mono carries everything that is *read as data*: summaries, stat rows, scores, tags, timestamps, metadata, code. VT323 appears exactly once in the vocabulary, as the pull-quote voice, which is why it still feels like an event.

**Why prose left the mono.** Until 2026-08-07 JetBrains Mono set every word on the site, which meant monospace signalled nothing — a TL;DR block read with exactly the texture of the paragraph beneath it. Measured on a real review at the 651px column, mono at 17px rendered **64 characters per line**: below the healthy 65–75 band and below this system's own 72ch cap, because monospace is wide by construction. Plex Sans at 18px lands on **72** in the identical column and runs 9% shorter. Plex Sans specifically because it is the sans sibling of a mono superfamily and sits beside JetBrains Mono without argument; not Inter, which walks into the SaaS-minimalism anti-reference; not a serif, which pulls toward a broadsheet arts page.

### Hierarchy

The text ramp is 11 · 12 · 13 · 14 · 15 · 16 · 17 · 18 · 20 · 22 · 24 · 26px. Two faces run it in parallel — Press Start 2P owns the heading and label steps, JetBrains Mono owns the reading steps — and they never occupy the same step for the same purpose.

Two tiers sit outside that ramp on purpose, and neither is text:

- **Display tier** (32 · 44 · 52 · 64px, Press Start 2P): single characters used as artwork — the portrait initial on the about strip, the badge glyph on the contact and about heroes. These are shapes, not words, so the reading ramp does not apply.
- **Glyph tier** (8 · 9px, JetBrains Mono): the `◆` and `▸` marks in `::before` pseudo-elements. Decorative punctuation standing in as a bullet, never a label a reader has to parse.

**Anything a reader reads sits on the text ramp, at 11px or above.** If a value between 10px and the glyph tier appears, it is a defect rather than a new step.

**Press Start 2P (headings, labels, numbers):**

- **Display** (VT323 400, 26px, 1.4): pull quotes inside article body copy. Nowhere else, and VT323 appears nowhere else either.
- **Headline** (24px, 1.4, `text-shadow: 4px 4px 0 var(--shadow-hard)`): the article title in the hero. The offset text shadow is part of the role, not decoration.
- **Title** (22px, 1.4): page `h1` and article-body `h2` (magenta, 2px dashed bottom rule).
- **Title-md** (20px): the homepage hero feature title.
- **Subhead** (16px): `h2`, article-body `h3`, the hero feature's score.
- **Subhead-sm** (14px, 1.5): `h3`, card titles, score boxes.
- **Label-lg** (12px, 0.1em): nav links, buttons, section numerals, stat keys.
- **Label** (11px, 0.1em): badges, field labels, HP row heads, breadcrumbs, section-header actions. The most-used role in the system by count.

**JetBrains Mono (everything read as prose):**

- **Lede** (20px, 1.6, max 72ch): the article standfirst.
- **Body** (18px, 1.7, max 72ch): article copy. Renders 72 characters per line in the 651px column.
- **Body-lg** (16px, 1.55): the hero feature subtitle.
- **Body-ui** (15px, 1.55): the document base size.
- **Body-sm** (14px): card excerpts, footer links, form inputs.
- **Caption** (13px): card subjects, stat rows, author bios.
- **Meta** (12px, 0.1em, often uppercased): timestamps, tags, breadcrumb trails, ticker items, score-key bands.

### Named Rules

**The 8px Grid Rule.** Press Start 2P is drawn on an 8px grid and renders with **zero anti-aliasing only at multiples of 8** — 8, 16, 24, 32. Measured across 8–32px, every other size fringes 16–55% of its inked pixels, and `-webkit-font-smoothing: none` changes nothing (verified: byte-identical output). Display type is therefore snapped to 16 or 24. The small labels at 11–14px are a known, accepted exception: 8px is illegible and 16px would reflow the nav, badges and cards. **Any new Press Start 2P at display size must be 16, 24 or 32.**

**The 11px Floor Rule.** No functional text below 11px, at any breakpoint. Press Start 2P is a bitmap face with no anti-aliasing headroom, so 10px is not a smaller version of the type, it is a broken one. Check the responsive blocks when raising a base size — there are five of them, and `.about-pill` and `.hp-row__head` were both being quietly reset to 10px on phones after their base rules had been fixed.

**The Press-Start-Is-A-Label-Font Rule.** Press Start 2P never sets a paragraph. It sets headings, labels, numbers and buttons. Any run of pixel type longer than about eight words is a defect — the reader's eye stalls and the nostalgia turns into work.

**The No-Weight Rule.** Press Start 2P and VT323 ship at 400 only, and headings explicitly set `font-weight: normal`. Hierarchy is built from size, colour and tracking, never from weight. JetBrains Mono loads 400/500/700 and is the only place a bold is available.

**The 72ch Rule.** Body copy is capped at 72 characters (`max-width: 72ch` on article paragraphs and the standfirst). A monospaced body face runs wide; without the cap, line length breaks long before the container does.

## Layout

A centred 1280px container with a 24px gutter (20px under 1280, 16px under 1024), sections on a 56px vertical rhythm (48px, then 36px as the viewport narrows), and a fixed 48px background grid that never scrolls — `background-attachment: fixed` on two 1px linear gradients, so the page reads as content moving across a stationary board.

Spacing is built on a 4px pixel unit (`--pixel: 4px`) and stays on multiples of it: 4 / 6 / 8 / 10 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 56 / 64.

**Grids and how they collapse:**

| Region | ≥1281px | ≤1280px | ≤1024px | ≤640px |
|---|---|---|---|---|
| Hero | `1.6fr 1fr` | `1.4fr 1fr` | `1fr` | `1fr` |
| Reviews grid | `repeat(3, 1fr)`, 20px | 16px gap | `1fr 1fr` | `1fr` |
| News grid | `1.4fr 1fr 1fr`, 16px | 14px gap | `1fr 1fr` | `1fr` |
| Article body | `1fr 320px`, 40px | `1fr 300px`, 28px | `1fr`, 32px | `1fr` |
| Pros / cons | `1fr 1fr` | `1fr 1fr` | 10px gap | `1fr` |

Breakpoints in use: **1280** (laptop tightening), **1024** (tablet: hero and grids collapse, nav compresses), **1023.98** (mobile: drawer nav, reduced padding), **640** and **480** (phone type scale-down). The 1024/1023.98 pair is deliberate — one governs layout collapse, the other governs the nav becoming a drawer.

### Named Rules

**The Zero-Overflow Rule.** No route may scroll horizontally at any width from 320px up. The historical failure was the 721–831px band, where `.lmp-nav` was a `nowrap` flex row with a constant 832px right edge while the hamburger only engaged at 720px. Test the band, not just the breakpoints.

**The Min-Width-Auto Rule.** Any grid or flex child that can receive unbreakable content (an email address, a URL, a long title) needs an explicit `min-width: 0`. Default `min-width: auto` is what set a 355px min-content floor on the contact page and overflowed every viewport below ~383px.

## Elevation & Depth

Hybrid, and the split is strict: **hard offset shadows are the depth model for every UI surface; soft light is reserved exclusively for the CRT frame's inner bloom and the sticky header's drop.** There is no ambient elevation, no blurred card shadow, no glow on hover. Depth reads as a solid black shape offset down-and-right, exactly as a sticker sits above a board — which is also why the whole system survives on a light palette by swapping `--shadow-hard` to a white glow instead.

Layering is otherwise tonal: four ground steps (`#0a0820` → `#2a2350`) do the work that blur would do in a soft system.

### Shadow Vocabulary

- **Rest** (`box-shadow: 4px 4px 0 var(--shadow-hard)`): the default for cards, buttons, stat blocks, article panels and body images.
- **Raised** (`box-shadow: 6px 6px 0 var(--shadow-hard)`): the about strip, the about hero, the article cover plate — surfaces that outrank an ordinary card.
- **Hover** (`box-shadow: 6px 6px 0` on buttons, `8px 8px 0` on cards, paired with a negative translate): the offset deepens because the element moved toward you, not because a new shadow appeared.
- **Pressed** (`box-shadow: 0 0 0 var(--shadow-hard)` + `translate(2px, 2px)`): the shadow is consumed as the element goes down.
- **Structural** (`box-shadow: 0 4px 0 0 #000, 0 8px 24px rgba(0,0,0,0.5)` on the sticky header): the only place a hard offset and a blurred drop are stacked, because the header floats over scrolling content.
- **CRT bloom** (`inset 0 0 60px rgba(255,61,139,0.15), 0 0 0 2px var(--neon-1), 8px 8px 0 #000`): the hero frame only.

### Named Rules

**The No-Blur Rule.** A UI shadow has a blur radius of zero and is pure black. Blur exists in exactly two places in this system — the header drop and the CRT inner bloom — and adding a third is a defect, not a refinement.

**The Lift-And-Press Rule.** Interactive surfaces move. Hover is `translate(-2px, -2px)` (cards: `-3px`) with a deeper offset; active is `translate(2px, 2px)` with the offset removed. The shadow and the transform always change together — a shadow change without movement reads as a glow, which this system does not have.

## Shapes

Rectangles. The form language is a magazine page: boxes, rules and borders, with border *weight* carrying hierarchy the way a printed spread uses hairlines and heavy rules.

- **Radius: 0, everywhere.** `--radius: 0`, and Tailwind's `--radius-sm/md/lg/xl` are all mapped to `0` so utility classes cannot reintroduce a corner. Even the focus ring sets `border-radius: 0`.
- **Border weights** are a scale: **1px** hairline dividers and inner frame lines · **2px** chips, badges, small controls, section rules, inputs · **3px** cards, buttons, panels, the header's bottom rule · **4px** the article hero and cover plate · **6px** the CRT frame.
- **Border style** carries meaning: solid for structure, **dashed** for internal editorial dividers (article `h2` underlines, stat-block heads, card footers), **dotted** for list-row separators (HP rows, stat rows).
- **Pixel sprites** are the icon language: category glyphs and hearts are hand-plotted character grids (9×9 for hearts, uniform 9×9 for nav glyphs) rendered as `<rect>` SVGs with `shape-rendering: crispEdges` and `image-rendering: pixelated`. They scale to any size without softening.
- **Media wells** are 16:9 for cards, 3:4 for the article cover plate, with images at `saturate(1.1)` and a bottom-up scrim gradient.

### Named Rules

**The Zero-Radius Rule.** Nothing in this system is rounded — no card, no button, no input, no avatar, no focus ring. A single `border-radius` above 0 breaks the whole material premise, and there is no exception for third-party embeds; Clerk's UI is overridden to match.

**The Pixel-Icon Rule.** Site-facing iconography is the sprite system, never a vector icon set. Lucide exists in the repo for one shadcn primitive's internals and must not migrate into site chrome — a smooth 24px stroke icon next to a 9×9 sprite instantly reads as a different product.

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

**The Score Box.** Black fill, 2px border, Press Start 2P 14px, one decimal place, colour-coded by tone with border and text always matching. `scoreTone()` in `lib/mappings.ts` is the single source of truth: **lime ≥8.0, gold 6.0–7.9, damage red <6.0**. These three tones group the six named bands published on `/about`, so the colour channel and the written scale stay in agreement — change one and you must change the other. Anchored bottom-right of a card's media well.

**The Heart Row.** Five hand-plotted 9×9 pixel hearts rendering the same score in halves — full, half, empty. It is redundant with the score box on purpose: the number is for the reader who wants precision, the hearts for the reader scanning.

**The CRT Frame.** The homepage hero housing: 6px `--bg-3` border on `--frame-ground`, a 1px inset cyan rule 14px in, a magenta inner bloom, a `8px 8px 0` offset, and a repeating 1px scanline overlay. It is a **media frame** — it houses imagery and the featured verdict, and must not be used to wrap long-form text, which flattens a thousand words into one undifferentiated slab.

**The Ticker.** A 32px marquee: a magenta label block with `--on-accent` text, then a 60s linear-scrolling monospace track of headlines separated by `◆` diamonds in cyan. The label carries a pause toggle, and the track also pauses on hover and on `:focus-within` — an infinite marquee with no stop control is a WCAG 2.2.2 failure at **Level A**, and `prefers-reduced-motion` is not a substitute because it only reaches readers who set the OS flag. The track is tripled for a seamless wrap, so the two duplicate sequences are `aria-hidden`; otherwise a screen reader wades through 30 headline strings before reaching `<main>`. The toggle is the one control in the system exempt from the 44px target: a 32px bar cannot hold one, so it meets WCAG 2.2 AA 2.5.8 (24×24) instead.

**The Score Key.** A bordered panel closing the hero's right column, pairing each tone swatch with its band (`8.0+` / `6.0–7.9` / `<6.0`) and linking `/about`. It exists because the homepage showed seven colour-coded scores with no legend and no route to the published scale — on a site whose positioning is auditable scoring. **Any surface that renders a score without the breakdown should carry a route to the scale.**

**The Tweaks Panel.** A user-facing control surface exposing palette (Midnight / Gameboy / Amber / Candy), the scanline overlay, and sound effects, persisted to `localStorage`. Its existence is a system constraint: **any new surface must be checked in all four palettes and with scanlines on.**

## Do's and Don'ts

### Do:

- **Do** reach for a token before a literal. `--on-accent` for text on an accent fill, `rgba(var(--scrim-rgb), …)` for scrims, `var(--shadow-hard)` for offsets, `var(--frame-ground)` for media frames.
- **Do** verify every new surface in all four palettes, with scanlines on, before calling it finished. Candy is the one that breaks things — it is the only light ground.
- **Do** check contrast against all four ground tokens (`--bg-0` … `--bg-3`), and check accents in both roles, as text and as fill.
- **Do** keep body copy in JetBrains Mono at ≤72ch, and reserve Press Start 2P for headings, labels, numbers and buttons.
- **Do** pair every hover transform with its shadow change (`-2px` / deeper offset), and give pressable things a real `:active` state (`+2px` / no offset).
- **Do** use border weight as hierarchy: 1px divides, 2px trims a control, 3px builds a card, 4px frames an article, 6px is the CRT.
- **Do** render new iconography as pixel-grid sprites in `components/retro/sprites.tsx` and new item types through `lib/mappings.ts` — one card component serves all eight types.
- **Do** give focusable elements a visible ring; the global `:where(…):focus-visible` rule at `3px solid var(--focus-ring)` with a 2px offset is the floor, and components that clear the UA outline must restore it explicitly.
- **Do** state a score in more than one channel — number, colour tone, and meter fill — so the verdict never depends on colour alone.

### Don't:

- **Don't** introduce a border radius. Anywhere. Including third-party embedded UI, which is overridden to match.
- **Don't** add a blurred shadow. The header drop and the CRT bloom are the only two in the system; everything else is a zero-blur black offset.
- **Don't** set body copy, or any run longer than roughly eight words, in Press Start 2P.
- **Don't** hardcode `#000` as the text colour on a neon fill, or `rgba(10, 8, 32, …)` in a gradient. Both break the moment the palette changes.
- **Don't** point `--focus-ring` at an accent token, or drop a focus indicator to the UA default — that default resolves from the element's own `color` and produced an invisible hairline on the largest target on the site.
- **Don't** bring in a vector icon set (Lucide, Heroicons, react-icons) for site-facing chrome. Smooth strokes beside 9×9 sprites read as two different products.
- **Don't** render a score as a smooth or gradient-filled bar; the meter is 20 discrete cells.
- **Don't** wrap long-form text in `.crt-frame`. It is a media frame, and it turns an article into a slab.
- **Don't** let any route scroll horizontally between 320px and 1280px — test the 721–831px band specifically, and give grid children that hold unbreakable strings an explicit `min-width: 0`.
- **Don't** reach for SaaS-minimal, mainstream-games-press, or kitsch-retro moves: soft gradients and glassmorphism, red-and-white brand bars and ad rails, or star fields, spinning GIFs and joke fonts.

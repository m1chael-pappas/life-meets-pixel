---
target: the homepage
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-08-07T08-08-53Z
slug: app-home-page-tsx
---
Method: dual-agent (A: critique-A-design · B: critique-B-detector)

Target: the homepage — `app/(home)/page.tsx` and the sections it composes. Mode: Persuade. Dev server and Chrome were started for measurement and have been stopped.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Real status is good (live clock, relative dates, honestly-relabelled "TOP RATED LATELY"), but the topbar ships fake status beside it — `HI-SCORE 999900`, `P1 READY`, and `EST. 2026` on a site publishing since 2025. Fake status trains readers to ignore real status. |
| 2 | Match System / Real World | 3 | `components/retro/news-card.tsx:18` formats dates `M/d/yyyy`. "8/5/2026" on an `lang="en-AU"` site reads as 8 May; it is 5 August. |
| 3 | User Control and Freedom | 2 | The 60s ticker marquee has no pause, stop or hide control — WCAG 2.2.2, **Level A**. The mobile drawer has no scrim, focus trap, or outside-click close. |
| 4 | Consistency and Standards | 2 | `components/pixel-loading.tsx` breaks four named DESIGN.md rules at once (rounded-full ×5, ❤️ emoji at text-6xl, font-bold, palette-blind shadcn tokens). ~45 `box-shadow` declarations hardcode `#000` instead of `var(--shadow-hard)`, so depth inverts wrongly on the light palette. |
| 5 | Error Prevention | 3 | Degraded states are handled (ticker try/catch, AdBreak null, sections return null). But empty sections vanish silently, leaving section numerals running 03 → 04 with no 02. |
| 6 | Recognition Rather Than Recall | 2 | Seven colour-coded scores on the page, zero legend, and no link from `<main>` to `/about` where the scale is published (measured: 22 links, `hasAbout: false`). |
| 7 | Flexibility and Efficiency | 2 | Accelerators exist (tweaks panel, Konami, RSS) but all serve *appearance*, not reading. A returning enthusiast who reads anime has no route to anime — no medium filter, no type rail. |
| 8 | Aesthetic and Minimalist Design | 2 | 771 words and 22 links in `<main>`. "No sponsors, no PR fluff" is restated in three separate blocks. 11 review links resolve to 6 unique reviews. |
| 9 | Error Recovery | 3 | Ticker degrades gracefully. Every other failure mode is an absence, never a message. |
| 10 | Help and Documentation | 1 | `/about` is the site's written proof asset and the homepage links to it zero times above the footer. The page restates the claim and never shows the receipt. |
| **Total** | | **23/40** | **Acceptable — significant improvements needed** |

No heuristic scored `n/a`. Both 7 and 10 genuinely apply here: auditable scoring is the stated positioning, so documentation is load-bearing, and real accelerators are shipped — they just point at the wrong job.

## Design Specificity Verdict

**Strong skin, generic bones.**

**LLM assessment (A).** The visual language is unmistakably this product — the 6px CRT frame with its magenta inner bloom, 9×9 hand-plotted hearts, the 20-cell discrete meter vocabulary, four palettes under one markup. No other site ships this. But strip the fonts and colours and the skeleton is a stock content homepage: hero + trending sidebar + author strip + 3-up news grid + ad + membership CTA + 3×2 card grid + social tiles + fat footer. Any WordPress magazine theme has that exact sequence.

The tell is decisive: **the HP-bar score breakdown — the artifact PRODUCT.md names as the core editorial object and the one thing a neighbouring site cannot copy — appears zero times on the homepage.** Measured: `#main-content` contains 0 `.hp-row` and 0 `[role="progressbar"]`. The differentiator is entirely absent from the front door.

**Deterministic scan (B).** The CLI detector returned **exit 0, zero findings** across 23 `.tsx` files. That zero is genuine, not suppression — verified with `--no-config`, and a synthetic canary correctly tripped exit 2. But the rendered-DOM overlay found **52 findings across 9 rules**, and the gap between those two numbers is the story: the CLI reads source regex, the overlay reads composited pixels, and every real defect on this page lives in the composite.

B adjudicated most overlay hits as false positives against this deliberately zero-radius, hard-shadow, pixel-font system — and I agree with the calls: `side-tab` ×2 (thick hard rules are the system's load-bearing device), `dark-glow` ×1 (the CRT bloom is named in the brief), `blinking-cursor` ×1 (an 8×8 status LED, not a fake caret), `numbered-section-labels` ×3 (magazine furniture sitting beside real h2 text), `text-occlusion` ×1 (one sampled instant of intended marquee motion), `em-dash-overuse` (advisory, editorial voice). Of the 32 `ai-color-palette` hits, 26 are false — cyan-on-dark is the identity and all 32 pass contrast in midnight and amber. **Six are a genuine bug** for an unrelated reason (see P0-2). Genuinely valid: `undersized-ui-text` ×10 (measured 10px functional text) and `line-length` ×1.

**Coverage gap worth knowing:** the CLI scan covered `app/(home)/page.tsx`, `components/sections`, `components/site-header.tsx`, `components/site-footer.tsx` and `components/retro` — it never saw `components/pixel-loading.tsx`, the file with four rule violations. A clean detector run does not mean a clean surface.

**Visual overlays.** Injection **succeeded** — preflight mutation confirmed, `live-server.mjs` served `detect.js` (366,701 bytes) on port 8400, console reported `[impeccable] 49 anti-patterns found`. The live server has since been stopped, the injected script and style removed, and browser state restored, so there is **no overlay currently visible in a browser** — the findings above are the archived output.

## Overall Impression

The craft floor here is genuinely high and the measurements prove it: **zero horizontal overflow at all 18 widths tested including the historically broken 721–831 band; a focus ring on all 48 focusable elements at 3px with 5.89–18.79:1 contrast; one h1, 19 headings, no skipped levels; zero console errors; real descriptive alt text on all 10 images.** These are the things that are usually broken and here they are not. Someone wrote rules down and then kept them.

The problem is not craft, it is **editorial strategy**. This page spends its best real estate on the author and the membership pitch, buries the reviews 4.2 viewports down on mobile, shows the same six reviews twice, and never once shows or explains the score breakdown that is the entire reason to trust it. PRODUCT.md says this year is measured in reach and the reader is a browsing enthusiast; the page is built as though it were measured in conversion.

**The single biggest opportunity:** put the product's proof on the front door. The hero already has 119px of dead space inside the CRT frame. Put the featured review's HP breakdown in it.

## What's Working

1. **Redundant score encoding in the hero.** `8.5` in a tone-coloured bordered box, five hand-plotted hearts rendering the same value in halves, and the tone colour itself — three independent channels for one fact. It survives colour-blindness, it survives a squint, and it is the one moment where the retro form does editorial work rather than decoration.
2. **The Zero-Overflow Rule actually holds.** `scrollWidth === clientWidth` at 305/360/375/399/625/700/**721/730/753/768/785/800/816/831**/885/1009/1265/1425, with `overflow-x: visible` on both `html` and `body` — so it is genuinely fixed, not clamped over. The drawer engages cleanly at 1024.
3. **Alt text is real writing.** "Palworld key art showing trainers and Pals facing off across a grassy battlefield. Image: Pocketpair." Most sites at this scale ship filenames; this one credits the source inside the alt.
4. **The section-header device is a magazine device, not a web convention.** Magenta-bordered numeral chip, Press Start heading, 2px rule with a 96px magenta inlay, `VIEW ALL →` translating 4px on hover. The clearest evidence the 1998-magazine north star is structural rather than a filter.

## Priority Issues

### [P0] The homepage duplicates itself — 11 review links, 6 unique reviews

**What.** Every item in the hero's `TOP RATED LATELY` list (`how-many-dudes`, `go-go-town`, `pathogenic`, `regions-of-ruin`) reappears in `LATEST REVIEWS`, and so does the hero feature (`palworld-1-0-review`). Only **one** review on the page — `halo-campaign-evolved` — is unique to the grid. The Palworld key art renders twice. `components/sections/reviews-section.tsx:10` carries the comment *"Skip the first few featured shown in the hero / featured section — then cap at 6"* directly above `reviews.slice(0, 6)`, which skips nothing. Confirmed in source.

**Why it matters.** A reader who scrolls 2,199px on desktop past an about-strip, three news cards, an ad and a membership pitch is rewarded with five items they already declined at the top. This is the single largest reason the page won't earn a second page view — which is the only metric that matters for the stated audience-size goal.

**Fix.** Pass the hero's five `_id`s into `ReviewsSection` and filter them out; have `REVIEWS_QUERY` return 12 and render the first 6 the hero didn't use.

**Suggested command:** `/impeccable polish app/(home)`

### [P0] Score and byline fail WCAG AA on two of four palettes

**What.** Both assessments found this independently, and B measured the full matrix — **midnight 0 failures (lowest 4.94:1), amber 0 (lowest 5.17:1), candy 7, gameboy 7.**

Candy: `.review-card__score` at **3.31:1**, `.review-card__score.mid` at **3.32:1**, `.hero-feature__score` at **3.31:1**, `.social-tile__mark` at 3.30–3.32:1. Root cause is `background: #000` hardcoded at `app/globals.css:491`, `:743`, `:1715` while `color` stays tokenised — candy deliberately darkens those accents for a light ground and these five black chips were missed by that retune.

Worse, and invisible to any CSS grep: `.author-chip` renders `style="color:#3ee8ff"` from `authorAccent()` at `lib/mappings.ts:71`, which returns the author's Sanity `accentColor` verbatim. It renders identically in all four palettes — **1.24:1 and 1.26:1 in candy**, 3.32:1 in gameboy. The author byline is effectively invisible on the light palette, on a site whose stated editorial ritual is that every article names its human.

Gameboy adds seven more at 2.75–3.32:1, including `.hero-side-item__title` (the ranked review list) and `.about-pill`, all from `--ink-dim`/`--ink` on `--bg-2`.

**Why it matters.** The score *is* the product. On the light palette it is simultaneously the heaviest object on the page and the least legible. DESIGN.md's own Both-Ways Rule cites "3.32:1" as the known failure mode — and it is live.

**Fix.** Give the score box and social marks a `--score-ground` token (candy: `--bg-0`, not `#000`). Clamp `authorAccent()` to the palette — resolve stored hexes to the nearest `--neon-*` token, or drop the inline colour and let `.author-chip { color: var(--ink-dim) }` do its job. Re-audit gameboy's `--ink-dim` on `--bg-2`.

**Suggested command:** `/impeccable audit app/globals.css`

### [P1] The product's proof is never shown and never linked

**What.** Zero HP bars in `<main>`. Zero links from `<main>` to `/about`, where the scoring scale with its six named bands is published (measured: 22 links, `hasAbout: false` — About was removed from the nav and lives only in the footer). No legend anywhere for what lime, gold and red mean.

**Why it matters.** The positioning is "unbought verdicts with transparent scoring". A first-time visitor sees seven colour-coded numbers with no key and no route to the scale. The claim is asserted three times in prose and evidenced zero times. This is the gap between saying you are auditable and being auditable.

**Fix.** (a) Render the hero feature's actual HP breakdown in the 119px of dead `--frame-ground` at the bottom of the hero's right column — `.hero-side__list { flex: 1 }` already stretches the container but not the items. (b) Add a one-line score key under the hero — `LIME ≥8.0 · GOLD 6.0–7.9 · RED <6.0 → HOW WE SCORE` — linking `/about`.

**Suggested command:** `/impeccable polish app/(home)`

### [P1] Reviews are buried behind a bio, an ad and a membership pitch

**What.** Measured at 390×844: hero 122–814, about strip 813–1277 (464px), news 1277–3063 (1,786px), ad ~3063–3233, membership CTA 3233–3540, **`LATEST REVIEWS` heading at y=3,581 — 4.2 viewports down.** Total mobile page height 8,586px. Desktop puts the first review card at y=2,199. `.review-card__excerpt` computes `-webkit-line-clamp: none`, so full multi-sentence summaries render on every card.

**Why it matters.** PRODUCT.md names the primary reader as a browsing enthusiast arriving on mobile and names reach — not conversion — as this year's metric. The current order puts ~1,161px of non-editorial content ahead of and around the editorial, and asks for money before it has shown its work. Most mobile readers will never see a review card.

**Fix.** Reorder to hero → **reviews** → news → about strip → membership → socials. Move `AdBreak` below the reviews grid. Clamp `.review-card__excerpt` and `.news-card__excerpt` to 3 lines — that alone removes roughly 1,200px from the mobile scroll.

**Suggested command:** `/impeccable layout app/(home)`

### [P2] The ticker is a Level A failure that also wastes the best strip on the page

**What.** `.lmp-ticker__track { animation: scroll-left 60s linear infinite }` with no pause, stop or hide control. WCAG 2.2.2 is **Level A** — the lowest bar there is — and the `prefers-reduced-motion` block at `app/globals.css:215` only covers users who have set the OS flag. Its ten items are `<span>`s, not links, so ten real review titles with scores sit in the most prominent above-fold strip and cannot be clicked. The track is tripled in the DOM without `aria-hidden`, so a screen reader passes 30 headline strings before reaching `<main>`.

**Fix.** Make each item a `<Link>`. Add `animation-play-state: paused` on `:hover, :focus-within` plus a `⏸` toggle in the ticker label. `aria-hidden="true"` on the two duplicate track copies.

**Suggested command:** `/impeccable harden components/retro/ticker.tsx`

### [P2] Twenty tap targets under 44px, and the loading screen breaks four named rules

**What.** At 390px, **20 interactive elements are under 44×44** — and notably every failure is height-only, nothing is width-deficient, so the fix is uniformly vertical padding. Worst is `a.section-head__action` ("VIEW ALL") at **15.5px tall**; the entire footer link set sits at 28.6px; `button.lmp-nav-toggle` and both `retro-btn` CTAs miss by ~1px.

Separately, `components/pixel-loading.tsx` — rendered by `app/(home)/loading.tsx`, so it is seen on every navigation off this page — ships `rounded-full` ×5, a `❤️` emoji at `text-6xl`, `font-bold`, and `bg-primary`/`bg-muted`/`text-foreground` shadcn tokens that do not respond to `data-palette`. That is the Zero-Radius Rule, the Pixel-Icon Rule, the No-Weight Rule and the Palette-Agnostic Rule broken in one 40-line file. And ~45 `box-shadow` declarations in `globals.css` hardcode `#000` while `--shadow-hard` is correctly `rgba(255,255,255,0.9)` on candy — so `.crt-frame` and `.review-card` cast black shadows on a light ground while `.hero-feature__title`'s text-shadow correctly renders white. Two contradictory depth cues in one component.

**Fix.** Add vertical padding to `.section-head__action` and the footer link set. Rewrite `PixelLoading` with a `PixelHeart` sprite, zero radius and palette tokens. Replace every `box-shadow: Npx Npx 0 #000` with `var(--shadow-hard)` and re-verify candy.

**Suggested command:** `/impeccable adapt app/(home)`

## Persona Red Flags

**Casey (distracted mobile)** — Lands at 390px and permanently loses 88px of viewport to the sticky header plus 32px of ticker. Gets one review, then 464px of about-strip, then 1,786px of three news cards with unclamped 7-line excerpts, then an ad, then the membership pitch. `LATEST REVIEWS` is at y=3,581; Casey is gone by y=1,500. The `.tweaks-btn` (fixed, `z-index: 9999`, 119×43px, bottom-right) permanently covers the corner where `.review-card__score` sits — at desktop scroll 2,200 it fully occludes the Palworld card's `8.5`, and at page bottom `document.elementFromPoint(1340, 857)` returns the tweaks button rather than the footer's Facebook link.

**Jordan (first-timer)** — Sees seven colour-coded numbers and no explanation of any of them, with no path from `<main>` to the scale. Reads "no sponsors, no PR fluff" three times without one piece of evidence. Sees `EST. 2026` next to `HI-SCORE 999900` and cannot tell which facts on this site are real. Sees six `.cat-badge` elements all reading `GAME` and concludes this is a games site — the anime, books and board-game promise is invisible, and nothing in `REVIEWS_QUERY` guarantees spread on a games-heavy publishing week.

**Sam (accessibility-dependent)** — The focus system is genuinely good: 3px rings on all 48 focusable elements at 5.89–18.79:1, skip link first in tab order, one h1, no skipped heading levels. What fails: `.review-card__score` at 3.31:1 and `.author-chip` at 1.24:1 on candy; the 60s marquee with no pause control (Level A); 30 duplicated marquee strings between the header and `<main>`; and a document outline where the four `.hero-side-item` links are orphaned under no heading, `◆ PLAYER 2 WANTED` outlines as part of the News section, and the four footer h3s nest under the social section's h2 because the footer has no h2 of its own. No level violations — but the semantics are wrong.

## Minor Observations

- 119px of dead `--frame-ground` at the bottom of the hero's right column. The obvious occupant is the featured review's HP breakdown.
- `.hero-side-item__title` sets full review titles ("Regions of Ruin: Runegate Review: Small Dwarf, Big Doors" — 9 words) in Press Start 2P at 11px, against DESIGN.md's eight-word ceiling. Four stacked. The editorial title format (`Title Review: Witty Subtitle`) is systematically 10–12 words, so this is a standing conflict between the content model and the type rule, and it hits `.review-card__title` too.
- The hero-side list labels the second-ranked review `01` (hero is 8.5, list is 8.2/8.2/8.2/8.0), so ranks are off by one. Then 800px later `02`/`03`/`04` mean sections, and `01` never appears.
- `.hero-feature__media img` applies `brightness(0.85)` *and* a scrim to `rgba(var(--scrim-rgb), 0.95)`. On candy that is darken-then-wash-white; the key art renders muddy grey-blue.
- 10 elements carry 10px functional text (`.hero-feature__overline`, `.about-pill` ×3, `.cat-badge` ×6) against an 11px floor.
- `p.cta-strip__sub` runs ~139 characters per line against DESIGN.md's 72ch rule.
- On mobile the section head puts `VIEW ALL →` on its own line above the 96px magenta rule, which then underlines only the numeral chip.
- `HeroSection` returns `null` with no hero, so the page would open on the about strip. There is no empty state, only an absence — the same pattern that produces the `03 → 04` numbering gap.
- One network failure: `googletagmanager.com/gtag/js` blocked by ORB. All first-party assets 200.

## Questions to Consider

1. If the HP-bar breakdown is the thing nobody can copy, why is the one surface a stranger is guaranteed to see the one surface without it? What breaks if the hero's 119px of dead space becomes the featured review's three components?
2. The homepage links to `/reviews` twice and to `/about` never. Is the honest read that this page asks to be believed rather than audited?
3. The reviews grid shows six `GAME` badges. Should `REVIEWS_QUERY` guarantee medium spread — at most two of any `itemType` in the homepage six — so the eight-medium promise is structurally true rather than dependent on the publishing week?
4. The page ends on four links that all leave the site, and the membership pitch sits *above* the reviews. If reach is this year's metric, which of those two decisions would you defend to a reader who bounced at y=3,200?

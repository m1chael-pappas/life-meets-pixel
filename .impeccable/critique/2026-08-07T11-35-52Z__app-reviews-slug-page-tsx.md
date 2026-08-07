---
target: the review article page
total_score: 21
max_score: 36
na_heuristics: 9
p0_count: 3
p1_count: 2
timestamp: 2026-08-07T11-35-52Z
slug: app-reviews-slug-page-tsx
---
Method: dual-agent (A: slug-A-design · B: slug-B-detector), run isolated and in parallel against a verified production build.

Target: the review article — `app/reviews/[slug]/page.tsx`. Mode: **Read**. Sampled `palworld-1-0-review`, `razer-naga-v2-review`, `regions-of-ruin-runegate-review` at 1440/1280/390 across all four palettes.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Sticky header, breadcrumb, relative dates all good. No reading progress on a 10,533px mobile document, and no signal the sidebar's breakdown exists below |
| 2 | Match System / Real World | 3 | `SIDE QUESTS`, `INSERT COIN`, HP bars are fluent. `PLAYER OPTIONS` on a mouse review, and `LV 91 · CRITIC` is a post count dressed as a credential |
| 3 | User Control and Freedom | 3 | Breadcrumbs and palette switcher work. No TOC, no jump-to-verdict, no back-to-top on 6,612px |
| 4 | Consistency and Standards | 2 | `h3` renders at **three sizes in one document** (11px pros/cons, 12px sidebar, 16px cards); `h1` renders 20px while every in-article `h2` is 24px; TL;DR and pull quote are visually identical |
| 5 | Error Prevention | 3 | Nothing on the read path can break. Empty `scoreBreakdown` rendering as silence is an unguarded authoring trap |
| 6 | Recognition Rather Than Recall | 1 | **The core failure.** Four encodings of the score, zero legend, **zero `/about` links in `<main>`** on all three articles |
| 7 | Flexibility and Efficiency | 2 | The skimming enthusiast is the stated reader. No TOC, no reading time, no jump links; pros/cons is the only skim affordance and you must scroll to reach it |
| 8 | Aesthetic and Minimalist | 3 | Article panel and stat blocks are genuinely handsome. 320px sidebar gutter sits empty for 4,900px — 74% of the read |
| 9 | Error Recovery | n/a | No error states exist on the read path; the one failure mode is silent absence, scored under 4 and 6 rather than double-counted |
| 10 | Help and Documentation | 1 | `/about` publishes six named score bands and is the site's proof asset. The page that renders a score links to it zero times |
| **Total** | | **21/36** | **58% — Acceptable** |

Heuristic 9 is `n/a`; the maximum is renormalized to 36.

## Design Specificity Verdict

**Stock article template with a retro skin, carrying one authored component and one authored layout move.**

**LLM assessment.** Strip fonts and colours and the skeleton is breadcrumb → hero → `1fr 320px` body/sidebar → prose → ad → comments → related grid. That is the WordPress review-theme wireframe, unchanged since about 2012; nothing in the structure knows it holds a scored verdict rather than a recipe. Two genuine exceptions: `findProsConsSplit()` injects pros/cons before the **second** `h2` — after one section of argument, before the deep analysis, which is a decision made by someone who thought about how a review is read — and `HPBar` itself, which reads as a stat screen rather than a chart. But `HPBar` is an authored component in a generic sidebar slot: the `<aside>` is `position: static`, its content ends at y≈1,750 while the article runs to y≈4,930, leaving **4,900px of scroll against an empty 320px gutter**.

**Deterministic scan.** CLI detector: **exit 0, zero findings**, confirmed with `--no-config` and validated against a synthetic probe. The rendered-DOM overlay found **37 anti-patterns in midnight, 18 in candy**. Adjudicated false positives: `side-tab` ×4 (thick single-side borders are the documented idiom), `ai-color-palette` ×17 (the CRT palette is the stated identity), `blinking-cursor` (an 8×8 status LED). Genuine: `low-contrast` ×1, `undersized-ui-text` ×2, `tiny-text` ×2, `line-length` ×8 — and the measured reality is worse than the overlay estimated.

## Overall Impression

The component-level craft is excellent and the page-level composition undoes it. Focus rings measure **7.96:1 to 14.89:1** across palettes, every image carries alt text, JSON-LD emits a correct `Review`/`VideoGame` graph that correctly becomes `Product` on the tech review, and `HPBar` ships real `role="progressbar"` semantics with the cells properly `aria-hidden`. Then the page puts the artifact that justifies its existence in the third block of a right rail on desktop, and at **61% scroll depth on mobile**.

**The single biggest opportunity:** stop treating the score breakdown as metadata. It is the verdict. Lay the page out starting from it.

## What's Working

1. **`HPBar` is a real product artifact with real craft** — 20 discrete cells, tone from the same `scoreTone()` as the score box, dotted rules, correct progressbar semantics with a spoken label. Nobody nearby can ship it without changing how they operate.
2. **The chrome's voice is exactly the north star** — `SIDE QUESTS · MORE LIKE THIS`, `INSERT COIN TO START THE CONVERSATION`, `▶ SCORE`. Affection rendered as craft rather than a joke about the era: the precise line DESIGN.md draws between design and kitsch, held throughout.
3. **Structured data and focus are quietly excellent** — two valid JSON-LD graphs with `itemType` correctly reflected, 42 clean tab stops, every focusable at `3px solid` with 2px offset and 8:1+ ring contrast in every palette.

## Priority Issues

### [P0] The candy palette destroys the article hero

`.article-hero__overlay` hardcodes `rgba(10, 8, 32, 0.85)` and `.article-meta__hpwrap` hardcodes `rgba(0, 0, 0, 0.6)`. Pixel-sampled across 33 points per element:

| element | candy | points failing |
|---|---|---|
| `h1.article-meta__title` | **1.06:1** | 33/33 |
| `div.article-meta__sub` | **1.06:1** | 33/33 |
| `span.score` "8.5/10" | **2.50:1** | 33/33 |
| `div.reviewed-by__avatar` | **1.05:1** | 33/33 |

The h1 is pinned near 1.2:1 *regardless of the image behind it*. Compounding it, `--shadow-hard` on candy is white, so the headline's `text-shadow: 4px 4px 0` paints a hard white ghost offset from dark text on a dark still — the ghost is more legible than the letterform.

This is the Palette-Agnostic Rule breaking on the exact element the rule was written about. **Fix:** `rgba(var(--scrim-rgb), …)` for both; on a light ground the scrim must lighten, or the meta column needs a solid `--frame-ground` plate rather than a scrim over imagery. Bind the text-shadow to its own token or drop it when `--shadow-hard` is light. `.reviewed-by__avatar` needs the same `--chip-ground` treatment `.author-chip__avatar` already got.

### [P0] The score is never given a meaning

Zero `/about` links in `<main>` on all three sampled articles. Four visual encodings — number, hearts, tone colour, HP fill — and no legend. DESIGN.md's own Score Key rule requires a route to the scale on any surface rendering a score.

**Fix:** render the band name beside the number — `8.5/10 · GREAT, GO PLAY IT` — with the chip linking `/about#scoring`; add the existing homepage Score Key panel as the last block inside `◆ SCORE BREAKDOWN`, and again under the related grid where a gold `6.0` sits beside a lime `8.2` unexplained.

### [P0] The breakdown is at 61% depth on mobile and absent on the tech review

`<aside>` follows `<article>` and `.article-body` collapses to `1fr` at ≤1024, so `◆ SCORE BREAKDOWN` lands at **y 6,427 of 10,533**. Desktop puts it 37px below the fold. `razer-naga-v2-review` renders **no breakdown at all** with no fallback, so a CMS omission becomes a silent positioning failure.

**Fix:** move the breakdown out of `<aside>` into a block rendering in or immediately below the hero at all widths; restate it as a closing score card at the `Verdict` heading so peak and end coincide; render an explicit scale-linking block when `scoreBreakdown` is empty.

### [P1] The reading measure is 95 characters, not 72

Measured per-character via `Range.getClientRects()` with ragged last lines dropped:

| viewport | column | cpl median | in 65–75? |
|---|---|---|---|
| 320 | 258px | 30 | no |
| 390 | 328px | 39 | no |
| 640 | 570px | **68** | **yes** |
| 768 | 683px | 84 | no |
| 1024–1440 | 777.6px | **95** | no |

`max-width: 72ch` carried over from the mono era. `ch` is the advance of `0`; on a proportional face that yields ~90–95 real characters. The measure moved from 64 (just below target) to 95 (well above) — the wrong direction — and the stylesheet comment asserts 72.

**Fix:** `max-width: 34em` (≈612px ≈ 68 chars) and correct the comment plus the DESIGN.md 72ch rule to state which unit applies to which face. 640px is currently the only breakpoint in band.

### [P1] The article ends on an empty room and a locked door

Final 900px: trailer → ~100px dead panel → `PLAYER COMMENTS (0)` → `NO COMMENTS YET` → `SIGN IN TO JOIN THE DISCUSSION` → related grid. For a signed-out search arrival the last two authored beats are a zero-state and an auth gate, on a site whose non-negotiable is free-site/paid-perks. `RELATED_REVIEWS_QUERY` filters on `itemType`, so **"MORE LIKE THIS" can only ever return the same medium** — the one movement PRODUCT.md explicitly wants.

**Fix:** reorder to trailer → verdict recap → related → comments; suppress the comments block entirely at zero comments for signed-out readers; mix the related set (two same-medium, one adjacent) and add `► MORE FROM MICHAEL` and `► ALL GAME REVIEWS`.

### [P2] Secondary hero text fails in three of four palettes

`span.by` and `time` sit on the photo with only partial scrim: **midnight 1.42:1 and 3.02:1**, candy 1.14/1.62, amber 1.35/2.88. Only gameboy passes. This is not a light-palette problem — it fails on the default.

### [P2] Type-split edges applied by selector list, not by role

`figcaption` renders Plex Sans 12px (credits are metadata — the exact thing mono was reserved for); `.pros ul li` renders mono 14px while the article's own `<ul>` is Plex 18px; `.reviewed-by__bio` is Plex 13px inside an all-mono stat block; the TL;DR blockquote is byte-identical to the pull quote (VT323 26px, same border, same fill) so the forty most valuable words get the same treatment as a decorative restatement. Two elements render at 10px via inline styles — `▶ SCORE` and `▶ TL;DR` — under the documented 11px floor, and the FTC affiliate disclosure line is also `fontSize: 10`.

## Persona Red Flags

**Casey (mobile, the stated primary reader)** — breakdown at y 6,427 of 10,533; interrupted at 40% scroll and the artifact is never seen. The fixed `► TWEAKS` button overlaps body copy at 390px, covering the TL;DR mid-sentence on first paint and the `REPLAYABILITY` row further down. `h1` computes to **14px** at ≤480 — the page title, in a bitmap face, two steps under the 8px pixel grid. No progress indicator on a 10,533px document.

**Jordan (first-timer from search)** — sees `8.5/10` and four encodings of it with zero routes to the scale; leaves without learning what this site's 8.5 means, which is the entire proposition. `LV 91 · CRITIC` reads as a credential but is a post count. `◆ PLAYER OPTIONS` on the Razer review holds exactly one control, which leaves the site.

**Sam (accessibility)** — candy hero at 1.06:1; the whole sidebar including the breakdown is announced after ~1,400 words, so the workings come last; the YouTube iframe has `outline-style: none` and consumes **7 consecutive tab stops** with no indicator; the comments sign-in link is **77×11px**. Credit where due: component-level a11y is markedly better than page-level.

## Minor Observations

- **`review.summary` is queried, used in metadata and JSON-LD, and never rendered.** `.article-meta__lead` is fully specified and restyled — complete, considered, dead CSS. The standfirst every north-star reference has is built and unused, which is also why the hero carries ~120px of empty scrim.
- **Cover images upscale on all three articles** — `sizes` describes width while `object-fit: cover` on a landscape asset makes height binding, so a 384px variant fills a 232×312 crop: 2.52× on Palworld, 2.23× Razer, 1.42× regions-of-ruin. In-article images carry no `sizes` and ship the 828px variant at every viewport — **2.52× oversized at 390px**.
- **Third-party JS is 797.5 KB against 265.6 KB of first-party JS** — 3×. Total 2,110 KB over 85 requests, 1,137 KB of it third-party (Clerk 358, Sanity 323, AdSense 250, GTM 184). The doubleclick ad slot renders at **0×0**.
- `razer-naga-v2-review` ships `alt="Review image"` on all three in-article images and captions none of them, against the project's own media rules.
- Quick Stats has no `gadget` branch — the mouse review shows only TYPE/CREATOR/RELEASED, and reads `CREATOR: Razer`.
- Console: 404 on `/_vercel/insights/script.js`, GTM blocked by ORB, Clerk development-keys warning.
- PRODUCT.md claims review copies and time-spent are disclosed. Neither field exists in `studio/schemaTypes/review.ts` and neither renders anywhere.

## Questions to Consider

1. If the HP breakdown is the one thing nobody can copy, why is it the third block in a right rail on desktop and the ninth thing on a phone? What does this page look like laid out *starting* from the HP bars?
2. The author had to type "8.5 out of 10, and the half point it dropped…" into the body text because the layout does nothing at the `Verdict` heading. What is the design supposed to do there, and why is the CMS covering for it?
3. `SIDE QUESTS · MORE LIKE THIS` returns three reviews of the same medium, by query design. If the reader who moves anime → games → board games is the one worth designing for, why is the only exit a same-medium exit?
4. What else in the system runs on a `ch` unit that stopped meaning characters the moment the face changed?

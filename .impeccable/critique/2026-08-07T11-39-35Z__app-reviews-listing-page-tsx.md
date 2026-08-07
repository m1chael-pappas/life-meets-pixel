---
target: the reviews listing
total_score: 19
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-08-07T11-39-35Z
slug: app-reviews-listing-page-tsx
---
Method: dual-agent (A: listing-A-design · B: listing-B-detector), run isolated. Assessment B reported late, after the parent had independently gathered CLI-detector and CDP evidence; both sets agree, and B's fuller matrix supersedes the parent's where it goes deeper. Every figure A reported that was re-measurable was re-measured and reproduced.

Target: the reviews listing — `app/reviews/(listing)/page.tsx`. Mode: **browse and choose** — the visitor should leave holding a review they want to read.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Per-tab counts are a real win, but no "showing 1–12 of 42", no pending state on a chip, and `?page=99` renders "42 ENTRIES" directly above "No reviews yet" |
| 2 | Match System / Real World | 2 | `CAT_TYPE_LABEL` is pluralised then jammed before "Reviews": the h1 reads **"BOOKS REVIEWS"**, "VIDEO GAMES REVIEWS". The `<title>` uses a second, correct map. Two label systems, one ungrammatical |
| 3 | User Control and Freedom | 2 | Filters are real hrefs — shareable and back-button correct. But the empty state has no exit, the filter bar is not sticky, and there is no clear-filter affordance |
| 4 | Consistency and Standards | 2 | Filter chips are text-only while card badges carry 9×9 sprites for the *same eight categories*, 200px apart. Two loading skins, one unreachable |
| 5 | Error Prevention | 2 | `type` and `page` are validated, but `page` is never clamped to `totalPages` — `?page=99` returns 200 and indexes as thin content. The `COMIC 0` chip is a full-weight link the page invites you to press |
| 6 | Recognition Rather Than Recall | 3 | The surface's strength: cover art, sprite badge, score, relative date, subject + studio, clamped excerpt, author. Docked because `6.0` requires recalling a scale the page never links |
| 7 | Flexibility and Efficiency | 1 | No sort, no score threshold, no year, no search. 42 items over 4 pages. A returning reader has byte-identical affordances to a first-timer |
| 8 | Aesthetic and Minimalist | 3 | Strong at 1440. **11 of 12 cards render zero tags**, leaving a dashed rule with a hole; the Tweaks button parks on card 3's author chip |
| 9 | Error Recovery | 1 | The empty state is a 📝 emoji, "NO REVIEWS FOUND", "Check back soon" — and no route to anything. A terminal page reached by a control the page advertised |
| 10 | Help and Documentation | 1 | The core artifact is a scale-dependent number and the page carries no scale. Measured: **zero `/about` links in `<main>`** |
| **Total** | | **19/40** | **Acceptable — significant work needed** |

All ten applicable; no renormalisation.

## Design Specificity Verdict

**A generic card grid with an excellent retro skin. The chrome is specific to this product; the structure is not.**

**LLM assessment.** Strip the fonts and palette and the architecture is `/blog?category=` — a flat chip rail, a three-column grid ordered by date, numeric pagination. Four pieces of evidence: the HP-bar breakdown that PRODUCT.md calls the core editorial artifact appears **zero times**, while the headline figure appears **twice** per card (score box plus heart row, same number); there is no score key and no route to the scale; ordering is `publishedAt desc` only, so on a site positioned on auditable scoring you cannot browse by score; and the nine-chip rail advertises eight mediums uniformly over a catalogue measured at `ALL 42 · GAME 30 · BOARD 1 · MOVIE 2 · TV 2 · ANIME 4 · BOOK 1 · COMIC 0 · TECH 2` — **six of nine filters land on 0, 1 or 2 results** and the layout has no answer for that shape.

The eight-medium promise *is* visible, which beats games-by-default. It is visible as a claim the layout cannot cash.

**Deterministic scan.** CLI detector across the listing page, review card, type tabs and pagination: **exit 0, zero findings**. Parent-run CDP measurements at asserted viewports:

- **Zero horizontal overflow** at 390, 800 and 1440.
- **Candy: 8 × `span.filter-count` at 2.71:1** (10px, needs 4.5) — the *only* signal telling a visitor how much content each medium holds.
- **Midnight: zero contrast failures** among text on solid backgrounds. Text over card imagery was separately pixel-sampled and is clean.
- **`span.disabled` ("← PREV") fails in ALL THREE palettes** — midnight **2.44:1**, candy **1.88:1**, gameboy **2.25:1**, every one pixel-confirmed within 0.10. Cause is deterministic: `opacity: 0.4`. The colour alone would pass.
- **Focus is clean**: a real Tab sweep found 50 focusables, zero traps, zero skips, one style throughout (`3px solid`, 2px offset) at 7.96–14.89:1 across palettes.
- **12 sub-44px targets at 1440** (8 filter chips at 43.5px, 4 pagination controls at 41px); **13 at 390px**, chips down to 39.5px.
- **10 elements rendering at 10px**, under the documented 11px floor.
- **`?type=comic`:** 0 cards, 1,224px document, zero links out.

## Overall Impression

The card itself is the best thing here and it is genuinely well made — every row on it earns its place, and the per-tab counts are a rare piece of honesty that turns "we cover eight mediums" into an audit. Everything around the card is a default: sorted by date, filtered by a flat rail, paginated numerically, with no way to ask the one question this site is uniquely equipped to answer.

**The single biggest opportunity:** 11 of 12 cards render an empty tags slot — a footer row, a dashed rule and ~40px of dead vertical space per card. Put one HP row there. It is free, and it is the single change that would make this listing impossible to mistake for a blog index.

## What's Working

1. **Per-tab counts on the filter chips.** Rare, honest, and the most product-specific decision on the surface: you can see `COMIC 0` before pressing it. Keep this even if the rail is rebuilt.
2. **The card's information design.** `.review-card__subject` in cyan — *Halo: Campaign Evolved · Xbox Game Studios* — separates what was reviewed from what the review was called, which most review sites conflate. The 3-line excerpt clamp is deliberate and its rationale is documented in the stylesheet.
3. **Filters are `<Link>` hrefs, not client state.** Shareable, indexable, back-button correct, works with JS off, `aria-current="page"` set properly, `type` validated server-side. Real discipline where most sites reach for `useState`.

## Priority Issues

### [P0] The verdict is unreadable as a verdict — no breakdown, no scale

Twelve tone-coded scores, zero HP bars, no score key, **zero `/about` links in `<main>`** (all measured). The number is duplicated by the heart row; the breakdown is absent. A first-timer from search cannot tell whether 6.0 is a recommendation or a warning, which makes the score decorative — exactly what PRODUCT.md warns weakens the product.

**Fix:** drop the existing `.score-key` panel (already built for the homepage hero) under the filter bar, linking `/about`. Then put the top-scoring *component* on each card — one HP row, `COMBAT ████████░░ 8.5` — in the space the empty tags slot already occupies.

### [P0] The empty state is an emoji dead end, and the page invites you into it

`page.tsx:96` renders `📝` at 48px, "NO REVIEWS FOUND", "Check back soon", and no link out — reached via the `COMIC 0` chip the page itself renders. `?page=99` hits the same panel while the header says "42 ENTRIES". Measured: 0 cards, zero links out.

The emoji breaks the Pixel-Icon Rule and lands in the confirmed *nostalgia kitsch* anti-reference — and `pixel-loading.tsx`'s own header comment documents removing a ❤️ emoji for exactly this reason on the same day. The dead end is worse: on a surface whose success metric is another page read, it is a guaranteed bounce that also 200s to crawlers as thin content.

**Fix:** swap the emoji for the category's own 9×9 sprite at `size={48}`; rewrite the copy to "No comics or manga reviewed yet — we're working on it."; always render an escape (a lime `► BROWSE ALL 42 REVIEWS` plus the three nearest-populated mediums); clamp `page` to `totalPages` and `notFound()` beyond it.

### [P1] 641–1023px renders one card per row — the documented tablet grid does not exist

`globals.css:2358` sets `.reviews-grid { grid-template-columns: 1fr 1fr }` at ≤1024; line 2465, inside `@media (max-width: 1023.98px)`, sets `1fr` — which wins for everything below 1024. Measured at 800px: `grid-template-columns: 753px` (one column), document height **9,788px** against 3,362px at 1440. The tablet is a *taller* page than the phone (8,259px at 390).

DESIGN.md's grid table promises `1fr 1fr` at ≤1024 and `1fr` only at ≤640; the drawer breakpoint quietly annexed the layout rule.

**Fix:** move `.news-grid, .reviews-grid { grid-template-columns: 1fr }` out of the 1023.98 block into `@media (max-width: 640px)`. One line.

### [P1] Date is the only ordering, on a site whose product is the score

`REVIEWS_PAGINATED_QUERY` is `|order(publishedAt desc)`. Recency answers "what's new"; it does not answer "what's good" — the question this site is uniquely equipped to answer. A reader wanting the best anime the site has run has no path to it.

**Fix:** a deliberately quieter second control line — `SORT: [NEWEST] [HIGHEST SCORED]` as two chips driving `?sort=` and a second GROQ order. Two options, not a dropdown, so the decision point stays at 2.

### [P2] The 11px floor and the 44px target floor both break on this surface

Measured: **10 elements at 10px** (`.filter-btn` at ≤1024, `.filter-count` at all widths, the inline "42 ENTRIES", pagination). **12 sub-44px targets at 1440, 13 at 390** — the eight filter chips land at 43.5px desktop and 39.5px mobile, missing by a hair, and the four pagination controls sit at 41px. This is in a stylesheet that carries an explicit "Tap-target floors (44×44)" section which fixed twenty other elements and missed these.

Plus **candy's inactive filter counts at 2.71:1** — the comment above `.filter-btn.is-on .filter-count` shows the *active* chip was audited and fixed while the eight inactive ones were left failing.

And a second contrast failure that is **not** palette-specific: the disabled pagination label `← PREV` renders at **2.44:1 (midnight) / 1.88:1 (candy) / 2.25:1 (gameboy)**, driven entirely by `opacity: 0.4`. Its colour would pass on its own. Disabled controls still have to meet contrast when they convey state, and this one is the only thing telling a reader they are on page 1.

## Persona Red Flags

**Jordan (first-timer landing on `?type=anime` from search)** — sees `8.2` with no unit, no scale, no legend and no `/about` link, so cannot tell whether this site grades hard or soft, which is the entire reason to trust it over IGN. A sideways click to Books gives the h1 "BOOKS REVIEWS" while the tab title says "Book Reviews". Sees three red hearts beside a gold 6.0 and four red hearts beside a lime 8.2 — `--heart` is the damage-red token in every palette, so the scan channel and the tone channel disagree on every card.

**Casey (mobile)** — 8,259px for 12 cards with a non-sticky filter bar, so changing medium after two cards means scrolling back ~3,000px. Thirteen sub-44px targets. The filter rail wraps to four rows and the first card starts around y=410 of an 844px viewport — roughly half the first screen spent on chrome.

**Sam (screen reader / keyboard)** — every card is one `<Link>` whose accessible name concatenates alt text, badge, score, date, title, subject, studio, the full excerpt and author: a ~65-word link name, twelve times. `ScoreBox` renders a bare `<div>` announced as "6.0" with no "out of 10" and no label, and since the heart row is correctly `aria-hidden`, that unlabelled number is the only channel Sam gets. Pagination disabled states are non-focusable `<span>`s, so "← PREV" simply is not in the tab order with no explanation. The `sr-only` "Results" heading never states the count or the active filter, so it announces identically on 0 results and on 42.

## Minor Observations

- `?page=99` → HTTP 200 with "42 ENTRIES" and "No reviews yet" on one screen, and `<Pagination>` returning `null` so there is no way back. `?page=-3` and `?type=bogus` both degrade correctly.
- `ReviewsListSkeleton` is effectively dead code — `counts` is awaited above the `<Suspense>`, so the route-level loading screen always wins. Two loading skins, one unreachable, and the skeleton's 420px height does not match measured card heights of 507–609.
- `.review-card.is-featured` encodes an editorial signal in **colour alone** with no label; on Gameboy, where accents collapse to two greens, that signal likely vanishes.
- `HeartRow` rounds to halves, so **8.0 and 8.2 render identically**. Combined with the tone mismatch it adds no information the score box does not carry better.
- No `<link rel="next/prev">` and no result-range copy on a four-page listing whose stated success metric is organic reach.
- `.section-head` has an `__action` slot used elsewhere on the site; here it holds a static "42 ENTRIES". A `► HOW WE SCORE →` link would fit the existing component exactly and solve half of P0-1 for free.

## Questions to Consider

1. If the score is the product, why does the grid order by date and give an 8.7 the same box as a 4.2? What would this page look like if the *layout* encoded the verdict?
2. Eleven of twelve cards render an empty tags slot. Is that space better spent on one HP row — the single change that would make this listing impossible to mistake for a blog index?
3. Six of nine filters lead to 0, 1 or 2 results. Is a flat nine-chip rail the honest presentation of a catalogue that is 71% games, or should the rail lead with GAME and group the under-served mediums?
4. If the depth model — hard offset shadows — measures 1.07:1 against the page ground on candy and the card border 1.71:1, is candy a palette or a different design system wearing the same markup?

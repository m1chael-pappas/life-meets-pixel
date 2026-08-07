// Shared retro loading skeleton.
//
// This used to be app/loading.tsx. At the root it wrapped every page in an
// implicit Suspense boundary, so Next flushed a 200 status before any page
// body ran. Any notFound() after that could no longer change the status, and
// every bogus /news/* and /reviews/* URL answered 200 with the not-found UI:
// a soft 404 that search engines index as a real page.
//
// It now lives only in (listing) route groups, which exclude the [slug]
// segments that call notFound(). Do NOT add a loading.tsx to a segment that
// has a notFound()-calling child, or the soft 404s come straight back.
//
// Rewritten 2026-08-07. The previous version broke four of the design system's
// named rules in one file: a ❤️ emoji standing in for the sprite set
// (Pixel-Icon Rule), three `rounded-full` elements and a `rounded-full`
// progress bar (Zero-Radius Rule), `font-bold` on a face that ships one weight
// (No-Weight Rule), and shadcn semantic tokens that never respond to
// `data-palette` (Palette-Agnostic Rule) — so on the Gameboy and Amber
// palettes it was the only full-colour thing on screen.

import { PixelHeart } from "@/components/retro/sprites";

/** Cells in the loading meter — the same 20 the HP bar uses, so a loading
 *  state reads as the same instrument as a score. */
const CELLS = 20;

export function PixelLoading() {
  return (
    <div className="pixel-loading" role="status" aria-live="polite">
      <div className="pixel-loading__panel">
        <span className="pixel-loading__hearts" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <PixelHeart key={i} state="full" size={20} />
          ))}
        </span>

        <h2 className="pixel-loading__title">LOADING PIXELS...</h2>

        <div className="pixel-loading__bar" aria-hidden="true">
          {Array.from({ length: CELLS }).map((_, i) => (
            <span
              key={i}
              className="pixel-loading__cell"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>

        <p className="pixel-loading__note">{"//"} Compiling awesome content...</p>
      </div>
    </div>
  );
}

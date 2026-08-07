"use client";

import Link from "next/link";
import { useState } from "react";

export type TickerItem = {
  text: string;
  /** Absent for the brand-line fallback, which is not a link. */
  href?: string;
};

/**
 * The marquee's presentation layer.
 *
 * Two accessibility problems drove this out of the server component:
 *
 * 1. A 60s infinite scroll with no way to stop it is a WCAG 2.2.2 failure at
 *    Level A — the lowest bar there is. The global `prefers-reduced-motion`
 *    block only helps readers who set the OS flag, which is not the same
 *    thing as a control. So there is a real button now, and the track also
 *    pauses on hover and on keyboard focus.
 * 2. The track is tripled so the scroll wraps seamlessly, which meant a screen
 *    reader in browse mode waded through 30 headline strings before reaching
 *    <main>. Only the first copy is exposed; the other two are decorative, and
 *    their links are taken out of the tab order too — otherwise the keyboard
 *    would walk the same ten reviews three times.
 */
export function TickerBar({ items }: { items: TickerItem[] }) {
  const [paused, setPaused] = useState(false);

  // Three copies so the -50% keyframe wraps without a visible seam.
  const copies = [0, 1, 2];

  return (
    <div
      className="lmp-ticker"
      data-paused={paused ? "true" : "false"}
      aria-label="Latest reviews"
    >
      <div className="lmp-ticker__label">
        <span>&#9654; LIVE FEED</span>
        <button
          type="button"
          className="lmp-ticker__toggle"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
        >
          <span aria-hidden="true">{paused ? "▶" : "⏸"}</span>
          <span className="sr-only">
            {paused ? "Resume scrolling headlines" : "Pause scrolling headlines"}
          </span>
        </button>
      </div>
      <div className="lmp-ticker__track">
        {copies.map((copy) => (
          <span
            key={copy}
            className="lmp-ticker__seq"
            aria-hidden={copy > 0 ? "true" : undefined}
          >
            {items.map((item, i) =>
              item.href ? (
                <Link
                  key={i}
                  href={item.href}
                  className="lmp-ticker__item"
                  tabIndex={copy > 0 ? -1 : undefined}
                >
                  {item.text}
                </Link>
              ) : (
                <span key={i} className="lmp-ticker__item">
                  {item.text}
                </span>
              )
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

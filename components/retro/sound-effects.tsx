"use client";

import { useEffect } from "react";

import { getSound } from "./sound-engine";

// Global selectors that should trigger beeps. Event delegation keeps cards
// + other server components beep-capable without making them client components.
const INTERACTIVE = [
  ".review-card",
  ".news-card",
  ".hero-feature",
  ".hero-side-item",
  ".social-tile",
  ".retro-btn",
  ".filter-btn",
  ".topic-opt",
  ".lmp-nav a",
  ".lmp-logo",
  ".lmp-nav-toggle",
  ".section-head__action",
  ".reviewed-by",
  ".staff-card",
  ".tweaks-btn",
  ".tweaks__opt",
].join(", ");

export function SoundEffects() {
  useEffect(() => {
    const sound = getSound();
    let lastHit: Element | null = null;

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const target = e.target as Element | null;
      const hit = target?.closest?.(INTERACTIVE) ?? null;
      if (hit && hit !== lastHit) {
        lastHit = hit;
        sound.hover();
      } else if (!hit) {
        lastHit = null;
      }
    }

    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (target?.closest?.(INTERACTIVE)) sound.click();
    }

    document.body.addEventListener("pointermove", onPointerMove, { passive: true });
    document.body.addEventListener("click", onClick);
    return () => {
      document.body.removeEventListener("pointermove", onPointerMove);
      document.body.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}

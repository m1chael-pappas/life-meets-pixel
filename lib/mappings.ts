import type { ReviewableItem } from "@/lib/types";

export type RetroCat =
  | "game"
  | "board"
  | "movie"
  | "tv"
  | "anime"
  | "book"
  | "comic"
  | "tech";

const ITEM_TYPE_TO_CAT: Record<ReviewableItem["itemType"], RetroCat> = {
  videogame: "game",
  boardgame: "board",
  movie: "movie",
  tvseries: "tv",
  anime: "anime",
  book: "book",
  comic: "comic",
  gadget: "tech",
};

export function itemTypeToCat(itemType: ReviewableItem["itemType"]): RetroCat {
  return ITEM_TYPE_TO_CAT[itemType] ?? "game";
}

export const CAT_LABELS: Record<RetroCat, string> = {
  game: "GAME",
  board: "BOARD",
  movie: "MOVIE",
  tv: "TV",
  anime: "ANIME",
  book: "BOOK",
  comic: "COMIC",
  tech: "TECH",
};

export const CAT_TYPE_LABEL: Record<ReviewableItem["itemType"], string> = {
  videogame: "Video Games",
  boardgame: "Board Games",
  movie: "Movies",
  tvseries: "TV Series",
  anime: "Anime",
  book: "Books",
  comic: "Comics/Manga",
  gadget: "Tech & Gadgets",
};

export const ITEM_TYPES: ReviewableItem["itemType"][] = [
  "videogame",
  "boardgame",
  "movie",
  "tvseries",
  "anime",
  "book",
  "comic",
  "gadget",
];

export function scoreTone(score: number): "low" | "mid" | "high" {
  if (score < 6) return "low";
  if (score < 8) return "mid";
  return "high";
}

export function authorInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

/** The four palette accents, with the hue each one sits at in the default
 *  palette. Hue is the only stable thing across palettes: gameboy's "magenta"
 *  is a green, but it is still the token that means the same thing. */
const ACCENT_HUES: Array<{ hue: number; token: string }> = [
  { hue: 338, token: "var(--neon-1)" },
  { hue: 189, token: "var(--neon-2)" },
  { hue: 90, token: "var(--neon-3)" },
  { hue: 48, token: "var(--neon-4)" },
];

/** Hue in degrees, plus saturation, from a #rgb or #rrggbb string. */
function hexToHs(hex: string): { hue: number; sat: number } | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return { hue: 0, sat: 0 };
  const hue =
    max === r
      ? ((g - b) / d + (g < b ? 6 : 0)) * 60
      : max === g
        ? ((b - r) / d + 2) * 60
        : ((r - g) / d + 4) * 60;
  return { hue, sat: d / (1 - Math.abs(max + min - 1) || 1) };
}

/**
 * Snap an author's or category's stored hex to the nearest palette accent.
 *
 * These colours come out of Sanity as literal hexes and used to be applied
 * inline, which meant a CMS field bypassed the palette system entirely: the
 * author byline rendered `#3ee8ff` on every palette, and on the light "candy"
 * ground that is 1.24:1 — invisible, and undetectable by any CSS audit because
 * the value never appears in a stylesheet. Snapping to a token keeps the
 * per-author identity while letting the colour follow the palette.
 */
export function paletteAccent(
  hex: string | undefined,
  fallback = "var(--neon-2)"
): string {
  if (!hex) return fallback;
  if (hex.startsWith("var(")) return hex;
  const hs = hexToHs(hex);
  // Greys carry no hue to match on, so they get the default rather than an
  // arbitrary nearest-neighbour.
  if (!hs || hs.sat < 0.15) return fallback;
  let best = ACCENT_HUES[0];
  let bestDist = 360;
  for (const candidate of ACCENT_HUES) {
    const raw = Math.abs(hs.hue - candidate.hue);
    const dist = Math.min(raw, 360 - raw);
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  }
  return best.token;
}

export function authorAccent(accentColor: string | undefined): string {
  return paletteAccent(accentColor);
}

// Derive a retro "level" from published post counts. Each review = 1 level, each news post = 1 level.
// Floor at 1 so brand-new authors don't show LV 0.
export function authorLevel(reviewCount?: number, newsCount?: number): number {
  return Math.max(1, (reviewCount ?? 0) + (newsCount ?? 0));
}

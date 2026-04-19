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

export function authorAccent(accentColor: string | undefined): string {
  return accentColor || "var(--neon-2)";
}

// Derive a retro "level" from published post counts. Each review = 1 level, each news post = 1 level.
// Floor at 1 so brand-new authors don't show LV 0.
export function authorLevel(reviewCount?: number, newsCount?: number): number {
  return Math.max(1, (reviewCount ?? 0) + (newsCount ?? 0));
}

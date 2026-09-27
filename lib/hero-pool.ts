import { cacheLife, cacheTag } from "next/cache";

import { TAGS } from "@/lib/cache-tags";
import { HERO_TOP_RATED_QUERY } from "@/lib/queries";
import type { Review } from "@/lib/types";
import { client } from "@/sanity/client";

/**
 * The homepage hero's review pool. `HeroSection` renders it and
 * `ReviewsSection` excludes its feature; both call `getHeroPool()` and share
 * one cached fetch.
 */

/** How far back "lately" reaches. */
const WINDOW_DAYS = 60;
/** Below this many reviews in the window, widen to best-of-all-time. */
const MIN_POOL = 5;

/** Midnight UTC, WINDOW_DAYS ago. Rounded to the day so the query params are
 *  stable and an identical call inside the same cache scope hits. */
function windowStart(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - WINDOW_DAYS);
  return d.toISOString();
}

export interface HeroPool {
  /** Ranked reviews the hero draws from; `[0]` is the feature. */
  pool: Review[];
  /** True when the window had enough reviews to be "lately" rather than all-time. */
  isRecent: boolean;
}

export async function getHeroPool(): Promise<HeroPool> {
  // `use cache` here does double duty. It caches the query, and it is also the
  // documented fix for the `new Date()` inside windowStart(): Cache Components
  // refuses to prerender an unstable value unless it sits in a cached scope,
  // and the cutoff is deliberately rounded to the day so the cache key is
  // stable for 24 hours rather than changing on every render.
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.reviews);

  const { recent, allTime } = await client.fetch<{
    recent: Review[];
    allTime: Review[];
  }>(HERO_TOP_RATED_QUERY, { cutoff: windowStart() });

  const pool = recent.length >= MIN_POOL ? recent : allTime;
  return { pool, isRecent: pool === recent };
}

/**
 * The `_id` of the hero's feature review, or `undefined` when the hero
 * renders nothing. Never throws.
 */
export async function getHeroFeatureId(): Promise<string | undefined> {
  const { pool } = await getHeroPool().catch(() => ({ pool: [] as Review[] }));
  return pool[0]?._id;
}

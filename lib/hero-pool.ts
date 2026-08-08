import { cacheLife, cacheTag } from "next/cache";

import { TAGS } from "@/lib/cache-tags";
import { HERO_TOP_RATED_QUERY } from "@/lib/queries";
import type { Review } from "@/lib/types";
import { client } from "@/sanity/client";

/**
 * The hero's selection logic, shared so downstream sections can exclude what
 * the hero already used.
 *
 * The homepage used to show the same reviews twice: every item in the hero's
 * ranked list reappeared in LATEST REVIEWS, and so did the feature itself, so
 * 11 review links on the page resolved to 6 unique reviews. `ReviewsSection`
 * even carried a comment saying it skipped the hero's picks, above a
 * `slice(0, 6)` that skipped nothing.
 *
 * Both sections are independently Suspense-streamed, so the fix cannot be to
 * lift the fetch into the page and pass props down without serialising them.
 * Instead both call `getHeroPool()`, and Next dedupes the identical fetch
 * within a single render pass — the second call costs nothing.
 */

/** How far back "lately" reaches. */
const WINDOW_DAYS = 60;
/** Below this many reviews in the window, widen to best-of-all-time. */
const MIN_POOL = 5;
/** Slots the hero occupies: 1 feature + 4 ranked picks. */
const HERO_SLOTS = 5;

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
 * The `_id`s the hero renders, so another section can filter them out.
 * Returns an empty set when the hero rendered nothing, which is what makes
 * this safe to call unconditionally.
 */
export async function getHeroIds(): Promise<Set<string>> {
  const { pool } = await getHeroPool().catch(() => ({ pool: [] as Review[] }));
  return new Set(pool.slice(0, HERO_SLOTS).map((r) => r._id));
}

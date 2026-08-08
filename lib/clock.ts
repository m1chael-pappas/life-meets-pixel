import { formatDistanceToNow } from "date-fns";
import { cacheLife } from "next/cache";

/**
 * Server-side "now", cached.
 *
 * Cache Components refuses to prerender an unstable value like `new Date()`,
 * because a value baked into a static shell that changes between renders is a
 * bug waiting to happen. These helpers make the staleness explicit instead: the
 * value is computed once and refreshed daily, which is the correct granularity
 * for a copyright year or a date stamp.
 *
 * Anything that genuinely needs the wall clock at request time should not use
 * these — call `connection()` first and render inside `<Suspense>`. The live
 * clock in the site header does neither: it is a Client Component, so it ticks
 * after hydration and never touches the prerender.
 */

/** The copyright year in the footer. Refreshes daily, so it rolls over on 1 Jan. */
export async function currentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/**
 * A long-form date for the legal pages' "Last updated" stamps.
 *
 * NOTE: those stamps render *today's* date, so every legal page claims to have
 * been revised today, every day. That is misleading rather than merely
 * inaccurate, and it predates this change — caching it here preserves the
 * existing behaviour so the migration stays a migration. The real fix is a
 * hard-coded revision date per document, which is a content decision.
 */
export async function longDate(): Promise<string> {
  "use cache";
  cacheLife("days");
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * "6 days ago" for an article byline.
 *
 * date-fns's formatDistanceToNow reads Date.now() internally, which is exactly
 * the unstable value Cache Components refuses to prerender. Caching it keyed on
 * the publish date makes the staleness explicit and bounded: the phrasing is
 * coarse enough that an hour of drift is invisible, and it matches the hour the
 * surrounding article page is cached for anyway.
 */
export async function relativeFromNow(isoDate: string): Promise<string> {
  "use cache";
  cacheLife("hours");
  return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
}

/**
 * Out-of-range pagination bounds, resolved at the network boundary.
 *
 * Why this exists at all: under Cache Components the root layout's static shell
 * flushes a 200 before any page code runs, so `notFound()` in a listing page
 * renders the 404 markup under a 200 status. `connection()`, `instant = false`
 * and moving the guard into `generateMetadata` were all tried and all still
 * returned 200 — the status is already gone by the time page code executes.
 * `proxy.ts` is the only place left that runs *before* the response starts.
 *
 * Cost control matters here, because proxy runs on every matched request:
 *
 *  - The check is skipped entirely unless the URL carries `?page=` above 1,
 *    which is a rounding error of real traffic.
 *  - Counts are memoised per instance for an hour. A publish does not need to
 *    invalidate this: being an hour stale only affects whether the very last
 *    page of results 404s, and the page itself renders correctly either way.
 *  - Any failure fails OPEN. A Sanity blip must never turn the listings into
 *    404s; the worst case is falling back to today's soft-404 behaviour.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

/** Must match ITEMS_PER_PAGE in both listing pages. */
export const ITEMS_PER_PAGE = 12;

const TTL_MS = 60 * 60 * 1000;

type Counts = { reviews: Record<string, number>; news: number };

/**
 * The listing validates `?type` against ITEM_TYPES and silently ignores
 * anything else, falling back to the unfiltered set. This guard has to make the
 * same call or it reads a count of 0 for a bogus type and lets the request
 * through — `?type=game&page=99` slipped past exactly that way, because the
 * real key is "videogame".
 */
const ITEM_TYPE_KEYS = new Set([
  "videogame", "boardgame", "movie", "tvseries",
  "anime", "book", "comic", "gadget",
]);
let memo: { at: number; counts: Counts } | null = null;

const QUERY = `{
  "reviews": {
    "all": count(*[_type == "review" && defined(slug.current)]),
    "videogame": count(*[_type == "review" && reviewableItem->itemType == "videogame" && defined(slug.current)]),
    "boardgame": count(*[_type == "review" && reviewableItem->itemType == "boardgame" && defined(slug.current)]),
    "movie": count(*[_type == "review" && reviewableItem->itemType == "movie" && defined(slug.current)]),
    "tvseries": count(*[_type == "review" && reviewableItem->itemType == "tvseries" && defined(slug.current)]),
    "anime": count(*[_type == "review" && reviewableItem->itemType == "anime" && defined(slug.current)]),
    "book": count(*[_type == "review" && reviewableItem->itemType == "book" && defined(slug.current)]),
    "comic": count(*[_type == "review" && reviewableItem->itemType == "comic" && defined(slug.current)]),
    "gadget": count(*[_type == "review" && reviewableItem->itemType == "gadget" && defined(slug.current)])
  },
  "news": count(*[_type == "newsPost" && defined(slug.current)])
}`;

async function getCounts(): Promise<Counts | null> {
  if (memo && Date.now() - memo.at < TTL_MS) return memo.counts;
  if (!PROJECT_ID || !DATASET) return null;

  try {
    // Plain fetch rather than @sanity/client, to keep the proxy bundle small.
    // Published content on a public dataset needs no token.
    const url =
      `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
      `?query=${encodeURIComponent(QUERY)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return null;
    const { result } = (await res.json()) as { result: Counts };
    if (!result?.reviews) return null;
    memo = { at: Date.now(), counts: result };
    return result;
  } catch {
    return null; // fail open
  }
}

/**
 * `true` when the requested page is provably past the end. `false` covers both
 * "in range" and "could not tell", which is the safe direction.
 */
export async function isPageOutOfRange(
  section: "reviews" | "news",
  page: number,
  type?: string
): Promise<boolean> {
  if (!Number.isFinite(page) || page <= 1) return false;

  const counts = await getCounts();
  if (!counts) return false;

  const validType = type && ITEM_TYPE_KEYS.has(type) ? type : undefined;
  const total =
    section === "news"
      ? counts.news
      : validType
        ? (counts.reviews[validType] ?? 0)
        : (counts.reviews.all ?? 0);

  // Zero results is the empty state's job, not a 404 — an unpopulated category
  // chip is a real page with real exits on it.
  if (total <= 0) return false;

  return page > Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
}

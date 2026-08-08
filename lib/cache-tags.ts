/**
 * Cache tags — the single vocabulary shared by every `use cache` function and
 * the Sanity webhook that invalidates them.
 *
 * Under Cache Components, `cacheLife` is only the self-heal fallback; the
 * webhook is what actually makes content appear. That is the same division of
 * labour the old `revalidatePath` setup had, and the same rule applies: if you
 * add a Sanity `_type`, give it a tag here AND wire it into the switch in
 * `app/api/revalidate/route.ts`, or edits will not surface until the fallback
 * window lapses.
 *
 * Tags are coarse on purpose. Per-slug tags would let a single review expire
 * without touching its neighbours, but every listing, the homepage rails, the
 * feed and the sitemap all embed data from many reviews, so a publish has to
 * expire those anyway. One `reviews` tag that expires all of them is honest
 * about that; a pile of per-slug tags would just be a more elaborate way of
 * expiring the same set.
 */
export const TAGS = {
  /** Any review document, and anything that lists or counts reviews. */
  reviews: "reviews",
  /** Any news post, and anything that lists them. */
  news: "news",
  /** Author profiles, plus the bylines embedded across articles and listings. */
  authors: "authors",
  /** The machine-readable surfaces: sitemap.xml and feed.xml. */
  feeds: "feeds",
} as const;

export type CacheTag = (typeof TAGS)[keyof typeof TAGS];

/**
 * Everything a change to the published URL set has to touch. The sitemap and
 * RSS feed are in here because neither is reachable from a nav link, which is
 * exactly why they were forgotten by the previous webhook and the sitemap sat
 * frozen at deploy time.
 */
export const PUBLISH_TAGS: CacheTag[] = [
  TAGS.reviews,
  TAGS.news,
  TAGS.authors,
  TAGS.feeds,
];

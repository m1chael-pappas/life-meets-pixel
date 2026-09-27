import { describe, expect, it } from "vitest";

import { ITEM_TYPES } from "@/lib/content/mappings";
import { newsArticleSchema, reviewSchema } from "@/lib/content/schema";

/**
 * itemReviewed types eligible for Google review snippets
 * (developers.google.com/search/docs/appearance/structured-data/review-snippet,
 * updated 2026-09-08), plus the schema.org subtypes the site uses:
 * VideoGame is a Game and a SoftwareApplication, TVSeries is a CreativeWorkSeries.
 */
const GOOGLE_REVIEW_TYPES = new Set([
  "Book", "Course", "CreativeWorkSeason", "CreativeWorkSeries", "Episode", "Event", "Game",
  "HowTo", "LocalBusiness", "MediaObject", "Movie", "MusicPlaylist", "MusicRecording",
  "Organization", "Product", "Recipe", "SoftwareApplication",
  "VideoGame", "TVSeries",
]);

const review = {
  title: "Lost Judgment review: a better game wrapped around a messier case",
  slug: { current: "lost-judgment-review" },
  summary: "The combat and side content are a clear step up.",
  reviewScore: 8.1,
  publishedAt: "2026-09-27T01:00:09.016Z",
  author: { name: "Michael", slug: { current: "michael" } },
  item: { title: "Lost Judgment", itemType: "videogame" },
};

describe("reviewSchema", () => {
  it("carries Google's required review snippet fields on a 0 to 10 scale", () => {
    const node = reviewSchema(review);
    expect(node["@type"]).toBe("Review");
    expect(node.reviewRating).toEqual({ "@type": "Rating", ratingValue: 8.1, bestRating: 10, worstRating: 0 });
    expect(node.itemReviewed).toMatchObject({ "@type": "VideoGame", name: "Lost Judgment" });
    expect(node.author).toMatchObject({ "@type": "Person", name: "Michael" });
    expect(node.datePublished).toBe(review.publishedAt);
  });

  it.each(ITEM_TYPES)("maps the %s item type to a Google-supported itemReviewed type", (itemType) => {
    const node = reviewSchema({ ...review, item: { ...review.item, itemType } });
    expect(GOOGLE_REVIEW_TYPES).toContain(node.itemReviewed["@type"]);
  });

  it("reports the real last edit as dateModified, falling back to the publish date", () => {
    expect(reviewSchema({ ...review, updatedAt: "2026-09-28T09:00:00Z" }).dateModified).toBe("2026-09-28T09:00:00Z");
    expect(reviewSchema(review).dateModified).toBe(review.publishedAt);
  });

  it("credits the organisation when a review has no author", () => {
    expect(reviewSchema({ ...review, author: undefined }).author).toMatchObject({ "@type": "Organization" });
  });

  it("keeps the headline within Google's 110 character limit", () => {
    const long = reviewSchema({ ...review, title: "x".repeat(200) });
    expect(long.headline).toHaveLength(110);
    expect(long.name).toHaveLength(200);
  });
});

describe("newsArticleSchema", () => {
  const post = {
    title: "y".repeat(150),
    slug: { current: "some-post" },
    publishedAt: "2026-08-15T02:00:00Z",
  };

  it("truncates the headline to 110 characters and falls back to the publish date", () => {
    const node = newsArticleSchema(post);
    expect(node.headline).toHaveLength(110);
    expect(node.dateModified).toBe(post.publishedAt);
    expect(newsArticleSchema({ ...post, updatedAt: "2026-08-16T00:00:00Z" }).dateModified).toBe("2026-08-16T00:00:00Z");
  });
});

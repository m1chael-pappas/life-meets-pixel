// JSON-LD builders. One place for every schema.org graph the site emits, so the
// publisher block and site URL can't drift between page types.
//
// Note on hreflang: the site is single-locale (en-AU) with no i18n routing, so
// hreflang would be self-referential noise. What matters instead is declaring
// the locale consistently: `<html lang>`, OG locale and `inLanguage` all say
// en-AU. Add hreflang only if a second locale ever ships.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";
const SITE_NAME = "Life Meets Pixel";
export const LOCALE = "en-AU";

/** Stable @id so every graph references one Organization node, not copies. */
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export const organizationSchema = () => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.svg`,
  },
  description:
    "Honest reviews of games, movies, books, anime, board games, and tech. No sponsors. No PR fluff.",
});

export const websiteSchema = () => ({
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: LOCALE,
  publisher: { "@id": ORG_ID },
});

/**
 * Mirrors the visible `.article-breadcrumb` trail. Keep the two in step: Google
 * treats a BreadcrumbList that does not match the on-page trail as a mismatch.
 */
export const breadcrumbSchema = (
  crumbs: Array<{ name: string; path: string }>
) => ({
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: `${SITE_URL}${c.path}`,
  })),
});

const personRef = (author?: { name?: string; slug?: { current: string } }) =>
  author?.name
    ? {
        "@type": "Person",
        name: author.name,
        ...(author.slug?.current && {
          url: `${SITE_URL}/author/${author.slug.current}`,
        }),
      }
    : { "@type": "Organization", "@id": ORG_ID };

export const newsArticleSchema = (post: {
  title: string;
  excerpt?: string;
  slug: { current: string };
  publishedAt: string;
  updatedAt?: string;
  imageUrl?: string | null;
  author?: { name?: string; slug?: { current: string } };
  categories?: Array<{ title: string }>;
}) => {
  const url = `${SITE_URL}/news/${post.slug.current}`;
  return {
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    headline: post.title.slice(0, 110), // Google ignores headlines over ~110 chars
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(post.imageUrl && { image: [post.imageUrl] }),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: personRef(post.author),
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
    inLanguage: LOCALE,
    ...(post.categories?.length && {
      articleSection: post.categories.map((c) => c.title),
    }),
  };
};

const ITEM_TYPE: Record<string, string> = {
  videogame: "VideoGame",
  boardgame: "Game",
  movie: "Movie",
  tvseries: "TVSeries",
  anime: "TVSeries",
  book: "Book",
  comic: "Book",
  gadget: "Product",
};

export const reviewSchema = (review: {
  title: string;
  slug: { current: string };
  summary?: string;
  reviewScore: number;
  publishedAt: string;
  updatedAt?: string;
  author?: { name?: string; slug?: { current: string } };
  item: { title: string; itemType?: string; description?: string };
  itemImageUrl?: string | null;
}) => {
  const url = `${SITE_URL}/reviews/${review.slug.current}`;
  return {
    "@type": "Review",
    "@id": `${url}#review`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: review.title.slice(0, 110),
    name: review.title,
    itemReviewed: {
      "@type": ITEM_TYPE[review.item.itemType ?? ""] || "CreativeWork",
      name: review.item.title,
      ...(review.itemImageUrl && { image: review.itemImageUrl }),
      ...(review.item.description && { description: review.item.description }),
    },
    reviewRating: {
      "@type": "Rating",
      // The site scores out of 10 with a 0 floor. bestRating/worstRating are
      // required whenever the scale is not Google's assumed 1-5.
      ratingValue: review.reviewScore,
      bestRating: 10,
      worstRating: 0,
    },
    ...(review.summary && { reviewBody: review.summary }),
    author: personRef(review.author),
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
    datePublished: review.publishedAt,
    dateModified: review.updatedAt || review.publishedAt,
    inLanguage: LOCALE,
  };
};

export const profilePageSchema = (author: {
  name: string;
  slug: { current: string };
  bio?: string;
  avatarUrl?: string | null;
}) => {
  const url = `${SITE_URL}/author/${author.slug.current}`;
  return {
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    url,
    inLanguage: LOCALE,
    isPartOf: { "@id": SITE_ID },
    mainEntity: {
      "@type": "Person",
      "@id": `${url}#person`,
      name: author.name,
      url,
      ...(author.bio && { description: author.bio }),
      ...(author.avatarUrl && { image: author.avatarUrl }),
      worksFor: { "@id": ORG_ID },
    },
  };
};

export const collectionPageSchema = (page: {
  name: string;
  description?: string;
  path: string;
  items?: Array<{ name: string; path: string }>;
}) => ({
  "@type": "CollectionPage",
  "@id": `${SITE_URL}${page.path}#collection`,
  url: `${SITE_URL}${page.path}`,
  name: page.name,
  ...(page.description && { description: page.description }),
  inLanguage: LOCALE,
  isPartOf: { "@id": SITE_ID },
  ...(page.items?.length && {
    mainEntity: {
      "@type": "ItemList",
      itemListElement: page.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}${it.path}`,
        name: it.name,
      })),
    },
  }),
});

/**
 * Wrap nodes in a single @graph. One script tag per page beats several
 * disconnected ones: shared nodes are referenced by @id instead of duplicated.
 */
export const graph = (...nodes: Array<object | null | undefined>) => ({
  "@context": "https://schema.org",
  "@graph": nodes.filter(Boolean),
});

// JSON-LD builders. One place for every schema.org graph the site emits, so the
// publisher block and site URL can't drift between page types.
//
// Note on hreflang: the site is single-locale (en-AU) with no i18n routing, so
// hreflang would be self-referential noise. What matters instead is declaring
// the locale consistently: `<html lang>`, OG locale and `inLanguage` all say
// en-AU. Add hreflang only if a second locale ever ships.

import { SITE_CONFIG } from "@/lib/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";
const SITE_NAME = "Life Meets Pixel";
export const LOCALE = "en-AU";

/** Stable @id so every graph references one Organization node, not copies. */
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/**
 * NewsMediaOrganization, not bare Organization.
 *
 * "Life Meets Pixel" is three common dictionary words, so search and LLM systems
 * default to parsing it as a phrase (smartphone photography, journaling apps)
 * rather than resolving it to an entity. Everything here exists to force the
 * entity reading: a specific type, an explicit country, an alternate name, and
 * verifiable links out to profiles that corroborate all three.
 *
 * Every policy URL below points at a section that actually exists. Claiming an
 * ethicsPolicy or a diversityPolicy we do not publish would be a fabricated
 * trust signal, which is exactly what these properties are checked for.
 */
export const organizationSchema = () => ({
  // Both types: NewsMediaOrganization is the specific claim, Organization keeps
  // consumers that only understand the base type working.
  "@type": ["NewsMediaOrganization", "Organization"],
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: "LMP",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/og-default.png`,
    width: 1200,
    height: 630,
  },
  image: `${SITE_URL}/og-default.png`,
  description:
    "An independent Australian review publication covering games, anime, film, " +
    "TV, books, comics, board games and tech. No sponsors. No PR fluff.",
  foundingDate: "2025",
  inLanguage: LOCALE,
  // The geographic anchor. addressCountry is the machine-readable half;
  // areaServed states who the coverage is written for.
  address: {
    "@type": "PostalAddress",
    addressCountry: "AU",
  },
  areaServed: {
    "@type": "Country",
    name: "Australia",
  },
  knowsAbout: [
    "video game reviews",
    "anime reviews",
    "film reviews",
    "television reviews",
    "book reviews",
    "comic book reviews",
    "board game reviews",
    "consumer technology reviews",
    "geek culture",
  ],
  publishingPrinciples: `${SITE_URL}/about`,
  correctionsPolicy: `${SITE_URL}/about`,
  ownershipFundingInfo: `${SITE_URL}/legal/affiliate-disclosure`,
  // sameAs is what actually resolves the entity: profiles a crawler can fetch
  // and cross-check against the same name and description.
  sameAs: [
    SITE_CONFIG.social.facebook,
    SITE_CONFIG.social.instagram,
    `https://twitter.com/${SITE_CONFIG.social.twitter.replace("@", "")}`,
  ],
});

export const websiteSchema = () => ({
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  // Repeated from the Organization on purpose: a WebSite carrying the same
  // alternateName is a second, independent signal that the phrase is a name.
  alternateName: "LMP",
  description:
    "An independent Australian review publication covering games, anime, film, " +
    "TV, books, comics, board games and tech.",
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

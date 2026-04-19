// lib/queries.ts

// TEMP: hide Alex Chen until Sanity reference-delete is resolved.
// See Projects/life-meets-pixel/backlog in the vault. Remove this once
// `pnpm delete:alex --force` is run or the author is reassigned in Studio.
export const HIDDEN_AUTHOR_IDS = ["9d0f03de-9495-4e3b-886a-f3b4a7af5b38"];

const HIDDEN_AUTHORS_GROQ = `!(_id in ${JSON.stringify(HIDDEN_AUTHOR_IDS)})`;

// Universal Reviews Query (for homepage - limited)
export const REVIEWS_QUERY = `*[
  _type == "review"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{
  _id,
  title,
  slug,
  reviewScore,
  summary,
  publishedAt,
  featured,
  reviewableItem->{
    title,
    slug,
    itemType,
    coverImage{
      asset->{
        url
      },
      alt
    },
    creator,
    publisher,
    releaseDate,
    genres[]->{
      title,
      slug,
      "color": color.hex
    }
  },
  author->{
    name,
    slug,
    "accentColor": accentColor.hex,
    avatar{
      asset->{
        url
      },
      alt
    }
  },
  categories[]->{
    title,
    slug,
    "color": color.hex
  },
  tags[]->{
    _id,
    title,
    slug
  }
}`;

// Paginated Reviews Query
export const REVIEWS_PAGINATED_QUERY = `*[
  _type == "review"
  && defined(slug.current)
]|order(publishedAt desc)[$start...$end]{
  _id,
  title,
  slug,
  reviewScore,
  summary,
  publishedAt,
  featured,
  reviewableItem->{
    title,
    slug,
    itemType,
    coverImage{
      asset->{
        url
      },
      alt
    },
    creator,
    publisher,
    releaseDate,
    genres[]->{
      title,
      slug,
      "color": color.hex
    }
  },
  author->{
    name,
    slug,
    "accentColor": accentColor.hex,
    avatar{
      asset->{
        url
      },
      alt
    }
  },
  categories[]->{
    title,
    slug,
    "color": color.hex
  },
  tags[]->{
    _id,
    title,
    slug
  }
}`;

// Featured Reviews Query
export const FEATURED_REVIEWS_QUERY = `*[
  _type == "review"
  && featured == true
  && defined(slug.current)
]|order(publishedAt desc)[0...3]{
  _id,
  title,
  slug,
  reviewScore,
  summary,
  publishedAt,
  featured,
  reviewableItem->{
    title,
    slug,
    itemType,
    coverImage{
      asset->{
        url
      },
      alt
    },
    creator,
    publisher,
    genres[]->{
      title,
      slug,
      "color": color.hex
    }
  },
  author->{
    name,
    slug,
    "accentColor": accentColor.hex,
    avatar{
      asset->{
        url
      },
      alt
    }
  },
  categories[]->{
    title,
    slug,
    "color": color.hex
  },
  tags[]->{
    _id,
    title,
    slug
  }
}`;

// Reviews by Type Query (for homepage - limited)
export const REVIEWS_BY_TYPE_QUERY = `*[
  _type == "review"
  && reviewableItem->itemType == $itemType
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{
  _id,
  title,
  slug,
  reviewScore,
  summary,
  publishedAt,
  featured,
  reviewableItem->{
    title,
    slug,
    itemType,
    coverImage{
      asset->{
        url
      },
      alt
    },
    creator,
    publisher,
    genres[]->{
      title,
      slug,
      "color": color.hex
    }
  },
  author->{
    name,
    slug,
    "accentColor": accentColor.hex,
    avatar{
      asset->{
        url
      },
      alt
    }
  },
  categories[]->{
    title,
    slug,
    "color": color.hex
  },
  tags[]->{
    _id,
    title,
    slug
  }
}`;

// Paginated Reviews by Type Query
export const REVIEWS_BY_TYPE_PAGINATED_QUERY = `*[
  _type == "review"
  && reviewableItem->itemType == $itemType
  && defined(slug.current)
]|order(publishedAt desc)[$start...$end]{
  _id,
  title,
  slug,
  reviewScore,
  summary,
  publishedAt,
  featured,
  reviewableItem->{
    title,
    slug,
    itemType,
    coverImage{
      asset->{
        url
      },
      alt
    },
    creator,
    publisher,
    genres[]->{
      title,
      slug,
      "color": color.hex
    }
  },
  author->{
    name,
    slug,
    "accentColor": accentColor.hex,
    avatar{
      asset->{
        url
      },
      alt
    }
  },
  categories[]->{
    title,
    slug,
    "color": color.hex
  },
  tags[]->{
    _id,
    title,
    slug
  }
}`;

// Total Reviews Count Query (all types)
export const REVIEWS_COUNT_QUERY = `count(*[
  _type == "review"
  && defined(slug.current)
])`;

// Total Reviews Count Query (by type)
export const REVIEWS_COUNT_BY_TYPE_QUERY = `count(*[
  _type == "review"
  && reviewableItem->itemType == $itemType
  && defined(slug.current)
])`;

// Single Review Query
export const REVIEW_QUERY = `*[
  _type == "review"
  && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  reviewScore,
  summary,
  content[]{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  },
  pros,
  cons,
  verdict,
  scoreBreakdown,
  publishedAt,
  featured,
  reviewableItem->{
    _id,
    title,
    slug,
    itemType,
    coverImage{
      asset->{
        url
      },
      alt
    },
    description,
    creator,
    publisher,
    releaseDate,
    platforms[]->{
      title,
      slug
    },
    genres[]->{
      title,
      slug,
      "color": color.hex
    },
    esrbRating,
    playerCount,
    playTime,
    runtime,
    seasons,
    episodes,
    pageCount,
    isbn,
    officialWebsite,
    affiliateLink,
    affiliatePartner
  },
  author->{
    name,
    slug,
    bio,
    "accentColor": accentColor.hex,
    "reviewCount": count(*[_type == "review" && author._ref == ^._id && defined(slug.current)]),
    "newsCount": count(*[_type == "newsPost" && author._ref == ^._id && defined(slug.current)]),
    avatar{
      asset->{
        url
      },
      alt
    },
    socialLinks
  },
  categories[]->{
    title,
    slug,
    "color": color.hex
  },
  tags[]->{
    _id,
    title,
    slug
  },
  seo
}`;

// News Query (for homepage - limited)
export const NEWS_QUERY = `*[
  _type == "newsPost"
  && defined(slug.current)
]|order(publishedAt desc)[0...20]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  breaking,
  featuredImage{
    asset->{
      url
    },
    alt
  },
  author->{
    name,
    slug,
    "accentColor": accentColor.hex,
    avatar{
      asset->{
        url
      },
      alt
    }
  },
  categories[]->{
    title,
    slug,
    "color": color.hex
  },
  tags[]->{
    _id,
    title,
    slug
  }
}`;

// Paginated News Query
export const NEWS_PAGINATED_QUERY = `*[
  _type == "newsPost"
  && defined(slug.current)
]|order(publishedAt desc)[$start...$end]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  breaking,
  featuredImage{
    asset->{
      url
    },
    alt
  },
  author->{
    name,
    slug,
    "accentColor": accentColor.hex,
    avatar{
      asset->{
        url
      },
      alt
    }
  },
  categories[]->{
    title,
    slug,
    "color": color.hex
  },
  tags[]->{
    _id,
    title,
    slug
  }
}`;

// Total News Count Query
export const NEWS_COUNT_QUERY = `count(*[
  _type == "newsPost"
  && defined(slug.current)
])`;

// Single News Post Query
export const NEWS_POST_QUERY = `*[
  _type == "newsPost"
  && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  excerpt,
  content[]{
    ...,
    _type == "image" => {
      ...,
      asset->
    }
  },
  publishedAt,
  breaking,
  featuredImage{
    asset->{
      url
    },
    alt
  },
  author->{
    name,
    slug,
    bio,
    "accentColor": accentColor.hex,
    avatar{
      asset->{
        url
      },
      alt
    },
    socialLinks
  },
  categories[]->{
    title,
    slug,
    "color": color.hex
  },
  seo
}`;

// Stats Query
export const SITE_STATS_QUERY = `{
  "totalReviews": count(*[_type == "review" && defined(slug.current)]),
  "featuredReviews": count(*[_type == "review" && featured == true && defined(slug.current)]),
  "averageScore": math::avg(*[_type == "review" && defined(reviewScore)].reviewScore),
  "totalNews": count(*[_type == "newsPost" && defined(slug.current)]),
  "reviewsByType": {
    "videogames": count(*[_type == "review" && reviewableItem->itemType == "videogame"]),
    "boardgames": count(*[_type == "review" && reviewableItem->itemType == "boardgame"]),
    "movies": count(*[_type == "review" && reviewableItem->itemType == "movie"]),
    "tvseries": count(*[_type == "review" && reviewableItem->itemType == "tvseries"]),
    "anime": count(*[_type == "review" && reviewableItem->itemType == "anime"]),
    "books": count(*[_type == "review" && reviewableItem->itemType == "book"]),
    "comics": count(*[_type == "review" && reviewableItem->itemType == "comic"]),
    "gadgets": count(*[_type == "review" && reviewableItem->itemType == "gadget"])
  }
}`;

// Related Reviews Query (by item type, excluding current slug)
export const RELATED_REVIEWS_QUERY = `*[
  _type == "review"
  && defined(slug.current)
  && reviewableItem->itemType == $itemType
  && slug.current != $slug
]|order(publishedAt desc)[0...3]{
  _id,
  title,
  slug,
  reviewScore,
  summary,
  publishedAt,
  featured,
  reviewableItem->{
    title,
    slug,
    itemType,
    coverImage{
      asset->{
        url
      },
      alt
    },
    creator,
    publisher,
    genres[]->{
      title,
      slug,
      "color": color.hex
    }
  },
  author->{
    name,
    slug,
    "accentColor": accentColor.hex,
    avatar{
      asset->{
        url
      },
      alt
    }
  },
  categories[]->{
    title,
    slug,
    "color": color.hex
  },
  tags[]->{
    _id,
    title,
    slug
  }
}`;

// All authors (for contact page staff cards) — with per-author post counts for level derivation
export const ALL_AUTHORS_QUERY = `*[
  _type == "author"
  && defined(slug.current)
  && ${HIDDEN_AUTHORS_GROQ}
]|order(name asc){
  _id,
  name,
  slug,
  bio,
  email,
  "accentColor": accentColor.hex,
  "reviewCount": count(*[_type == "review" && author._ref == ^._id && defined(slug.current)]),
  "newsCount": count(*[_type == "newsPost" && author._ref == ^._id && defined(slug.current)]),
  avatar{
    asset->{
      url
    },
    alt
  },
  socialLinks
}`;

// Review counts per itemType (for reviews listing filter pills)
export const REVIEW_COUNTS_BY_TYPE_QUERY = `{
  "all": count(*[_type == "review" && defined(slug.current)]),
  "videogame": count(*[_type == "review" && reviewableItem->itemType == "videogame" && defined(slug.current)]),
  "boardgame": count(*[_type == "review" && reviewableItem->itemType == "boardgame" && defined(slug.current)]),
  "movie": count(*[_type == "review" && reviewableItem->itemType == "movie" && defined(slug.current)]),
  "tvseries": count(*[_type == "review" && reviewableItem->itemType == "tvseries" && defined(slug.current)]),
  "anime": count(*[_type == "review" && reviewableItem->itemType == "anime" && defined(slug.current)]),
  "book": count(*[_type == "review" && reviewableItem->itemType == "book" && defined(slug.current)]),
  "comic": count(*[_type == "review" && reviewableItem->itemType == "comic" && defined(slug.current)]),
  "gadget": count(*[_type == "review" && reviewableItem->itemType == "gadget" && defined(slug.current)])
}`;

// Top Picks for hero sidebar — all reviews flagged as featured, newest first.
// Hero takes index 0; sidebar renders the next few.
export const TOP_PICKS_QUERY = `*[
  _type == "review"
  && featured == true
  && defined(slug.current)
]|order(publishedAt desc)[0...8]{
  _id,
  title,
  slug,
  reviewScore
}`;

export const fetchOptions = { next: { revalidate: 30 } };

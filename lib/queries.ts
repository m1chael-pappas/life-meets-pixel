// lib/queries.ts
// Universal Reviews Query
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
    releaseDate
  },
  author->{
    name,
    slug,
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
    color
  }
}`;

// Featured Reviews Query
export const FEATURED_REVIEWS_QUERY = `*[
  _type == "review"
  && featured == true
  && defined(slug.current)
]|order(publishedAt desc)[0...6]{
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
    publisher
  },
  author->{
    name,
    slug,
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
    color
  }
}`;

// Reviews by Type Query
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
    publisher
  },
  author->{
    name,
    slug,
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
    color
  }
}`;

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
  content,
  pros,
  cons,
  verdict,
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
      color
    },
    esrbRating,
    playerCount,
    playTime,
    runtime,
    seasons,
    episodes,
    pageCount,
    isbn,
    officialWebsite
  },
  author->{
    name,
    slug,
    bio,
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
    color
  },
  tags[]->{
    title,
    slug
  },
  seo
}`;

// News Query (keeping existing)
export const NEWS_QUERY = `*[
  _type == "newsPost"
  && defined(slug.current)
]|order(publishedAt desc)[0...6]{
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
    color
  }
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

export const fetchOptions = { next: { revalidate: 30 } };

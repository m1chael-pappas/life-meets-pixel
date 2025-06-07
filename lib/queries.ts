// lib/queries.ts
export const GAME_REVIEWS_QUERY = `*[
  _type == "gameReview"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{
  _id,
  title,
  slug,
  reviewScore,
  summary,
  publishedAt,
  featured,
  game->{
    title,
    slug,
    coverImage{
      asset->{
        url
      },
      alt
    }
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

export const FEATURED_REVIEWS_QUERY = `*[
  _type == "gameReview"
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
  game->{
    title,
    slug,
    coverImage{
      asset->{
        url
      },
      alt
    }
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

// FIXED: Updated to match your schema
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

export const SITE_STATS_QUERY = `{
  "totalReviews": count(*[_type == "gameReview" && defined(slug.current)]),
  "featuredReviews": count(*[_type == "gameReview" && featured == true && defined(slug.current)]),
  "averageScore": math::avg(*[_type == "gameReview" && defined(reviewScore)].reviewScore),
  "totalNews": count(*[_type == "newsPost" && defined(slug.current)])
}`;

export const fetchOptions = { next: { revalidate: 30 } };

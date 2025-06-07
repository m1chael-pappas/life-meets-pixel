import { type SanityDocument } from 'next-sanity';

export interface Author {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  avatar?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  bio?: string;
  socialLinks?: {
    twitter?: string;
    youtube?: string;
    twitch?: string;
  };
}

export interface Game {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  developer?: string;
  publisher?: string;
  releaseDate?: string;
  coverImage: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  platforms?: Platform[];
  genres?: Genre[];
  esrbRating?: string;
  officialWebsite?: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  color?: string;
  description?: string;
}

export interface Platform {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  manufacturer?: string;
}

export interface Genre {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

export interface Tag {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

export interface GameReview extends SanityDocument {
  title: string;
  slug: {
    current: string;
  };
  game: Game;
  reviewScore: number;
  summary: string;
  content?: any[]; // Portable Text
  pros?: string[];
  cons?: string[];
  publishedAt: string;
  author: Author;
  categories?: Category[];
  tags?: Tag[];
  featured?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface NewsArticle extends SanityDocument {
  title: string;
  slug: {
    current: string;
  };
  summary?: string;
  content?: any[]; // Portable Text
  publishedAt: string;
  author: Author;
  categories?: Category[];
  tags?: Tag[];
  featured?: boolean;
  coverImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface SiteStats {
  totalReviews: number;
  featuredReviews: number;
  averageScore: number;
  totalNews: number;
}

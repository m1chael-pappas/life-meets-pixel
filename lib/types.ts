import { PortableTextBlock } from '@portabletext/types';

export interface Author {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  bio?: string;
  email?: string;
  avatar?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  socialLinks?: {
    x?: string;
    github?: string;
    etsy?: string;
    twitch?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
    discord?: string;
  };
}

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  color?: string;
}

export interface Tag {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

export interface Platform {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

export interface Genre {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  color?: string;
}

export interface ReviewableItem {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  itemType:
    | "videogame"
    | "boardgame"
    | "movie"
    | "tvseries"
    | "anime"
    | "book"
    | "comic"
    | "gadget";
  coverImage: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  description?: string;
  releaseDate?: string;
  creator?: string;
  publisher?: string;

  // Video game fields
  platforms?: Platform[];
  esrbRating?: string;

  // Board game fields
  playerCount?: string;
  playTime?: string;

  // Movie/TV/Anime fields
  runtime?: string;
  seasons?: number;
  episodes?: number;

  // Book/Comic fields
  pageCount?: number;
  isbn?: string;

  // Common fields
  genres?: Genre[];
  officialWebsite?: string;
}

export interface Review {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  reviewScore: number;
  summary: string;
  content?: PortableTextBlock[]; // Properly typed Portable Text content
  pros?: string[];
  cons?: string[];
  verdict?: string;
  publishedAt: string;
  featured: boolean;
  reviewableItem: ReviewableItem;
  author: Author;
  categories?: Category[];
  tags?: Tag[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface NewsPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  publishedAt: string;
  breaking: boolean;
  featuredImage: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  author: Author;
  categories?: Category[];
}

export interface SiteStats {
  totalReviews: number;
  featuredReviews: number;
  averageScore: number;
  totalNews: number;
  reviewsByType: {
    videogames: number;
    boardgames: number;
    movies: number;
    tvseries: number;
    anime: number;
    books: number;
    comics: number;
    gadgets: number;
  };
}

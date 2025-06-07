import { Metadata } from 'next';
import { type SanityDocument } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';

import GameReviewCard from '@/components/game-review-card';
import { ModeToggle } from '@/components/mode-toggle';
import PixelHeartRating from '@/components/pixel-heart-rating';
import { client } from '@/sanity/client';

// Updated query for game reviews with all necessary data
const GAME_REVIEWS_QUERY = `*[
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

// Optional: Featured reviews query
const FEATURED_REVIEWS_QUERY = `*[
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

// News query
const NEWS_QUERY = `*[
  _type == "news"
  && defined(slug.current)
]|order(publishedAt desc)[0...6]{
  _id,
  title,
  slug,
  summary,
  publishedAt,
  featured,
  coverImage{
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

const options = { next: { revalidate: 30 } };

// Homepage metadata
export const metadata: Metadata = {
  title: "Life Meets Pixel - Gaming Reviews",
  description:
    "Discover the best games worth your time with our in-depth reviews and honest ratings from the pixel world. Latest game reviews, ratings, and gaming insights.",
  keywords: [
    "gaming",
    "game reviews",
    "video games",
    "pixel art",
    "indie games",
    "game ratings",
    "gaming blog",
  ],
  openGraph: {
    type: "website",
    title: "Life Meets Pixel - Gaming Reviews",
    description:
      "Discover the best games worth your time with our in-depth reviews and honest ratings from the pixel world.",
    url: "/",
    siteName: "Life Meets Pixel",
    images: [
      {
        url: "/og-home.png", // Create a specific OG image for homepage
        width: 1200,
        height: 630,
        alt: "Life Meets Pixel - Gaming Reviews Homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Meets Pixel - Gaming Reviews",
    description:
      "Discover the best games worth your time with our in-depth reviews and honest ratings.",
    images: ["/og-home.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function IndexPage() {
  // Fetch game reviews and news
  const gameReviews = await client.fetch<SanityDocument[]>(
    GAME_REVIEWS_QUERY,
    {},
    options
  );
  const featuredReviews = await client.fetch<SanityDocument[]>(
    FEATURED_REVIEWS_QUERY,
    {},
    options
  );
  const news = await client.fetch<SanityDocument[]>(NEWS_QUERY, {}, options);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary font-mono">
              LIFE MEETS PIXEL
            </h1>
            <p className="text-muted-foreground text-sm">
              Your source for honest game reviews
            </p>
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl p-6">
        {/* Hero Section */}
        <section className="text-center mb-12 py-8">
          <h2 className="text-5xl font-bold text-foreground mb-4 font-mono">
            Latest <span className="text-primary">Game Reviews</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <PixelHeartRating reviewScore={10} showScore={false} size="md" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the best games worth your time with our in-depth reviews
            and honest ratings from the pixel world
          </p>
        </section>

        {/* Featured Reviews Section */}
        {featuredReviews.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-2xl font-bold text-foreground font-mono">
                FEATURED REVIEWS
              </h3>
              <div className="h-px bg-primary/30 flex-1"></div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredReviews.map((review, index) => (
                <GameReviewCard
                  key={review._id}
                  review={review}
                  priority={index < 3} // Prioritize loading for first 3 images
                />
              ))}
            </div>
          </section>
        )}

        {/* News Section */}
        {news.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-2xl font-bold text-foreground font-mono">
                GAMING NEWS
              </h3>
              <div className="h-px bg-secondary/30 flex-1"></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {news.slice(0, 6).map((article) => (
                <article key={article._id} className="group">
                  <Link
                    href={`/news/${article.slug.current}`}
                    className="block"
                  >
                    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      {article.coverImage && (
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={article.coverImage.asset.url}
                            alt={article.coverImage.alt || article.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <time className="text-xs text-muted-foreground font-mono mb-2 block">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </time>
                        <h4 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        {article.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.summary}
                          </p>
                        )}
                        {article.author && (
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border">
                            <span className="text-xs text-muted-foreground">
                              By {article.author.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-mono text-sm transition-colors"
              >
                VIEW ALL NEWS →
              </Link>
            </div>
          </section>
        )}

        {/* Support Section (Subtle Ad Space) */}
        <section className="mb-12">
          <div className="bg-muted/20 rounded-lg p-6 text-center border border-primary/10">
            <h3 className="text-lg font-bold text-foreground mb-2 font-mono">
              SUPPORT LIFE MEETS PIXEL
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enjoying our reviews? Help us keep the pixels flowing with coffee
              ☕
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://ko-fi.com/lifemeetspixel"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-mono hover:bg-primary/90 transition-colors"
              >
                ☕ Buy us a Coffee
              </a>
              <a
                href="https://patreon.com/lifemeetspixel"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-mono hover:bg-secondary/90 transition-colors"
              >
                💖 Become a Patron
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Or check out our recommended gaming gear below 👇
            </p>
          </div>
        </section>

        {/* Recommended Gaming Gear (Affiliate Links) */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-bold text-foreground font-mono">
              GAMING GEAR WE LOVE
            </h3>
            <div className="h-px bg-accent/30 flex-1"></div>
            <span className="text-xs text-muted-foreground font-mono">
              Affiliate Links
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Gaming Headset */}
            <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="aspect-square bg-muted/20 rounded-md mb-3 flex items-center justify-center">
                <span className="text-2xl">🎧</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">Gaming Headset</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Crystal clear audio for immersive gaming
              </p>
              <a
                href="#"
                className="text-xs text-primary hover:text-primary/80 font-mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check Price →
              </a>
            </div>

            {/* Gaming Mouse */}
            <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="aspect-square bg-muted/20 rounded-md mb-3 flex items-center justify-center">
                <span className="text-2xl">🖱️</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">Gaming Mouse</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Precision and comfort for long gaming sessions
              </p>
              <a
                href="#"
                className="text-xs text-primary hover:text-primary/80 font-mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check Price →
              </a>
            </div>

            {/* Gaming Chair */}
            <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="aspect-square bg-muted/20 rounded-md mb-3 flex items-center justify-center">
                <span className="text-2xl">🪑</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">Gaming Chair</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Ergonomic support for marathon gaming
              </p>
              <a
                href="#"
                className="text-xs text-primary hover:text-primary/80 font-mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check Price →
              </a>
            </div>

            {/* Gaming Monitor */}
            <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="aspect-square bg-muted/20 rounded-md mb-3 flex items-center justify-center">
                <span className="text-2xl">🖥️</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">Gaming Monitor</h4>
              <p className="text-xs text-muted-foreground mb-2">
                High refresh rate for competitive edge
              </p>
              <a
                href="#"
                className="text-xs text-primary hover:text-primary/80 font-mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check Price →
              </a>
            </div>
          </div>
        </section>

        {/* All Reviews Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold text-foreground font-mono">
              ALL REVIEWS
            </h3>
            <div className="h-px bg-primary/30 flex-1"></div>
          </div>

          {gameReviews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gameReviews.map((review, index) => (
                <GameReviewCard
                  key={review._id}
                  review={review}
                  priority={index < 4} // Prioritize first row
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-muted-foreground mb-2 font-mono">
                No reviews yet
              </h3>
              <p className="text-muted-foreground">
                Check back soon for the latest game reviews!
              </p>
            </div>
          )}
        </section>

        {/* Stats Section (Optional) */}
        {gameReviews.length > 0 && (
          <section className="mt-16 py-8 border-t border-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary font-mono">
                  {gameReviews.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Reviews
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary font-mono">
                  {featuredReviews.length}
                </div>
                <div className="text-sm text-muted-foreground">Featured</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary font-mono">
                  {(
                    gameReviews.reduce(
                      (sum, review) => sum + review.reviewScore,
                      0
                    ) / gameReviews.length
                  ).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary font-mono">
                  {new Date().getFullYear()}
                </div>
                <div className="text-sm text-muted-foreground">Est.</div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

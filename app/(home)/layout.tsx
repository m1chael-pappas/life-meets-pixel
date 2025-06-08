import { Suspense } from 'react';

// app/(home)/layout.tsx
import { Metadata } from 'next';
import Link from 'next/link';

import { ModeToggle } from '@/components/ui/mode-toggle';

// Homepage metadata
export const metadata: Metadata = {
  title: "Life Meets Pixel - Geeky Reviews & News",
  description:
    "Your source for honest reviews of games, movies, books, anime, board games, and more. Plus the latest gaming and geek culture news.",
  keywords: [
    "gaming",
    "game reviews",
    "movie reviews",
    "book reviews",
    "anime reviews",
    "board game reviews",
    "geek culture",
    "entertainment reviews",
  ],
  openGraph: {
    type: "website",
    title: "Life Meets Pixel - Geeky Reviews & News",
    description:
      "Your source for honest reviews of games, movies, books, anime, board games, and more.",
    url: "/",
    siteName: "Life Meets Pixel",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "Life Meets Pixel - Geeky Reviews & News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Meets Pixel - Geeky Reviews & News",
    description:
      "Your source for honest reviews of games, movies, books, anime, and more.",
    images: ["/og-home.png"],
  },
  alternates: {
    canonical: "/",
  },
};

// Loading components for each section
function HeroSkeleton() {
  return (
    <section className="text-center mb-12 py-8">
      <div className="h-16 bg-muted/20 rounded-lg mb-4 animate-pulse"></div>
      <div className="h-6 bg-muted/20 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
    </section>
  );
}

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-bold text-foreground font-mono">
          {title}
        </h3>
        <div className="h-px bg-primary/30 flex-1"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 bg-muted/20 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    </section>
  );
}

interface HomeLayoutProps {
  children: React.ReactNode;
  hero: React.ReactNode;
  featured: React.ReactNode;
  news: React.ReactNode;
  support: React.ReactNode;
  gear: React.ReactNode;
  reviews: React.ReactNode;
  stats: React.ReactNode;
}

export default function HomeLayout({
  children,
  hero,
  featured,
  news,
  support,
  gear,
  reviews,
  stats,
}: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary font-mono">
                LIFE MEETS PIXEL
              </h1>
              <p className="text-muted-foreground text-sm">
                Geeky reviews & pixel-perfect insights
              </p>
            </div>
            <ModeToggle />
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/"
              className="text-primary hover:text-primary/80 font-mono transition-colors"
            >
              🏠 HOME
            </Link>
            <Link
              href="/reviews"
              className="text-foreground hover:text-primary font-mono transition-colors"
            >
              📝 ALL REVIEWS
            </Link>
            <Link
              href="/reviews?type=videogame"
              className="text-foreground hover:text-primary font-mono transition-colors"
            >
              🎮 GAMES
            </Link>
            <Link
              href="/reviews?type=movie"
              className="text-foreground hover:text-primary font-mono transition-colors"
            >
              🎬 MOVIES
            </Link>
            <Link
              href="/reviews?type=book"
              className="text-foreground hover:text-primary font-mono transition-colors"
            >
              📚 BOOKS
            </Link>
            <Link
              href="/reviews?type=anime"
              className="text-foreground hover:text-primary font-mono transition-colors"
            >
              🍥 ANIME
            </Link>
            <Link
              href="/news"
              className="text-foreground hover:text-primary font-mono transition-colors"
            >
              📰 NEWS
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl p-6">
        {/* Hero Section */}
        <Suspense fallback={<HeroSkeleton />}>{hero}</Suspense>

        {/* Featured Reviews */}
        <Suspense fallback={<SectionSkeleton title="FEATURED REVIEWS" />}>
          {featured}
        </Suspense>

        {/* Gaming News */}
        <Suspense fallback={<SectionSkeleton title="LATEST NEWS" />}>
          {news}
        </Suspense>

        {/* Support Section */}
        <Suspense
          fallback={
            <div className="h-32 bg-muted/20 rounded-lg mb-12 animate-pulse"></div>
          }
        >
          {support}
        </Suspense>

        {/* Gaming Gear */}
        <Suspense fallback={<SectionSkeleton title="GEAR WE LOVE" />}>
          {gear}
        </Suspense>

        {/* All Reviews */}
        <Suspense fallback={<SectionSkeleton title="LATEST REVIEWS" />}>
          {reviews}
        </Suspense>

        {/* Stats */}
        <Suspense
          fallback={
            <div className="h-24 bg-muted/20 rounded-lg mt-16 animate-pulse"></div>
          }
        >
          {stats}
        </Suspense>

        {children}
      </main>
    </div>
  );
}

import { Suspense } from 'react';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import FeaturedSection from '@/components/sections/featured-section';
import GearSection from '@/components/sections/gear-section';
import HeroSection from '@/components/sections/hero-section';
import NewsSection from '@/components/sections/news-section';
import ReviewsSection from '@/components/sections/reviews-section';
import StatsSection from '@/components/sections/stats-section';
import SupportSection from '@/components/sections/support-section';
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
        url: "/logo.png",
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
    images: ["/logo.png"],
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Life Meets Pixel"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <h1 className="text-3xl font-bold text-primary font-mono">
                LIFE MEETS PIXEL
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-foreground hover:text-primary font-mono text-sm transition-colors"
              >
                🏠 HOME
              </Link>
              <Link
                href="/reviews"
                className="text-foreground hover:text-primary font-mono text-sm transition-colors"
              >
                📝 REVIEWS
              </Link>
              <Link
                href="/news"
                className="text-foreground hover:text-primary font-mono text-sm transition-colors"
              >
                📰 NEWS
              </Link>
              <div className="ml-2">
                <ModeToggle />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl p-6">
        {/* Hero Section */}
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection />
        </Suspense>

        {/* Featured Reviews */}
        <Suspense fallback={<SectionSkeleton title="FEATURED REVIEWS" />}>
          <FeaturedSection />
        </Suspense>

        {/* Gaming News */}
        <Suspense fallback={<SectionSkeleton title="LATEST NEWS" />}>
          <NewsSection />
        </Suspense>

        {/* Support Section */}
        <Suspense
          fallback={
            <div className="h-32 bg-muted/20 rounded-lg mb-12 animate-pulse"></div>
          }
        >
          <SupportSection />
        </Suspense>

        {/* Gaming Gear */}
        <Suspense fallback={<SectionSkeleton title="GEAR WE LOVE" />}>
          <GearSection />
        </Suspense>

        {/* All Reviews */}
        <Suspense fallback={<SectionSkeleton title="LATEST REVIEWS" />}>
          <ReviewsSection />
        </Suspense>

        {/* Stats */}
        <Suspense
          fallback={
            <div className="h-24 bg-muted/20 rounded-lg mt-16 animate-pulse"></div>
          }
        >
          <StatsSection />
        </Suspense>
      </main>
    </div>
  );
}

import { Suspense } from 'react';

import { Metadata } from 'next';

import { ModeToggle } from '@/components/ui/mode-toggle';

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
        url: "/og-home.png",
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
        <Suspense fallback={<HeroSkeleton />}>{hero}</Suspense>

        {/* Featured Reviews */}
        <Suspense fallback={<SectionSkeleton title="FEATURED REVIEWS" />}>
          {featured}
        </Suspense>

        {/* Gaming News */}
        <Suspense fallback={<SectionSkeleton title="GAMING NEWS" />}>
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
        <Suspense fallback={<SectionSkeleton title="GAMING GEAR WE LOVE" />}>
          {gear}
        </Suspense>

        {/* All Reviews */}
        <Suspense fallback={<SectionSkeleton title="ALL REVIEWS" />}>
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

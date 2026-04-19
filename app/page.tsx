import { Suspense } from "react";

import { Metadata } from "next";

import { Ticker } from "@/components/retro/ticker";
import AboutStrip from "@/components/sections/about-strip";
import HeroSection from "@/components/sections/hero-section";
import NewsSection from "@/components/sections/news-section";
import ReviewsSection from "@/components/sections/reviews-section";
import SocialSection from "@/components/sections/social-section";
import SupportSection from "@/components/sections/support-section";
import { SiteHeader } from "@/components/site-header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

export const metadata: Metadata = {
  title: "Life Meets Pixel - Reviews & News",
  description:
    "Honest reviews of games, movies, books, anime, board games, and tech. No sponsors. No PR fluff. Just real reviews from a fellow nerd.",
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
    title: "Life Meets Pixel - Reviews & News",
    description:
      "Honest reviews of games, movies, books, anime, board games, and more.",
    url: siteUrl,
    siteName: "Life Meets Pixel",
    images: [
      {
        url: `${siteUrl}/logo.svg`,
        width: 1200,
        height: 630,
        alt: "Life Meets Pixel - Reviews & News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Meets Pixel - Reviews & News",
    description:
      "Honest reviews of games, movies, books, anime, and more.",
    images: [`${siteUrl}/logo.svg`],
  },
  alternates: {
    canonical: siteUrl,
  },
};

function HeroSkeleton() {
  return (
    <section className="hero">
      <div className="crt-frame" style={{ minHeight: 420 }}>
        <div className="hero-grid">
          <div style={{ minHeight: 420, background: "var(--bg-2)" }} />
          <div style={{ minHeight: 420, background: "var(--bg-2)" }} />
        </div>
      </div>
    </section>
  );
}

function GridSkeleton() {
  return (
    <div className="reviews-grid">
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 420, background: "var(--bg-1)", border: "3px solid var(--bg-3)" }} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteHeader currentPage="home" />
      <Suspense fallback={<div className="lmp-ticker" style={{ height: 32 }} />}>
        <Ticker />
      </Suspense>
      <main className="lmp-container">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection />
        </Suspense>

        <AboutStrip />

        <Suspense fallback={<GridSkeleton />}>
          <NewsSection />
        </Suspense>

        <SupportSection />

        <Suspense fallback={<GridSkeleton />}>
          <ReviewsSection />
        </Suspense>

        <SocialSection />
      </main>
    </>
  );
}

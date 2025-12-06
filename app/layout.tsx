import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import PageTransition from "@/components/page-transition";
import ScenicBackground from "@/components/scenic-background";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Life Meets Pixel - Reviews & News",
    template: "%s | Life Meets Pixel",
  },
  description:
    "Honest reviews of games, movies, books, anime, board games, and tech. No sponsors. No PR fluff. Just real reviews from a fellow nerd.",
  keywords: [
    "gaming",
    "game reviews",
    "movie reviews",
    "book reviews",
    "anime reviews",
    "board game reviews",
    "gadget reviews",
    "geek culture",
    "entertainment reviews",
  ],
  authors: [{ name: "Life Meets Pixel Team" }],
  creator: "Life Meets Pixel",
  publisher: "Life Meets Pixel",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Life Meets Pixel",
    title: "Life Meets Pixel - Reviews & News",
    description:
      "Honest reviews of games, movies, books, anime, board games, and more. No sponsors. No PR fluff. Just real reviews from a fellow nerd.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Life Meets Pixel - Reviews & News",
      },
    ],
  },
  alternates: {
    types: {
      "application/rss+xml": [
        {
          url: "/feed.xml",
          title: "Life Meets Pixel RSS Feed",
        },
      ],
    },
  },
  other: {
    "facebook:profile_id": "61582819127746",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Meets Pixel - Reviews & News",
    description:
      "Honest reviews of games, movies, books, anime, and more. No sponsors. No PR fluff.",
    images: ["/logo.svg"],
    creator: "@lifemeetspixel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Already verified
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ScenicBackground simplified />
          <PageTransition>
            {children}
            <SiteFooter />
          </PageTransition>
          <Analytics />
        </ThemeProvider>
      </body>

      {/* Google Analytics 4 */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}

      {/* Google Ads Conversion Tracking */}
      {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');
            `}
          </Script>
        </>
      )}
    </html>
  );
}

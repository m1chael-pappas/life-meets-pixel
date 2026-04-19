import "./globals.css";

import type { Metadata } from "next";
import { JetBrains_Mono, Press_Start_2P, VT323 } from "next/font/google";
import Script from "next/script";

import { KonamiEasterEgg } from "@/components/retro/konami";
import { SoundEffects } from "@/components/retro/sound-effects";
import { TweaksPanel } from "@/components/retro/tweaks-panel";
import { SiteFooter } from "@/components/site-footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en" data-palette="midnight" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${pressStart2P.variable} ${jetbrainsMono.variable} ${vt323.variable} antialiased`}
        data-scanlines="off"
      >
        {children}
        <SiteFooter />
        <TweaksPanel />
        <KonamiEasterEgg />
        <SoundEffects />
        <Analytics />
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

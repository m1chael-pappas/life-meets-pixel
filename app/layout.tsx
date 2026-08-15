import "./globals.css";

import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono, Press_Start_2P, VT323 } from "next/font/google";
import Script from "next/script";

import dynamic from "next/dynamic";

import { ClerkProvider } from "@clerk/nextjs";

import { KonamiEasterEgg } from "@/components/retro/konami";
import { JsonLd } from "@/components/seo/json-ld";
import { graph, organizationSchema, websiteSchema } from "@/lib/schema";
import { clerkAppearance } from "@/lib/clerk-appearance";
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

// Running prose only. JetBrains Mono carried every word on the site, which
// meant monospace signalled nothing — a TL;DR block read with the same texture
// as the paragraph under it. Measured on a real review: mono at 17px renders
// 64 characters per line in the 651px column, below the healthy 65-75 band and
// below the 72ch cap the design system asks for, because monospace is wide by
// construction. Plex Sans at 18px lands on 72 in the identical column and runs
// 9% shorter. Chosen over Inter, which would walk into the SaaS-minimalism
// anti-reference, and over a serif, which pulls toward a broadsheet arts page.
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

// Loaded only when AdSense is configured; skips the script for ad_free members.
const AdSenseLoader = dynamic(() => import("@/components/ads/adsense-loader"));

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Life Meets Pixel: Independent Australian Game, Anime and Film Reviews",
    template: "%s | Life Meets Pixel",
  },
  description:
    "An independent Australian review publication covering games, anime, film, TV, books, comics, board games and tech. Honest scored reviews, no sponsors, no PR fluff.",
  keywords: [
    "Australian gaming site",
    "Australian game reviews",
    "independent game reviews",
    "Life Meets Pixel",
    "LMP",
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
  authors: [{ name: "The Life Meets Pixel Editorial Team" }],
  creator: "Life Meets Pixel",
  publisher: "Life Meets Pixel",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com"
  ),
  openGraph: {
    type: "website",
    // Australian site: the RSS feeds and comment timestamps already say en-AU,
    // so the OG locale and JSON-LD inLanguage must agree rather than say en_US.
    locale: "en_AU",
    url: "/",
    siteName: "Life Meets Pixel",
    title: "Life Meets Pixel (LMP): Independent Australian Reviews",
    description:
      "An independent Australian review publication covering games, anime, film, TV, books, comics, board games and tech. Honest scored reviews, no sponsors, no PR fluff.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Life Meets Pixel, independent Australian reviews of games, anime, film and tech",
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
    // AdSense site verification: a static meta tag Google's crawler can see
    // in the raw HTML, independent of any client-side script loading.
    ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT
      ? { "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Meets Pixel (LMP): Independent Australian Reviews",
    description:
      "Independent Australian reviews of games, anime, film, TV, books, board games and tech. Scored, honest, no sponsors.",
    images: ["/og-default.png"],
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
  // Declared here rather than as hand-written <link> tags, which pointed at the
  // 615KB logo.svg — a 615KB download for a 16px tab icon, and Safari does not
  // accept an SVG apple-touch-icon at all, so iOS had no home-screen icon.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Membership (Clerk) is optional until its env keys exist — same pattern
  // as GA/Meta. Without keys the tree renders exactly as before.
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  const tree = (
    <html lang="en-AU" data-palette="midnight" suppressHydrationWarning>
      <head>
        {/* Organization + WebSite, emitted once sitewide. Every per-page graph
            references these by @id instead of restating the publisher. */}
        <JsonLd data={graph(organizationSchema(), websiteSchema())} />
      </head>
      <body
        className={`${pressStart2P.variable} ${jetbrainsMono.variable} ${plexSans.variable} ${vt323.variable} antialiased`}
        data-scanlines="off"
      >
        {children}
        <SiteFooter />
        <TweaksPanel />
        <KonamiEasterEgg />
        <SoundEffects />
        <Analytics />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && <AdSenseLoader />}
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

  if (!clerkEnabled) return tree;

  return (
    <ClerkProvider
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      {tree}
    </ClerkProvider>
  );
}

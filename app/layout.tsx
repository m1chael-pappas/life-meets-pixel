import './globals.css';

import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
} from 'next/font/google';

import { ThemeProvider } from '@/components/ui/theme-provider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Remove homepage-specific metadata from here - it's now in (home)/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "Life Meets Pixel - Gaming Reviews",
    template: "%s | Life Meets Pixel",
  },
  description:
    "Your source for honest game reviews and pixel-perfect insights. Discover the best games worth your time with our in-depth reviews and ratings.",
  keywords: [
    "gaming",
    "game reviews",
    "video games",
    "pixel art",
    "indie games",
    "game ratings",
  ],
  authors: [{ name: "Life Meets Pixel Team" }],
  creator: "Life Meets Pixel",
  publisher: "Life Meets Pixel",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com"
  ),
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
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
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
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

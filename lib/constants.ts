export const SITE_CONFIG = {
  name: "Life Meets Pixel",
  url: "https://lifemeetspixel.com",
  description:
    "Honest reviews of games, movies, books, anime, board games, and tech. No sponsors. No PR fluff. Just real reviews from a fellow nerd.",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61582819127746",
    instagram: "https://www.instagram.com/life_meets_pixel/",
    discord: "https://discord.gg/DpyvRH9K",
    twitter: "@lifemeetspixel",
  },
  contact: {
    email: "michael@lifemeetspixel.com",
  },
} as const;

/**
 * Default social preview card.
 *
 * PNG at 1200x630, deliberately NOT the SVG logo this used to point at: no
 * social platform and no Google surface renders an SVG og:image, so every
 * share of this site was producing a preview with no image at all.
 *
 * Next.js REPLACES a parent `openGraph` object rather than merging it, so any
 * page that declares its own must spread this in or it silently ships imageless.
 */
export const OG_IMAGE = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Life Meets Pixel \u2014 independent Australian reviews of games, anime, film and tech",
} as const;

export const SITE_CONFIG = {
  name: "Life Meets Pixel",
  url: "https://lifemeetspixel.com",
  description:
    "Honest reviews of games, movies, books, anime, board games, and tech. No sponsors. No PR fluff. Just real reviews from a fellow nerd.",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61582819127746",
    instagram: "https://www.instagram.com/life_meets_pixel/",
    discord: "https://discord.gg/DpyvRH9K",
    steam: "https://store.steampowered.com/curator/46217744-Life-Meets-Pixel/",
    twitter: "@lifemeetspixel",
  },
  contact: {
    email: "michael@lifemeetspixel.com",
  },
} as const;

export interface SocialChannel {
  label: string;
  mark: string;
  handle: string;
  href: string;
  /** A palette token, never a literal, so every channel follows the active palette. */
  color: string;
}

/**
 * Outbound social channels in display order. Drives the social cartridges on
 * the homepage and contact page and both link rows in the footer.
 */
export const SOCIAL_CHANNELS: readonly SocialChannel[] = [
  { label: "Discord", mark: "DC", handle: "life_meets_pixel", href: SITE_CONFIG.social.discord, color: "var(--neon-1)" },
  { label: "Instagram", mark: "IG", handle: "@life_meets_pixel", href: SITE_CONFIG.social.instagram, color: "var(--neon-2)" },
  { label: "Facebook", mark: "FB", handle: "Life Meets Pixel", href: SITE_CONFIG.social.facebook, color: "var(--neon-3)" },
  { label: "Steam", mark: "ST", handle: "Curator page", href: SITE_CONFIG.social.steam, color: "var(--neon-4)" },
];

/** The site feed, rendered as the last social cartridge. */
export const RSS_CHANNEL: SocialChannel = {
  label: "RSS Feed",
  mark: "RSS",
  handle: "/feed.xml",
  href: "/feed.xml",
  color: "var(--neon-1)",
};

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
  alt: "Life Meets Pixel, independent Australian reviews of games, anime, film and tech",
} as const;

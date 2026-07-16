"use client";

import Script from "next/script";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * Loads the AdSense script whenever AdSense is configured. Deliberately NOT
 * gated on Clerk membership: chaining Google's site verification to Clerk
 * availability broke verification when Clerk couldn't load (2026-07-16).
 * The ad_free perk is enforced where it's visible — AdSlot never renders ad
 * UNITS for members. Keep Auto ads OFF in the AdSense dashboard, or Google
 * will inject ads outside our slots for everyone, members included.
 */
export default function AdSenseLoader() {
  if (!ADSENSE_CLIENT) return null;
  return (
    <Script
      id="adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

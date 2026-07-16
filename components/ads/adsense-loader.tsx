"use client";

import Script from "next/script";

import { useAuth } from "@clerk/nextjs";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const CLERK_ENABLED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

/**
 * Loads the AdSense script for non-members only — skipping the script
 * entirely is what makes the ad_free perk real (no auction, no tracking).
 */
export default function AdSenseLoader() {
  if (!ADSENSE_CLIENT) return null;
  if (CLERK_ENABLED) return <MemberGatedScript />;
  return <AdScript />;
}

function MemberGatedScript() {
  const { isLoaded, has } = useAuth();
  if (!isLoaded) return null;
  if (has?.({ feature: "ad_free" })) return null;
  return <AdScript />;
}

function AdScript() {
  return (
    <Script
      id="adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

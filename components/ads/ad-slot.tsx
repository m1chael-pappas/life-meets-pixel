"use client";

import { useEffect, useRef, useState } from "react";

import { useAuth, useUser } from "@clerk/nextjs";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const CLERK_ENABLED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const DEV = process.env.NODE_ENV !== "production";

/**
 * One ad placement. Generic on purpose: today it renders an AdSense unit,
 * later individual slots can be swapped to direct-sold creatives without
 * touching page code. Renders nothing for members with the ad_free feature,
 * nothing when AdSense isn't configured (a labeled placeholder in dev).
 * Client-side by design so pages stay static/ISR-cached.
 */
export default function AdSlot({ slot }: { slot?: string }) {
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT;

  if (CLERK_ENABLED) {
    return <MemberGate adSlot={adSlot} />;
  }
  return <AdUnit adSlot={adSlot} />;
}

function MemberGate({ adSlot }: { adSlot?: string }) {
  const { isLoaded, has } = useAuth();
  const { user } = useUser();
  // While Clerk loads, render nothing rather than flashing an ad at members.
  if (!isLoaded) return null;
  if (user?.publicMetadata?.role === "admin") return null;
  if (has?.({ feature: "ad_free" })) return null;
  return <AdUnit adSlot={adSlot} />;
}

function AdUnit({ adSlot }: { adSlot?: string }) {
  const ref = useRef<HTMLModElement>(null);
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !adSlot || pushed || !ref.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setPushed(true);
    } catch {
      // AdSense script blocked or not loaded yet; leave the slot empty.
    }
  }, [adSlot, pushed]);

  if (!ADSENSE_CLIENT || !adSlot) {
    if (DEV) {
      return (
        <div className="ad-slot ad-slot--placeholder" aria-hidden="true">
          AD SLOT (set NEXT_PUBLIC_ADSENSE_CLIENT + NEXT_PUBLIC_ADSENSE_SLOT)
        </div>
      );
    }
    return null;
  }

  return (
    <div className="ad-slot">
      <span className="ad-slot__label">ADVERTISEMENT</span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

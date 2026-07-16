import dynamic from "next/dynamic";

// Server wrapper: keeps the client ad code (and its Clerk import) out of
// page bundles entirely unless AdSense is configured (placeholder in dev).
const AdSlotClient = dynamic(() => import("@/components/ads/ad-slot"));

export default function AdBreak({ slot }: { slot?: string }) {
  const configured = Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
  if (!configured && process.env.NODE_ENV === "production") return null;
  return <AdSlotClient slot={slot} />;
}

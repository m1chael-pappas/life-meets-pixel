import { NextResponse } from "next/server";

import { getMembership, MEMBER_FEATURES } from "@/lib/membership";
import { getOrCreateRssToken, rotateRssToken, rssFeedsEnabled } from "@/lib/rss";

async function requireFullRssMember() {
  const membership = await getMembership();
  if (!membership.userId) {
    return { error: NextResponse.json({ error: "Sign in required" }, { status: 401 }) };
  }
  if (!membership.hasFeature(MEMBER_FEATURES.fullRss)) {
    return {
      error: NextResponse.json(
        { error: "Full-text RSS is a member perk", upgrade: "/membership" },
        { status: 403 }
      ),
    };
  }
  return { userId: membership.userId };
}

export async function GET() {
  if (!rssFeedsEnabled()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  const gate = await requireFullRssMember();
  if ("error" in gate) return gate.error;
  const token = await getOrCreateRssToken(gate.userId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";
  return NextResponse.json({ url: `${siteUrl}/feed/${token}.xml` });
}

// Rotate: invalidates the old URL (e.g. if it leaked).
export async function POST() {
  if (!rssFeedsEnabled()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  const gate = await requireFullRssMember();
  if ("error" in gate) return gate.error;
  const token = await rotateRssToken(gate.userId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";
  return NextResponse.json({ url: `${siteUrl}/feed/${token}.xml` });
}

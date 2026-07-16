import { auth } from "@clerk/nextjs/server";

/**
 * Membership gating helpers (404-style model: free site, paid perks).
 *
 * All gating is FEATURE-based, never plan-based, so tiers/pricing stay a
 * Clerk-dashboard decision. Current dashboard setup: one "Player 2" plan
 * ($4.99/mo, $49/yr) holding all four features.
 *
 * Until the Clerk env keys exist, membership is "disabled" and every check
 * returns signed-out/false — the site works exactly as before.
 */

export const MEMBER_FEATURES = {
  adFree: "ad_free",
  comments: "comments",
  fullRss: "full_rss",
  memberPosts: "member_posts",
} as const;

export type MemberFeature =
  (typeof MEMBER_FEATURES)[keyof typeof MEMBER_FEATURES];

export function membershipEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY
  );
}

export interface Membership {
  userId: string | null;
  /** Active subscription that includes the given feature (or any feature). */
  hasFeature: (feature: MemberFeature) => boolean;
  isMember: boolean;
}

const signedOut: Membership = {
  userId: null,
  hasFeature: () => false,
  isMember: false,
};

/**
 * Resolve the current visitor's membership. Calling this opts the route into
 * dynamic rendering — only use it in API routes, member-only article pages,
 * and account surfaces. Static/ISR pages must gate client-side instead.
 */
export async function getMembership(): Promise<Membership> {
  if (!membershipEnabled()) return signedOut;
  const { userId, has } = await auth();
  if (!userId) return signedOut;
  const hasFeature = (feature: MemberFeature) => has({ feature });
  return {
    userId,
    hasFeature,
    isMember: hasFeature(MEMBER_FEATURES.adFree) ||
      hasFeature(MEMBER_FEATURES.comments) ||
      hasFeature(MEMBER_FEATURES.fullRss) ||
      hasFeature(MEMBER_FEATURES.memberPosts),
  };
}

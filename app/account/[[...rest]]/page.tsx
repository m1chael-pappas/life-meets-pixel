import { Metadata } from "next";
import { redirect } from "next/navigation";

import { UserProfile } from "@clerk/nextjs";

import RssFeedCard from "@/components/rss-feed-card";
import { SiteHeader } from "@/components/site-header";
import { getMembership, membershipEnabled } from "@/lib/membership";
import { rssFeedsEnabled } from "@/lib/rss";

/**
 * Auth-bound: every byte of this route depends on who is asking, so there is no
 * meaningful static shell to prerender. `instant = false` tells the Cache
 * Components validator that blocking is the intended design here rather than an
 * oversight — it does not force dynamic rendering, it just stops the route
 * being reported as failing instant navigation.
 */
export const instant = false;


export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  if (!membershipEnabled()) redirect("/");

  const { userId } = await getMembership();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="lmp-container">
        <div className="auth-page">
          <UserProfile path="/account" />
        </div>
        {rssFeedsEnabled() && <RssFeedCard />}
      </main>
    </>
  );
}

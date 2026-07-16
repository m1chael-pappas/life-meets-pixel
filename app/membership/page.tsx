import { Metadata } from "next";

import { PricingTable } from "@clerk/nextjs";

import { NavGlyph, type NavGlyphName } from "@/components/retro/sprites";
import { SiteHeader } from "@/components/site-header";
import { membershipEnabled } from "@/lib/membership";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

export const metadata: Metadata = {
  title: "Membership - Player 2 Mode",
  description:
    "Join Life Meets Pixel as Player 2: ad-free reading, comments, full-text RSS, and member-only posts. Independent reviews, funded by readers.",
  alternates: { canonical: `${siteUrl}/membership` },
};

const PERKS: Array<{ icon: NavGlyphName; title: string; text: string }> = [
  {
    icon: "shield",
    title: "AD-FREE",
    text: "No ads, anywhere on the site. Just the content.",
  },
  {
    icon: "bubble",
    title: "COMMENTS",
    text: "Join the discussion under every review and news post.",
  },
  {
    icon: "rss",
    title: "FULL-TEXT RSS",
    text: "A personal feed URL with complete articles in your reader.",
  },
  {
    icon: "star",
    title: "MEMBER POSTS",
    text: "Occasional members-only reviews, previews, and extras.",
  },
];

export default function MembershipPage() {
  return (
    <>
      <SiteHeader currentPage="membership" />
      <main id="main-content" className="lmp-container">
        <section className="membership-hero">
          <h1>PRESS START: PLAYER 2</h1>
          <p>
            Life Meets Pixel is independent: no sponsors, no PR fluff. Members
            keep it that way. Advertisers never influence what we review or
            what we say about it.
          </p>
        </section>

        <section className="membership-perks" aria-label="Member perks">
          {PERKS.map((perk) => (
            <div key={perk.title} className="membership-perk">
              <span className="membership-perk__icon" aria-hidden="true">
                <NavGlyph name={perk.icon} size={22} />
              </span>
              <h2>{perk.title}</h2>
              <p>{perk.text}</p>
            </div>
          ))}
        </section>

        <section className="membership-pricing" aria-label="Plans">
          {membershipEnabled() ? (
            <PricingTable />
          ) : (
            <p className="auth-page__offline">
              MEMBERSHIP SYSTEM OFFLINE. CHECK BACK SOON.
            </p>
          )}
        </section>
      </main>
    </>
  );
}

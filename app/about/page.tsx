import { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { SITE_STATS_QUERY, fetchOptions } from "@/lib/queries";
import type { SiteStats } from "@/lib/types";
import { client } from "@/sanity/client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

export const metadata: Metadata = {
  title: "About and Editorial Standards",
  description:
    "Who writes Life Meets Pixel, how we score reviews out of 10, how we handle affiliate links and review copies, and how to correct us when we get something wrong.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    type: "profile",
    title: "About and Editorial Standards | Life Meets Pixel",
    description:
      "How Life Meets Pixel scores reviews, sources images, and handles affiliate links. No sponsors, no PR fluff.",
    url: `${siteUrl}/about`,
    siteName: "Life Meets Pixel",
  },
};

/** What each band on the 10 point scale actually means, so a score is a claim
 *  a reader can hold us to rather than a number with no anchor. */
const SCALE: Array<{ band: string; label: string; blurb: string }> = [
  { band: "9.0 - 10", label: "Drop what you are doing", blurb: "Genuinely special. We will still be talking about it next year." },
  { band: "8.0 - 8.9", label: "Great, go play it", blurb: "Does what it set out to do, and the flaws never spoil it." },
  { band: "7.0 - 7.9", label: "Good, with caveats", blurb: "Worth your time if the premise appeals. Something real is holding it back." },
  { band: "6.0 - 6.9", label: "For the curious only", blurb: "Interesting ideas, uneven delivery. Wait for a sale." },
  { band: "4.0 - 5.9", label: "Not worth it yet", blurb: "Hollow, broken or unfinished. Maybe later, after patches." },
  { band: "Below 4", label: "Avoid", blurb: "We would be asking for our money back." },
];

export default async function AboutPage() {
  const stats = await client
    .fetch<SiteStats>(SITE_STATS_QUERY, {}, fetchOptions)
    .catch(() => null);

  return (
    <>
      <SiteHeader currentPage="about" />

      <main id="main-content" className="lmp-container" style={{ paddingTop: 48, paddingBottom: 32 }}>
        <section className="lmp-section">
          <div className="section-head">
            <div className="section-head__title">
              <span className="num">01</span>
              <h1>ABOUT &amp; EDITORIAL STANDARDS</h1>
            </div>
          </div>

          <div className="crt-frame about-page">
            <p className="about-page__lede">
              G&apos;day. I&apos;m Michael, a programmer and lifelong gamer from Sydney, and this is
              where I write down what I actually think about the games, films, anime, books, board
              games and gadgets I spend my time on.
            </p>

            <p>
              Life Meets Pixel is independent and self funded. Nobody pays for coverage, nobody reads
              a review before it goes up, and no score has ever been negotiated. If that ever changes
              you will read about it on this page first.
            </p>

            {stats && (
              <p className="about-page__stat">
                {stats.totalReviews} reviews and {stats.totalNews} news pieces published so far,
                averaging {stats.averageScore?.toFixed(1)} out of 10.
              </p>
            )}

            <h2>How we score</h2>
            <p>
              Every review carries one number out of 10, plus a breakdown of the three to five things
              that number is made of. The breakdown matters more than the headline figure: a game can
              earn an 8 on the strength of its systems while its story sits at 6, and you deserve to
              see which half you are buying.
            </p>

            <div className="score-scale">
              {SCALE.map((s) => (
                <div key={s.band} className="score-scale__row">
                  <span className="score-scale__band">{s.band}</span>
                  <span className="score-scale__label">{s.label}</span>
                  <span className="score-scale__blurb">{s.blurb}</span>
                </div>
              ))}
            </div>

            <p>We do not round up to be kind. If a review lands at 5, that is the review.</p>

            <h2>How a review gets made</h2>
            <ul>
              <li>
                We buy nearly everything we cover. Where a review copy, press key or early access
                build was provided, the review says so in plain text at the top.
              </li>
              <li>
                We say roughly how long we spent with something before scoring it, because twenty
                hours in a roguelike and twenty hours in an RPG are not the same claim.
              </li>
              <li>
                Reviews of live service and early access titles are dated on purpose. They describe
                the thing as it was on that date, not forever.
              </li>
            </ul>

            <h2>Images and video</h2>
            <p>
              Every image here is real: official key art, press kit material, storefront screenshots
              or publisher stills, credited in the caption. We do not use AI generated images, and we
              do not lift another outlet&apos;s screenshots. Trailers are embedded from the
              publisher&apos;s own channel, never from a reupload.
            </p>

            <h2>Affiliate links and advertising</h2>
            <p>
              Some links to storefronts earn us a commission at no extra cost to you. They never
              affect a score, and no review is commissioned by a retailer. The full detail is in the{" "}
              <Link href="/legal/affiliate-disclosure">affiliate disclosure</Link>. Display
              advertising is served by third parties and kept out of the body of an article, and{" "}
              <Link href="/membership">members</Link> who support the site directly see no ads at
              all.
            </p>

            <h2>Corrections</h2>
            <p>
              We get things wrong sometimes. When we do we fix the article and say what changed,
              rather than quietly editing it. If you have spotted an error, a broken fact or a
              miscredited image, tell us on the <Link href="/contact">contact page</Link> and we will
              sort it out.
            </p>

            <h2>Who writes here</h2>
            <p>
              Reviews and news are written by named humans, and every article links to its
              author&apos;s page so you can see everything else they have written and judge their
              taste against your own. Where an article builds on reporting by another outlet, that
              outlet is linked in the text, because they did the work.
            </p>

            <p style={{ marginTop: 32, marginBottom: 0 }}>
              <Link href="/reviews" className="retro-btn retro-btn--lime">
                ► READ THE REVIEWS
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

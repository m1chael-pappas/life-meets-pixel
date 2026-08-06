import { Metadata } from "next";
import Link from "next/link";

import { NavGlyph } from "@/components/retro/sprites";
import { SiteHeader } from "@/components/site-header";
import { scoreTone } from "@/lib/mappings";
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
    // Next.js REPLACES a parent openGraph object rather than merging it,
    // so the locale has to be restated on every page that defines its own.
    locale: "en_AU",
    type: "profile",
    title: "About and Editorial Standards | Life Meets Pixel",
    description:
      "How Life Meets Pixel scores reviews, sources images, and handles affiliate links. No sponsors, no PR fluff.",
    url: `${siteUrl}/about`,
    siteName: "Life Meets Pixel",
  },
};

/** What each band on the 10 point scale means, so a score is a claim a reader
 *  can hold us to. `mid` is the representative score for the band, which drives
 *  the chip colour through the same `scoreTone` the review pages use. */
const SCALE: Array<{ band: string; mid: number; label: string; blurb: string }> = [
  { band: "9.0-10", mid: 9.5, label: "Drop what you are doing", blurb: "Genuinely special. We will still be talking about it next year." },
  { band: "8.0-8.9", mid: 8.4, label: "Great, go play it", blurb: "Does what it set out to do, and the flaws never spoil it." },
  { band: "7.0-7.9", mid: 7.4, label: "Good, with caveats", blurb: "Worth your time if the premise appeals. Something real is holding it back." },
  { band: "6.0-6.9", mid: 6.4, label: "For the curious only", blurb: "Interesting ideas, uneven delivery. Wait for a sale." },
  { band: "4.0-5.9", mid: 5.0, label: "Not worth it yet", blurb: "Hollow, broken or unfinished. Maybe later, after patches." },
  { band: "0-3.9", mid: 2.0, label: "Avoid", blurb: "We would be asking for our money back." },
];

const TONE_VAR: Record<ReturnType<typeof scoreTone>, string> = {
  high: "var(--neon-3)",
  mid: "var(--neon-4)",
  low: "var(--heart)",
};

export default async function AboutPage() {
  const stats = await client
    .fetch<SiteStats>(SITE_STATS_QUERY, {}, fetchOptions)
    .catch(() => null);

  return (
    <>
      <SiteHeader currentPage="about" />

      <main id="main-content" className="lmp-container" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <section className="about-hero">
          <div className="about-hero__grid">
            <div>
              <h1 className="about-hero__title">ABOUT</h1>
              <p className="about-hero__sub">
                G&apos;day. I&apos;m Michael, a programmer and lifelong gamer from Sydney, and this
                is where I write down what I actually think about the games, films, anime, books,
                board games and gadgets I spend my time on.
              </p>
              <div className="about-hero__pills">
                <span className="about-tag">NO SPONSORS</span>
                <span className="about-tag">NO PR FLUFF</span>
                <span className="about-tag">SELF FUNDED</span>
              </div>
            </div>
            {/* `star` not `shield`: the shield sprite is a solid 9x9 fill with no
                internal detail, so at this size it renders as an unreadable
                block. Star has structure, and it is already the nav icon for
                reviews. */}
            <div className="about-hero__badge" aria-hidden="true">
              <NavGlyph name="star" size={80} color="var(--neon-2)" />
            </div>
          </div>
        </section>

        <div className="about-grid">
          <div className="about-main">
            <section className="about-block">
              <h2 className="about-block__head">HOW WE SCORE</h2>
              <p>
                Every review carries one number out of 10, plus a breakdown of the three to five
                things that number is made of. The breakdown matters more than the headline figure:
                a game can earn an 8 on the strength of its systems while its story sits at 6, and
                you deserve to see which half you are buying.
              </p>

              <div className="score-scale">
                {SCALE.map((s) => {
                  const colour = TONE_VAR[scoreTone(s.mid)];
                  return (
                    <div key={s.band} className="score-scale__row">
                      <span
                        className="score-scale__chip"
                        style={{ color: colour, borderColor: colour }}
                      >
                        {s.band}
                      </span>
                      <div className="score-scale__text">
                        <span className="score-scale__label">{s.label}</span>
                        <span className="score-scale__blurb">{s.blurb}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="about-block__note">
                We do not round up to be kind. If a review lands at 5, that is the review.
              </p>
            </section>

            <section className="about-block">
              <h2 className="about-block__head">HOW A REVIEW GETS MADE</h2>
              <ul className="about-list">
                <li>
                  We buy nearly everything we cover. Where a review copy, press key or early access
                  build was provided, the review says so in plain text at the top.
                </li>
                <li>
                  We say roughly how long we spent with something before scoring it, because twenty
                  hours in a roguelike and twenty hours in an RPG are not the same claim.
                </li>
                <li>
                  Reviews of live service and early access titles are dated on purpose. They
                  describe the thing as it was on that date, not forever.
                </li>
              </ul>
            </section>

            <section className="about-block">
              <h2 className="about-block__head">IMAGES AND VIDEO</h2>
              <p>
                Every image here is real: official key art, press kit material, storefront
                screenshots or publisher stills, credited in the caption. We do not use AI generated
                images, and we do not lift another outlet&apos;s screenshots. Trailers are embedded
                from the publisher&apos;s own channel, never from a reupload.
              </p>
            </section>

            <section className="about-block">
              <h2 className="about-block__head">AFFILIATE LINKS AND ADS</h2>
              <p>
                Some links to storefronts earn us a commission at no extra cost to you. They never
                affect a score, and no review is commissioned by a retailer. The full detail is in
                the <Link href="/legal/affiliate-disclosure">affiliate disclosure</Link>. Display
                advertising is served by third parties and kept out of the body of an article, and{" "}
                <Link href="/membership">members</Link> who support the site directly see no ads at
                all.
              </p>
            </section>

            <section className="about-block">
              <h2 className="about-block__head">CORRECTIONS</h2>
              <p>
                We get things wrong sometimes. When we do we fix the article and say what changed,
                rather than quietly editing it. If you have spotted an error, a broken fact or a
                miscredited image, tell us on the <Link href="/contact">contact page</Link> and we
                will sort it out.
              </p>
            </section>

            <section className="about-block">
              <h2 className="about-block__head">WHO WRITES HERE</h2>
              <p>
                Reviews and news are written by named humans, and every article links to its
                author&apos;s page so you can see everything else they have written and judge their
                taste against your own. Where an article builds on reporting by another outlet, that
                outlet is linked in the text, because they did the work.
              </p>
            </section>
          </div>

          <aside className="about-side">
            {stats && (
              <div className="stat-block">
                <div className="about-side__head">◆ AT A GLANCE</div>
                <div className="stat-row">
                  <span>REVIEWS</span>
                  <span className="about-side__val">{stats.totalReviews}</span>
                </div>
                <div className="stat-row">
                  <span>NEWS &amp; PREVIEWS</span>
                  <span className="about-side__val">{stats.totalNews}</span>
                </div>
                <div className="stat-row">
                  <span>AVERAGE SCORE</span>
                  <span
                    className="about-side__val"
                    style={{ color: TONE_VAR[scoreTone(stats.averageScore ?? 0)] }}
                  >
                    {stats.averageScore?.toFixed(1)}
                  </span>
                </div>
                <div className="stat-row" style={{ borderBottom: "none" }}>
                  <span>PUBLISHING SINCE</span>
                  <span className="about-side__val">2025</span>
                </div>
              </div>
            )}

            <div className="stat-block">
              <div className="about-side__head">◆ THE SHORT VERSION</div>
              <ul className="about-side__rules">
                <li>Nobody pays for coverage.</li>
                <li>Nobody reads a review before you do.</li>
                <li>No score has ever been negotiated.</li>
                <li>Every image is real and credited.</li>
              </ul>
            </div>

            <div className="stat-block about-side__cta">
              <div className="about-side__head">◆ START HERE</div>
              <Link href="/reviews" className="retro-btn retro-btn--lime">
                ► READ THE REVIEWS
              </Link>
              <Link href="/contact" className="retro-btn">
                ► TELL US WE ARE WRONG
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

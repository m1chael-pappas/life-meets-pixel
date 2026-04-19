import { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/retro/contact-form";
import { SiteHeader } from "@/components/site-header";
import { SITE_CONFIG } from "@/lib/constants";
import { authorInitial, authorLevel } from "@/lib/mappings";
import { ALL_AUTHORS_QUERY, fetchOptions } from "@/lib/queries";
import type { Author } from "@/lib/types";
import { client } from "@/sanity/client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Drop us a line — review requests, news tips, collabs, or just to say g'day.",
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: "Contact | Life Meets Pixel",
    description: "Drop us a line — review requests, news tips, collabs.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
};

const SOCIAL_TILES = [
  { name: "DISCORD", mark: "DC", handle: "life_meets_pixel", href: SITE_CONFIG.social.discord, color: "#a3adf6" },
  { name: "INSTAGRAM", mark: "IG", handle: "@life_meets_pixel", href: SITE_CONFIG.social.instagram, color: "var(--neon-1)" },
  { name: "FACEBOOK", mark: "FB", handle: "Life Meets Pixel", href: SITE_CONFIG.social.facebook, color: "var(--neon-2)" },
  { name: "RSS", mark: "RSS", handle: "/feed.xml", href: "/feed.xml", color: "var(--neon-4)" },
];

export default async function ContactPage() {
  const authors = await client.fetch<Author[]>(ALL_AUTHORS_QUERY, {}, fetchOptions);

  return (
    <>
      <SiteHeader currentPage="contact" />
      <main className="lmp-container" style={{ paddingTop: 48, paddingBottom: 32 }}>
        <section className="contact-hero">
          <div className="contact-hero__grid">
            <div>
              <h1 className="contact-hero__title">DROP US A LINE</h1>
              <p className="contact-hero__sub">
                Review requests, news tips, collab pitches, or just a friendly g&apos;day — we read{" "}
                <strong>every</strong> message. No PR fluff, please.
              </p>
            </div>
            <div className="contact-hero__badge" aria-hidden="true">
              ✉
            </div>
          </div>
        </section>

        <div className="contact-grid">
          <ContactForm />

          <aside className="contact-side">
            {authors.slice(0, 4).map((a) => (
              <div
                key={a._id}
                className="staff-card"
                style={{ color: a.accentColor || "var(--neon-2)" }}
              >
                <div
                  className="staff-card__avatar"
                  style={{ color: a.accentColor || "var(--neon-2)" }}
                >
                  {authorInitial(a.name)}
                </div>
                <div>
                  <div className="staff-card__name" style={{ color: "var(--ink)" }}>
                    {a.name}
                    <span className="staff-card__lvl">
                      LV {authorLevel(a.reviewCount, a.newsCount)} · CRITIC
                    </span>
                  </div>
                  <div className="staff-card__role">Reviewer</div>
                  {a.bio && <p className="staff-card__bio">{a.bio}</p>}
                  {a.email && (
                    <p className="staff-card__bio" style={{ marginTop: 6 }}>
                      <a href={`mailto:${a.email}`} style={{ color: "var(--neon-2)" }}>
                        {a.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="inbox-card">
              <h3>◆ INBOX STATUS</h3>
              <div className="inbox-row">
                <span className="lbl">RESPONSE TIME</span>
                <span className="val good">&lt; 48H</span>
              </div>
              <div className="inbox-row">
                <span className="lbl">REVIEW QUEUE</span>
                <span className="val">OPEN</span>
              </div>
              <div className="inbox-row">
                <span className="lbl">COLLAB SLOTS</span>
                <span className="val good">AVAILABLE</span>
              </div>
              <div className="inbox-row">
                <span className="lbl">GENERAL EMAIL</span>
                <span className="val">
                  <a
                    href={`mailto:${SITE_CONFIG.contact.email}`}
                    style={{ color: "var(--neon-2)", fontFamily: "var(--font-press-start-2p)" }}
                  >
                    {SITE_CONFIG.contact.email}
                  </a>
                </span>
              </div>
            </div>
          </aside>
        </div>

        <section className="lmp-section--tight">
          <div className="section-head">
            <div className="section-head__title">
              <span className="num">◆</span>
              <h2>OR CATCH US ON THE GRID</h2>
            </div>
          </div>
          <div className="socials-grid">
            {SOCIAL_TILES.map((t) => (
              <a
                key={t.name}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-tile"
                style={{ color: t.color }}
              >
                <div className="social-tile__mark">{t.mark}</div>
                <div className="social-tile__name">{t.name}</div>
                <div className="social-tile__handle">{t.handle}</div>
              </a>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 16, textAlign: "center" }}>
            Want to buy us a coffee instead?{" "}
            <Link href="/" style={{ color: "var(--neon-2)" }}>
              See support options on the homepage →
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}

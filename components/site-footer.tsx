import Link from "next/link";

import { currentYear } from "@/lib/site/clock";
import { SOCIAL_CHANNELS } from "@/lib/site/constants";

export async function SiteFooter() {
  const year = await currentYear();

  return (
    <footer className="lmp-footer">
      <div className="lmp-container">
        {/* The footer had no heading of its own, so its four column headings
            outlined as children of whichever section happened to precede it —
            the social section. The four columns are peers, not a hierarchy, so
            the fix is a region heading above them rather than promoting one
            column to parent. */}
        <h2 className="sr-only">Site footer</h2>
        <div className="footer-grid">
          <div className="footer-col">
            <h3>► LIFE MEETS PIXEL</h3>
            <p className="footer-about">
              <strong>Life Meets Pixel (LMP)</strong> is an independent Australian review
              publication covering games, anime, film, TV, books, comics, board games and tech.
              Every verdict is scored and broken down. No sponsors. No PR fluff.
            </p>
          </div>
          <div className="footer-col">
            <h3>QUICK LINKS</h3>
            <ul>
              <li>
                <Link href="/reviews">Reviews</Link>
              </li>
              <li>
                <Link href="/news">News &amp; Previews</Link>
              </li>
              <li>
                <Link href="/membership">Membership</Link>
              </li>
              <li>
                <Link href="/about">About &amp; Editorial Standards</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>LEGAL</h3>
            <ul>
              <li>
                <Link href="/legal/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/legal/terms">Terms of Use</Link>
              </li>
              <li>
                <Link href="/legal/affiliate-disclosure">Affiliate Disclosure</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>CONNECT</h3>
            <ul>
              {SOCIAL_CHANNELS.map((c) => (
                <li key={c.label}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer">
                    {c.label}
                  </a>
                </li>
              ))}
              <li>
                {/* Plain anchor, not Link. As a Link, Next prefetched it on
                    every page that renders the footer — 27kb of XML downloaded
                    on load for a document that is never a client-side
                    navigation. */}
                <a href="/feed.xml">RSS Feed</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <span>
            © {year} LIFE MEETS PIXEL · INSERT COIN TO CONTINUE{" "}
            <span className="footer-credit">
              <span className="footer-credit__sep" aria-hidden="true">
                ·{" "}
              </span>
              <a
                href="https://onthedot.au/?utm_source=life-meets-pixel&utm_medium=built-by&utm_campaign=footer"
                target="_blank"
                rel="noopener"
              >
                Built by OnTheDot.
              </a>
            </span>
          </span>
          <div className="socials">
            {SOCIAL_CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                aria-label={`${c.mark}: ${c.label}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {c.mark}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

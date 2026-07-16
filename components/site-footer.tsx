import Link from "next/link";

import { SITE_CONFIG } from "@/lib/constants";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="lmp-footer">
      <div className="lmp-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>► LIFE MEETS PIXEL</h3>
            <p className="footer-about">
              Honest reviews of games, movies, books, anime, and tech. Plus gaming news, previews,
              and thoughts on what we&apos;re playing. No sponsors. No PR fluff.
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
              <li>
                <a href={SITE_CONFIG.social.discord} target="_blank" rel="noopener noreferrer">
                  Discord
                </a>
              </li>
              <li>
                <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <Link href="/feed.xml">RSS Feed</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <span>
            © {currentYear} LIFE MEETS PIXEL · INSERT COIN TO CONTINUE ·{" "}
            <a
              href="https://onthedot.au/?utm_source=life-meets-pixel&utm_medium=built-by&utm_campaign=footer"
              target="_blank"
              rel="noopener"
            >
              Built by OnTheDot.
            </a>
          </span>
          <div className="socials">
            <a href={SITE_CONFIG.social.discord} aria-label="DC: Discord" target="_blank" rel="noopener noreferrer">
              DC
            </a>
            <a
              href={SITE_CONFIG.social.instagram}
              aria-label="IG: Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              IG
            </a>
            <a href={SITE_CONFIG.social.facebook} aria-label="FB: Facebook" target="_blank" rel="noopener noreferrer">
              FB
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

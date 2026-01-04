import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { SiDiscord } from 'react-icons/si';

import { SITE_CONFIG } from '@/lib/constants';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-16">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="font-bold text-foreground mb-3 font-mono">
              LIFE MEETS PIXEL
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Your source for honest reviews of games, movies, books, anime, and
              more. Plus gaming news, previews, and thoughts on what we&apos;re playing.
            </p>
            <p className="text-xs text-muted-foreground">
              © {currentYear} Life Meets Pixel. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-3 font-mono">
              QUICK LINKS
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/reviews"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  News & Previews
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-foreground mb-3 font-mono">LEGAL</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/affiliate-disclosure"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Affiliate Disclosure
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-foreground mb-3 font-mono">
              CONNECT
            </h3>
            <div className="flex gap-3">
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SITE_CONFIG.social.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Join our Discord server"
              >
                <SiDiscord className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

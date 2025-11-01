import Link from 'next/link';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-16">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="font-bold text-foreground mb-3 font-mono">
              LIFE MEETS PIXEL
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Your source for honest reviews of games, movies, books, anime, and
              more. Plus the latest gaming and geek culture news.
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
                  News
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
        </div>
      </div>
    </footer>
  );
}

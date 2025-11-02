import { Metadata } from 'next';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { SiDiscord } from 'react-icons/si';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Want us to review your game, board game, book, or gadget? Get in touch with the Life Meets Pixel team.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us | Life Meets Pixel",
    description:
      "Want us to review your game, board game, book, or gadget? Get in touch with the Life Meets Pixel team.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader currentPage="contact" />

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl p-6">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-mono">
            GET IN TOUCH
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Want us to review your latest creation? We&apos;d love to hear from
            you!
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          {/* Review Submissions */}
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-foreground mb-3 font-mono">
              GAME REVIEWS
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Got a video game or board game you&apos;d like us to review? We
              cover everything from AAA titles to indie gems, and tabletop
              classics to modern board game innovations.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span>Video games (all platforms)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span>Board games & tabletop RPGs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span>Card games & party games</span>
              </li>
            </ul>
          </div>

          {/* Other Reviews */}
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-foreground mb-3 font-mono">
              OTHER CONTENT
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Our coverage extends beyond games. We review movies, TV series,
              anime, books, comics, and gaming gadgets too!
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span>Movies, TV series & anime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span>Books & comic books</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span>Gaming gadgets & accessories</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Before You Reach Out */}
        <div className="bg-accent/20 border border-accent rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-4 font-mono flex items-center gap-2">
            <span>✨</span>
            BEFORE YOU REACH OUT
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            We want to make sure we&apos;re a good fit for your content. Please
            take a moment to explore our website first to get a feel for our
            review style, tone, and the types of content we cover.
          </p>
          <Link href="/reviews">
            <Button variant="default" className="font-mono">
              EXPLORE OUR REVIEWS →
            </Button>
          </Link>
        </div>

        {/* Contact Methods */}
        <div className="bg-card border border-border rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 font-mono">
            HOW TO REACH US
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="text-primary">📧</span>
                Email
              </h4>
              <p className="text-muted-foreground mb-2">
                For review submissions and general inquiries:
              </p>
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-primary hover:text-primary/80 font-mono transition-colors"
              >
                {SITE_CONFIG.contact.email}
              </a>
            </div>

            <div className="border-t border-border pt-6">
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="text-primary">🌐</span>
                Follow Us
              </h4>
              <p className="text-muted-foreground mb-3">
                Stay updated with our latest reviews and news, and join our
                community:
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={SITE_CONFIG.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="text-sm font-medium">Facebook</span>
                </a>
                <a
                  href={SITE_CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                <a
                  href={SITE_CONFIG.social.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Join our Discord server"
                >
                  <SiDiscord className="h-5 w-5" />
                  <span className="text-sm font-medium">Discord</span>
                </a>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="text-primary">💬</span>
                What to Include
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Brief description of your game/product</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Target platform(s) and release date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Link to trailer, website, or press kit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Your preferred review timeline</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="text-primary">⏱️</span>
                Response Time
              </h4>
              <p className="text-sm text-muted-foreground">
                We aim to respond to all review requests within 2-5 business
                days. Due to high volume, we may not be able to review every
                submission, but we read every email!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            We appreciate your interest in Life Meets Pixel and look forward to
            hearing from you!
          </p>
        </div>
      </main>
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

export const metadata: Metadata = {
  title: "Legal Information",
  description:
    "Legal information, policies, and disclosures for Life Meets Pixel.",
  alternates: {
    canonical: `${siteUrl}/legal`,
  },
};

export default function LegalPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container mx-auto max-w-4xl p-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-mono">
            LEGAL INFORMATION
          </h1>
          <p className="text-muted-foreground">
            Important legal information, policies, and disclosures for Life
            Meets Pixel.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Privacy Policy */}
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-foreground mb-3 font-mono">
              PRIVACY POLICY
            </h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Learn how we collect, use, and protect your personal information.
            </p>
            <Link href="/legal/privacy">
              <Button variant="outline" className="w-full font-mono">
                READ MORE →
              </Button>
            </Link>
          </div>

          {/* Terms of Use */}
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-foreground mb-3 font-mono">
              TERMS OF USE
            </h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Review the terms and conditions for using our website and
              services.
            </p>
            <Link href="/legal/terms">
              <Button variant="outline" className="w-full font-mono">
                READ MORE →
              </Button>
            </Link>
          </div>

          {/* Affiliate Disclosure */}
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="text-xl font-bold text-foreground mb-3 font-mono">
              AFFILIATE DISCLOSURE
            </h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Information about our affiliate relationships and sponsored
              content.
            </p>
            <Link href="/legal/affiliate-disclosure">
              <Button variant="outline" className="w-full font-mono">
                READ MORE →
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </main>
    </div>
  );
}

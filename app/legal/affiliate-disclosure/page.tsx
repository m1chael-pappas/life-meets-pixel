import { Metadata } from 'next';
import Link from 'next/link';

import { SiteHeader } from '@/components/site-header';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Affiliate Disclosure for Life Meets Pixel - Information about our affiliate relationships and sponsored content.",
  alternates: {
    canonical: `${siteUrl}/legal/affiliate-disclosure`,
  },
};

export default function AffiliateDisclosurePage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="container mx-auto max-w-4xl p-6">
        <div className="mb-8">
          <Link
            href="/legal"
            className="text-sm text-primary hover:text-primary/80 font-mono"
          >
            ← Back to Legal
          </Link>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-mono">
            AFFILIATE DISCLOSURE
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {lastUpdated}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Regulatory Compliance
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Life Meets Pixel is an Australian registered business and we
              comply with both Australian and international advertising
              standards. We participate in various affiliate advertising
              programs designed to provide a means for sites to earn advertising
              fees by advertising and linking to affiliated websites and
              retailers.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In accordance with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>
                The Australian Consumer Law (ACL) and Australian Competition and
                Consumer Commission (ACCC) guidelines on advertising and
                endorsements
              </li>
              <li>
                The Federal Trade Commission&apos;s (FTC) guidelines concerning
                the use of endorsements and testimonials in advertising (for our
                international audience)
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We are required to inform you of our affiliate relationships,
              sponsorships, and potential compensation. This disclosure ensures
              transparency and helps you make informed decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              What Are Affiliate Links?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Affiliate links are special URLs that track when a visitor clicks
              through from our site to a merchant&apos;s website and makes a
              purchase. When you click on an affiliate link and make a purchase,
              we may earn a small commission at no additional cost to you.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These commissions help support the operation of Life Meets Pixel
              and allow us to continue creating content for you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Affiliate Programs We Participate In
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may participate in affiliate programs from various companies,
              including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Amazon Associates</li>
              <li>Gaming platforms and digital distribution services</li>
              <li>Board game retailers and publishers</li>
              <li>Book retailers</li>
              <li>Gaming hardware and accessory manufacturers</li>
              <li>Streaming services</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This list is not exhaustive and may change over time as we add or
              remove affiliate partnerships.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Our Commitment to Honesty and Transparency
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As an Australian business, we take our obligations under the
              Australian Consumer Law seriously. We are committed to honest,
              transparent advertising and ensuring consumers can make informed
              decisions. Here&apos;s our commitment to you:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>
                <strong className="text-foreground">
                  Editorial Independence:
                </strong>{" "}
                Our reviews and opinions are never influenced by affiliate
                relationships. We only recommend products and services we
                genuinely believe in. All opinions are our own.
              </li>
              <li>
                <strong className="text-foreground">Honest Reviews:</strong>{" "}
                Whether we use affiliate links or not, our reviews remain honest
                and unbiased. We will criticize products if they deserve it,
                regardless of potential affiliate earnings. We do not mislead or
                deceive consumers.
              </li>
              <li>
                <strong className="text-foreground">No Extra Cost:</strong>{" "}
                Using our affiliate links costs you nothing extra. The price you
                pay is the same whether you use our link or go directly to the
                merchant.
              </li>
              <li>
                <strong className="text-foreground">Quality First:</strong> We
                only include affiliate links for products and services that we
                believe provide value to our readers.
              </li>
              <li>
                <strong className="text-foreground">Clear Disclosure:</strong>{" "}
                We clearly identify affiliate links, sponsored content, and paid
                partnerships in accordance with Australian advertising
                standards.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Review Copies and Free Products
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may receive free review copies of games, books, products, or
              early access to content from publishers, developers, and
              manufacturers. Receiving a free copy does not guarantee a positive
              review or any review at all.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When we review a product we received for free, we will disclose
              this information in the review. Our opinions remain independent
              and honest regardless of how we obtained the product.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Sponsored Content
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              From time to time, we may publish sponsored content or paid
              partnerships. Any sponsored or paid content will be clearly
              labeled as such with disclosures like &quot;Sponsored,&quot;
              &quot;Paid Partnership,&quot; or similar language.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Even in sponsored content, we maintain editorial control and only
              partner with brands and products that align with our values and
              that we believe will interest our audience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Support Platforms
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may use support platforms such as Ko-fi, Patreon, or similar
              services to allow readers to support our work directly. These are
              voluntary contributions and do not guarantee any special treatment
              or influence over our content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Your Support Matters
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By using our affiliate links when making purchases, you&apos;re
              supporting Life Meets Pixel at no extra cost to yourself. This
              helps us:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Cover website hosting and operational costs</li>
              <li>Purchase games and products to review</li>
              <li>Dedicate more time to creating quality content</li>
              <li>Keep the site free of intrusive advertising</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              However, you are never obligated to use our affiliate links.
              You&apos;re free to purchase products directly from merchants if
              you prefer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Complaints and Concerns
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We believe in complete transparency and accountability. If you
              have any questions about our affiliate relationships, sponsored
              content, or how we earn revenue, or if you believe any of our
              content is misleading or deceptive, please contact us at:
            </p>
            <p className="text-muted-foreground mb-4">
              <a
                href="mailto:michael@lifemeetspixel.com"
                className="text-primary hover:text-primary/80"
              >
                michael@lifemeetspixel.com
              </a>
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have concerns about our advertising practices that you feel
              we have not adequately addressed, you may also contact:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>
                <strong className="text-foreground">
                  Australian Competition and Consumer Commission (ACCC)
                </strong>
                <br />
                <a
                  href="https://www.accc.gov.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  www.accc.gov.au
                </a>
                <br />
                Phone: 1300 302 502
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <div className="bg-accent/20 border border-accent rounded-lg p-6">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                <strong className="text-foreground">Bottom Line:</strong> We
                only recommend products and services we genuinely believe in.
                Our primary goal is to provide valuable, honest content to our
                readers. Any affiliate commissions we earn are a bonus that
                helps keep the lights on, but they never compromise our
                integrity or editorial independence.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                As an Australian business, we are committed to fair and honest
                advertising practices in compliance with the Australian Consumer
                Law and ACCC guidelines. We do not engage in misleading or
                deceptive conduct.
              </p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}

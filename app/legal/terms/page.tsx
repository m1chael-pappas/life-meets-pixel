import { Metadata } from 'next';
import Link from 'next/link';

import { SiteHeader } from '@/components/site-header';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for Life Meets Pixel - Rules and guidelines for using our website.",
  alternates: {
    canonical: `${siteUrl}/legal/terms`,
  },
};

export default function TermsOfUsePage() {
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
            TERMS OF USE
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {lastUpdated}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Agreement to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Life Meets Pixel is an Australian registered business. By
              accessing and using Life Meets Pixel (&quot;the Site&quot;), you
              agree to be bound by these Terms of Use and all applicable laws
              and regulations, including Australian Consumer Law (ACL) under the
              Competition and Consumer Act 2010 (Cth). If you do not agree with
              any of these terms, you are prohibited from using this site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Use License
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Permission is granted to temporarily access and view the materials
              on Life Meets Pixel for personal, non-commercial use only. This
              license does not include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for commercial purposes</li>
              <li>Attempting to reverse engineer any software on the site</li>
              <li>Removing any copyright or proprietary notations</li>
              <li>
                Transferring materials to another person or mirroring the
                materials on another server
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Content and Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All content on Life Meets Pixel, including but not limited to
              text, reviews, graphics, logos, images, and software, is the
              property of Life Meets Pixel or its content suppliers and is
              protected by copyright and intellectual property laws.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may not reproduce, distribute, or create derivative works from
              our content without explicit written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              User Conduct
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When using our website, you agree not to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Transmit any harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the website or servers</li>
              <li>Use automated systems to scrape or download content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Reviews and Opinions
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All reviews and opinions expressed on Life Meets Pixel are the
              personal opinions of our writers and do not represent absolute
              fact. We strive for fairness and accuracy in all reviews.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may receive review copies of games, products, or other
              materials from publishers and developers. This does not influence
              our reviews, which remain honest and unbiased.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Support and Donations
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may accept support through platforms like Ko-fi, Patreon, or
              similar services. Donations and subscriptions are voluntary and
              non-refundable unless required by law. We reserve the right to
              modify or discontinue any support programs at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              External Links
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our website may contain links to third-party websites. We are not
              responsible for the content, privacy policies, or practices of
              these external sites. Visiting third-party sites is at your own
              risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Australian Consumer Law
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nothing in these Terms of Use is intended to limit or exclude any
              rights you may have under the Australian Consumer Law (ACL) or
              other applicable consumer protection laws that cannot be excluded,
              restricted, or modified by agreement.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under the ACL, you have certain consumer guarantees that apply to
              goods and services. These guarantees cannot be excluded and take
              precedence over anything in these terms that may be inconsistent
              with them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Disclaimer
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To the extent permitted by Australian law, the materials on Life
              Meets Pixel are provided &quot;as is.&quot; Except as required by
              the Australian Consumer Law or other applicable law, we make no
              warranties, expressed or implied, and hereby disclaim all other
              warranties including, without limitation, implied warranties of
              merchantability, fitness for a particular purpose, or
              non-infringement.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not warrant that the site will be uninterrupted, error-free,
              or free of viruses or other harmful components.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Limitations of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To the maximum extent permitted by Australian law (including the
              Australian Consumer Law), in no event shall Life Meets Pixel or
              its suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit) arising out of the
              use or inability to use the materials on our website.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Where the Australian Consumer Law or other applicable law implies
              a guarantee or condition that cannot be excluded, our liability is
              limited to the maximum extent permitted by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Modifications
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Changes
              will be posted on this page with an updated &quot;Last
              updated&quot; date. Your continued use of the site following any
              changes constitutes acceptance of those changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Governing Law
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These terms shall be governed by and construed in accordance with
              the laws of Australia. Any disputes arising from these terms or
              your use of this website shall be subject to the exclusive
              jurisdiction of the courts of Australia.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nothing in this clause affects your rights under the Australian
              Consumer Law or other mandatory consumer protection legislation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms of Use, please contact
              us at:
            </p>
            <p className="text-muted-foreground mb-2">
              <a
                href="mailto:michael@lifemeetspixel.com"
                className="text-primary hover:text-primary/80"
              >
                michael@lifemeetspixel.com
              </a>
            </p>
            <p className="text-muted-foreground text-sm">
              Life Meets Pixel
              <br />
              Australia
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}

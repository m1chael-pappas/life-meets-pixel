import { Metadata } from 'next';
import Link from 'next/link';

import { SiteHeader } from '@/components/site-header';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Life Meets Pixel - Learn how we collect, use, and protect your information.",
  alternates: {
    canonical: `${siteUrl}/legal/privacy`,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
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
            PRIVACY POLICY
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: {lastUpdated}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Life Meets Pixel (&quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;) is an Australian registered business that respects
              your privacy and is committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard
              your information when you visit our website in accordance with the
              Australian Privacy Principles (APPs) under the Privacy Act 1988
              (Cth) and other applicable privacy laws.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We are committed to handling your personal information in
              accordance with Australian privacy laws and the Australian Privacy
              Principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Information We Collect
            </h2>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Information you provide
            </h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Email addresses when you contact us</li>
              <li>Any information you include in messages to us</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-2">
              Automatically collected information
            </h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages you visit on our site</li>
              <li>Time and date of your visit</li>
              <li>Time spent on pages</li>
              <li>IP address (anonymized)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              How We Use Your Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Respond to your inquiries and requests</li>
              <li>Improve our website and content</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Send updates about our content (only if you opt-in)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Cookies and Tracking
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may use cookies and similar tracking technologies to enhance
              your experience on our website. Cookies are small files stored on
              your device that help us:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Remember your preferences</li>
              <li>Understand how you interact with our site</li>
              <li>Improve site performance</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can disable cookies in your browser settings, but this may
              affect your experience on our site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Third-Party Services
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may use third-party services for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Analytics (to understand site usage)</li>
              <li>Hosting and infrastructure</li>
              <li>Content delivery</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These services may have access to your data only to perform
              specific tasks on our behalf and are obligated not to disclose or
              use it for other purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement appropriate security measures to protect your
              personal information. However, no method of transmission over the
              internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under Australian privacy law and the Australian Privacy
              Principles, you have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate or outdated information</li>
              <li>
                Request deletion of your personal information (subject to legal
                requirements)
              </li>
              <li>Opt-out of marketing communications at any time</li>
              <li>Object to processing of your personal information</li>
              <li>
                Make a complaint to the Office of the Australian Information
                Commissioner (OAIC) if you believe we have breached the Privacy
                Act
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To exercise any of these rights, please contact us using the
              details provided below. We will respond to your request within a
              reasonable timeframe as required by Australian privacy law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Overseas Disclosure
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may disclose your personal information to third-party service
              providers located overseas, including but not limited to the
              United States and other countries where our hosting, analytics,
              and content delivery services are located. By using our website,
              you consent to such overseas disclosures.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We take reasonable steps to ensure that overseas recipients handle
              your personal information in accordance with Australian privacy
              laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Children&apos;s Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our website is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              with an updated &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Complaints
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have a complaint about how we have handled your personal
              information, please contact us first using the details below. We
              will investigate your complaint and respond within a reasonable
              timeframe.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you are not satisfied with our response, you may lodge a
              complaint with the Office of the Australian Information
              Commissioner (OAIC):
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>
                Website:{" "}
                <a
                  href="https://www.oaic.gov.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80"
                >
                  www.oaic.gov.au
                </a>
              </li>
              <li>Phone: 1300 363 992</li>
              <li>Email: enquiries@oaic.gov.au</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
              Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about this privacy policy, wish to access or
              correct your personal information, or have any concerns about our
              data practices, please contact us at:
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

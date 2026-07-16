import { Metadata } from "next";

import { SignIn } from "@clerk/nextjs";

import { SiteHeader } from "@/components/site-header";
import { membershipEnabled } from "@/lib/membership";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="lmp-container">
        <div className="auth-page">
          {membershipEnabled() ? (
            <SignIn />
          ) : (
            <p className="auth-page__offline">
              MEMBERSHIP SYSTEM OFFLINE. CHECK BACK SOON.
            </p>
          )}
        </div>
      </main>
    </>
  );
}

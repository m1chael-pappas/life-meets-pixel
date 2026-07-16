import { Metadata } from "next";

import { SignUp } from "@clerk/nextjs";

import { SiteHeader } from "@/components/site-header";
import { membershipEnabled } from "@/lib/membership";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="lmp-container">
        <div className="auth-page">
          {membershipEnabled() ? (
            <SignUp />
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

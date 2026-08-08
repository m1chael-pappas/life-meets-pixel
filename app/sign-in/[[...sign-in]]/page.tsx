import { Metadata } from "next";

import { SignIn } from "@clerk/nextjs";

import { SiteHeader } from "@/components/site-header";
import { membershipEnabled } from "@/lib/membership";

/**
 * Auth-bound: every byte of this route depends on who is asking, so there is no
 * meaningful static shell to prerender. `instant = false` tells the Cache
 * Components validator that blocking is the intended design here rather than an
 * oversight — it does not force dynamic rendering, it just stops the route
 * being reported as failing instant navigation.
 */
export const instant = false;


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

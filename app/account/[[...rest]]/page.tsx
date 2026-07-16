import { Metadata } from "next";
import { redirect } from "next/navigation";

import { UserProfile } from "@clerk/nextjs";

import { SiteHeader } from "@/components/site-header";
import { getMembership, membershipEnabled } from "@/lib/membership";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  if (!membershipEnabled()) redirect("/");

  const { userId } = await getMembership();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="lmp-container">
        <div className="auth-page">
          <UserProfile path="/account" />
        </div>
      </main>
    </>
  );
}

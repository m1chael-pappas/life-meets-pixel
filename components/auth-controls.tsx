"use client";

import Link from "next/link";

import { Show, UserButton } from "@clerk/nextjs";

// Loaded lazily from the header (next/dynamic) so Clerk's client bundle
// stays out of First Load JS on every page.
export default function AuthControls({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  return (
    <span className="lmp-nav__auth">
      <Show when="signed-out">
        <Link href="/sign-in" onClick={onNavigate}>
          <span style={{ color: "var(--neon-2)" }} aria-hidden="true">
            ▶
          </span>
          SIGN IN
        </Link>
      </Show>
      <Show when="signed-in">
        <UserButton userProfileUrl="/account" />
      </Show>
    </span>
  );
}

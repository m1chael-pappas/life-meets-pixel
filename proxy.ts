import { NextResponse } from "next/server";

import { clerkMiddleware } from "@clerk/nextjs/server";

// Renamed from middleware.ts in the Next 16 upgrade. The `middleware`
// convention is deprecated in favour of `proxy`, which makes the network
// boundary explicit — and which runs on the Node.js runtime, not edge. That is
// the one behavioural change here: Clerk's context attachment now happens in a
// Node function. Clerk supports this, and Vercel no longer recommends edge.
//
// Clerk only attaches auth context here — nothing is blocked at the boundary.
// Route protection lives with the routes themselves (lib/membership.ts).
// Without Clerk keys this is a no-op so the site runs unchanged.
const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export const proxy = clerkEnabled ? clerkMiddleware() : () => NextResponse.next();

export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and any path with a file extension
    "/((?!_next|.*\\..*).*)",
    // Always run for API routes
    "/api/(.*)",
  ],
};

import { NextResponse } from "next/server";

import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk only attaches auth context here — nothing is blocked at the edge.
// Route protection lives with the routes themselves (lib/membership.ts).
// Without Clerk keys the middleware is a no-op so the site runs unchanged.
const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export default clerkEnabled ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

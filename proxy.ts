import { NextResponse, type NextRequest } from "next/server";

import { clerkMiddleware } from "@clerk/nextjs/server";

import { isPageOutOfRange } from "@/lib/page-bounds";

// Renamed from middleware.ts in the Next 16 upgrade. The `middleware`
// convention is deprecated in favour of `proxy`, which makes the network
// boundary explicit — and which runs on the Node.js runtime, not edge.
//
// Clerk only attaches auth context here — nothing is blocked at the boundary.
// Route protection lives with the routes themselves (lib/membership.ts).
// Without Clerk keys that half is a no-op so the site runs unchanged.
const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

const withClerk = clerkEnabled ? clerkMiddleware() : null;

/**
 * Out-of-range pagination has to be rejected HERE, before the response starts.
 *
 * Under Cache Components the root layout's static shell flushes a 200 before
 * any page code runs, so the listings' `notFound()` renders the 404 markup
 * under a 200 status. `connection()`, `instant = false` and moving the guard
 * into `generateMetadata` were each tried and each still returned 200.
 *
 * A redirect rather than a 404: `?page=99` is a crawler or a stale link, and
 * sending it to the real first page consolidates the signal instead of
 * spending it on an error. 308 keeps it permanent and preserves the method.
 */
async function guardPagination(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const section =
    pathname === "/reviews" ? "reviews" : pathname === "/news" ? "news" : null;
  if (!section) return null;

  const page = Number(searchParams.get("page"));
  if (!page || page <= 1) return null; // the overwhelming majority of requests

  const type = searchParams.get("type") ?? undefined;
  if (!(await isPageOutOfRange(section, page, section === "reviews" ? type : undefined))) {
    return null;
  }

  const url = request.nextUrl.clone();
  url.searchParams.delete("page");
  return NextResponse.redirect(url, 308);
}

export async function proxy(
  request: NextRequest,
  event: Parameters<NonNullable<typeof withClerk>>[1]
) {
  const redirected = await guardPagination(request);
  if (redirected) return redirected;

  return withClerk ? withClerk(request, event) : NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and any path with a file extension
    "/((?!_next|.*\\..*).*)",
    // Always run for API routes
    "/api/(.*)",
  ],
};

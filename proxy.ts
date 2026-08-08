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

/**
 * Scoped deliberately, because this file is the single most expensive thing on
 * the site per request.
 *
 * The old matcher was `/((?!_next|.*\..*).*)` plus `/api/(.*)` — every HTML
 * page. Measured over 24h that was **118 middleware invocations against 6 page
 * function invocations**: everything else was a CDN hit, so the proxy was
 * running on requests that otherwise cost nothing. That mattered more after the
 * Next 16 upgrade, because `proxy` has no edge runtime — it runs on Node, so
 * each invocation is Fluid CPU rather than a cheap edge call.
 *
 * Clerk does not need to run on content pages. Every consumer of auth on a
 * public page is a CLIENT hook (`useAuth`/`useUser` in the ad slot and comment
 * UI) reading session state through `ClerkProvider` in the root layout, which
 * works without any middleware. The site header touches Clerk not at all.
 * Server-side Clerk exists in exactly three places: `lib/membership.ts` (only
 * `/account` calls it), `app/api/comments/route.ts`, and `lib/rss.ts`.
 *
 * So the list below is: the routes that read auth on the server, Clerk's own
 * endpoints, and the two listings — those last two are NOT about auth, they are
 * where `guardPagination` has to run. Removing them silently breaks the
 * out-of-range 308 and nothing else would fail loudly.
 *
 * `/api/clerk` is intentionally absent: it authenticates with a Svix signature
 * via `verifyWebhook()` and never reads a session.
 */
export const config = {
  matcher: [
    // Pagination bounds — not auth. See guardPagination above.
    "/reviews",
    "/news",
    // Server-side auth.
    "/account/:path*",
    "/api/comments/:path*",
    "/feed/:path*",
    // Clerk-rendered UI and billing.
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/membership",
    // Clerk's own frontend-API proxy endpoints.
    "/__clerk/:path*",
  ],
};

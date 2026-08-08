/* eslint-disable no-console */
import { revalidatePath, revalidateTag } from 'next/cache';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { PUBLISH_TAGS, TAGS } from '@/lib/cache-tags';

// Secret token to secure the webhook
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

/**
 * The machine-readable surfaces. Neither is reachable from a nav link, so both
 * were invisible to this webhook and drifted on their own timers instead —
 * /sitemap.xml had no timer at all and was frozen at whatever the last deploy
 * built, meaning a newly published review stayed out of the sitemap until the
 * next deploy. Any mutation that changes the set of published URLs has to
 * revalidate these two as well as the human pages.
 */
const FEEDS = ["/sitemap.xml", "/feed.xml"] as const;
const revalidateFeeds = () => FEEDS.forEach((p) => revalidatePath(p));

/**
 * Both mechanisms fire, on purpose, because the site currently runs both
 * caching models side by side:
 *
 *  - `use cache` functions (hero pool, sitemap, feed, date helpers) are tagged
 *    with `cacheTag` and can only be expired by `revalidateTag`.
 *  - Everything still reading through `fetchOptions` sits in the fetch Data
 *    Cache, which `revalidatePath` expires.
 *
 * Dropping either one now would silently strand half the site's content. When
 * the last `fetchOptions` call site is converted, the `revalidatePath` calls
 * below can go.
 *
 * `revalidateTag` requires a cache profile as its second argument in Next 16.
 * 'max' gives stale-while-revalidate: readers keep getting the cached page
 * while the refresh happens behind them, which is right for a webhook. The
 * read-your-own-writes alternative, `updateTag`, is Server-Action-only and
 * throws in a route handler.
 */
const expire = (...tags: string[]) => tags.forEach((t) => revalidateTag(t, "max"));

export async function POST(request: NextRequest) {
  // Verify secret token
  const token = request.nextUrl.searchParams.get("secret");

  if (!REVALIDATE_SECRET || token !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Determine what to revalidate based on document type
    const documentType = body._type;
    const slug = body.slug?.current;

    switch (documentType) {
      case "review":
        // Revalidate specific review page
        if (slug) {
          revalidatePath(`/reviews/${slug}`);
        }
        // Also revalidate reviews listing and homepage
        revalidatePath("/reviews");
        revalidatePath("/");
        revalidateFeeds();
        expire(TAGS.reviews, TAGS.feeds);
        break;

      case "newsPost":
        // Revalidate specific news post
        if (slug) {
          revalidatePath(`/news/${slug}`);
        }
        // Also revalidate news listing and homepage
        revalidatePath("/news");
        revalidatePath("/");
        revalidateFeeds();
        expire(TAGS.news, TAGS.feeds);
        break;

      case "author":
        // Revalidate specific author page
        if (slug) {
          revalidatePath(`/author/${slug}`);
        }
        // Revalidate all pages that show author info
        revalidatePath("/reviews", "page");
        revalidatePath("/news", "page");
        revalidatePath("/");
        revalidateFeeds();
        expire(...PUBLISH_TAGS);
        break;

      case "reviewableItem":
      case "category":
      case "tag":
      case "genre":
      case "platform":
        // These affect reviews, so revalidate reviews and homepage
        revalidatePath("/reviews", "page");
        revalidatePath("/");
        revalidateFeeds();
        expire(TAGS.reviews, TAGS.feeds);
        break;

      case "siteStats":
        // Revalidate homepage (shows stats)
        revalidatePath("/");
        expire(TAGS.reviews);
        break;

      default:
        // For any other document type, revalidate homepage
        revalidatePath("/");
        expire(...PUBLISH_TAGS);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: `Revalidated ${documentType}${slug ? ` (${slug})` : ""}`,
    });
  } catch (err) {
    console.error("Error revalidating:", err);
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint for manual testing
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("secret");
  const path = request.nextUrl.searchParams.get("path") || "/";

  if (!REVALIDATE_SECRET || token !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    revalidatePath(path);
    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 }
    );
  }
}

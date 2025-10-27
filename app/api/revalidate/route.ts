/* eslint-disable no-console */
import { revalidatePath } from 'next/cache';
import {
  NextRequest,
  NextResponse,
} from 'next/server';

// Secret token to secure the webhook
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

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
        break;

      case "newsPost":
        // Revalidate specific news post
        if (slug) {
          revalidatePath(`/news/${slug}`);
        }
        // Also revalidate news listing and homepage
        revalidatePath("/news");
        revalidatePath("/");
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
        break;

      case "reviewableItem":
      case "category":
      case "tag":
      case "genre":
      case "platform":
        // These affect reviews, so revalidate reviews and homepage
        revalidatePath("/reviews", "page");
        revalidatePath("/");
        break;

      case "siteStats":
        // Revalidate homepage (shows stats)
        revalidatePath("/");
        break;

      default:
        // For any other document type, revalidate homepage
        revalidatePath("/");
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

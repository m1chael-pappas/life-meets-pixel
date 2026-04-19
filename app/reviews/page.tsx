import { Suspense } from "react";

import { Metadata } from "next";

import { ReviewCard } from "@/components/retro/review-card";
import ReviewTypeTabs from "@/components/review-type-tabs";
import { SiteHeader } from "@/components/site-header";
import Pagination from "@/components/ui/pagination";
import { CAT_TYPE_LABEL, ITEM_TYPES } from "@/lib/mappings";
import {
  fetchOptions,
  REVIEW_COUNTS_BY_TYPE_QUERY,
  REVIEWS_BY_TYPE_PAGINATED_QUERY,
  REVIEWS_COUNT_BY_TYPE_QUERY,
  REVIEWS_COUNT_QUERY,
  REVIEWS_PAGINATED_QUERY,
} from "@/lib/queries";
import type { Review, ReviewableItem } from "@/lib/types";
import { client } from "@/sanity/client";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface ReviewsPageProps {
  searchParams: SearchParams;
}

export async function generateMetadata({
  searchParams,
}: ReviewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const type = params.type as string | undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

  const typeMetadata: Record<string, { title: string; description: string }> = {
    videogame: { title: "Video Game Reviews", description: "Honest reviews of the latest and greatest video games." },
    movie: { title: "Movie Reviews", description: "In-depth movie reviews covering latest releases and classic films." },
    anime: { title: "Anime Reviews", description: "Reviews of anime series and films from seasoned fans." },
    book: { title: "Book Reviews", description: "In-depth reviews of books spanning fiction, non-fiction, and more." },
    comic: { title: "Comic & Manga Reviews", description: "Reviews of comics, graphic novels, and manga." },
    boardgame: { title: "Board Game Reviews", description: "Detailed reviews of board games and tabletop experiences." },
    tvseries: { title: "TV Series Reviews", description: "Reviews of TV shows and streaming series worth your time." },
    gadget: { title: "Tech & Gadget Reviews", description: "Reviews of the latest tech gadgets and gaming peripherals." },
  };

  const meta = type && typeMetadata[type] ? typeMetadata[type] : {
    title: "All Reviews",
    description: "Browse all our reviews of games, movies, books, anime, and more.",
  };
  const canonicalPath = type ? `/reviews?type=${type}` : "/reviews";
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${meta.title} | Life Meets Pixel`,
      description: meta.description,
      url: canonicalUrl,
      type: "website",
    },
  };
}

const ITEMS_PER_PAGE = 12;

type CountsShape = Record<ReviewableItem["itemType"] | "all", number>;

async function ReviewsList({ type, page }: { type?: ReviewableItem["itemType"]; page: number }) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const [reviews, totalCount] = type
    ? await Promise.all([
        client.fetch<Review[]>(REVIEWS_BY_TYPE_PAGINATED_QUERY, { itemType: type, start, end }, fetchOptions),
        client.fetch<number>(REVIEWS_COUNT_BY_TYPE_QUERY, { itemType: type }, fetchOptions),
      ])
    : await Promise.all([
        client.fetch<Review[]>(REVIEWS_PAGINATED_QUERY, { start, end }, fetchOptions),
        client.fetch<number>(REVIEWS_COUNT_QUERY, {}, fetchOptions),
      ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (reviews.length === 0) {
    return (
      <div
        className="stat-block"
        style={{ textAlign: "center", padding: 48 }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
        <h3 style={{ color: "var(--neon-1)", marginBottom: 8 }}>NO REVIEWS FOUND</h3>
        <p style={{ color: "var(--ink-dim)", fontSize: 13 }}>
          {type ? `No ${CAT_TYPE_LABEL[type]?.toLowerCase() ?? type} reviews yet. ` : "No reviews yet. "}
          Check back soon.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="reviews-grid">
        {reviews.map((review, i) => (
          <ReviewCard key={review._id} review={review} priority={i < 3} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </>
  );
}

function ReviewsListSkeleton() {
  return (
    <div className="reviews-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ height: 420, background: "var(--bg-1)", border: "3px solid var(--bg-3)" }} />
      ))}
    </div>
  );
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const params = await searchParams;
  const typeParam = params.type as string | undefined;
  const type = (ITEM_TYPES as string[]).includes(typeParam ?? "")
    ? (typeParam as ReviewableItem["itemType"])
    : undefined;
  const currentPage = Math.max(1, Number(params.page) || 1);

  const counts = await client.fetch<CountsShape>(
    REVIEW_COUNTS_BY_TYPE_QUERY,
    {},
    fetchOptions,
  );

  const pageTitle = type ? `${CAT_TYPE_LABEL[type]} Reviews` : "All Reviews";
  const entryCount = type ? (counts[type] ?? 0) : (counts.all ?? 0);

  return (
    <>
      <SiteHeader currentPage="reviews" />
      <main className="lmp-container" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="section-head">
          <div className="section-head__title">
            <span className="num">DB</span>
            <h1>{pageTitle.toUpperCase()}</h1>
          </div>
          <span style={{ fontFamily: "var(--font-press-start-2p)", fontSize: 10, color: "var(--ink-mute)" }}>
            {entryCount} {entryCount === 1 ? "ENTRY" : "ENTRIES"}
          </span>
        </div>

        <ReviewTypeTabs currentType={type} counts={counts} />

        <Suspense fallback={<ReviewsListSkeleton />}>
          <ReviewsList type={type} page={currentPage} />
        </Suspense>
      </main>
    </>
  );
}

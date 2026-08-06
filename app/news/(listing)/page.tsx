import { Suspense } from "react";

import { Metadata } from "next";

import NewsCategoryTabs, { type NewsCategoryCount } from "@/components/news-category-tabs";
import { NewsCard } from "@/components/retro/news-card";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/site-header";
import Pagination from "@/components/ui/pagination";
import { breadcrumbSchema, collectionPageSchema, graph } from "@/lib/schema";
import {
  fetchOptions,
  NEWS_BY_CATEGORY_PAGINATED_QUERY,
  NEWS_CATEGORY_COUNTS_QUERY,
  NEWS_COUNT_BY_CATEGORY_QUERY,
  NEWS_COUNT_QUERY,
  NEWS_PAGINATED_QUERY,
} from "@/lib/queries";
import type { NewsPost } from "@/lib/types";
import { client } from "@/sanity/client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface NewsPageProps {
  searchParams: SearchParams;
}

type CountsShape = { all: number; categories: NewsCategoryCount[] };

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : undefined;

  const counts = await client
    .fetch<CountsShape>(NEWS_CATEGORY_COUNTS_QUERY, {}, fetchOptions)
    .catch(() => null);
  const match = counts?.categories.find((c) => c.slug === category);

  const title = match ? `${match.title} News` : "Gaming News & Previews";
  const description = match
    ? `The latest ${match.title.toLowerCase()} news and previews from Life Meets Pixel.`
    : "Stay up to date with the latest gaming news, previews, and geek culture updates.";
  const canonicalUrl = match ? `${siteUrl}/news?category=${match.slug}` : `${siteUrl}/news`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      // Next.js REPLACES a parent openGraph object rather than merging it,
      // so the locale has to be restated on every page that defines its own.
      locale: "en_AU",
      title: `${title} | Life Meets Pixel`,
      description,
      url: canonicalUrl,
      type: "website",
    },
  };
}

const ITEMS_PER_PAGE = 12;

async function NewsList({ category, page }: { category?: string; page: number }) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const [news, totalCount] = category
    ? await Promise.all([
        client.fetch<NewsPost[]>(
          NEWS_BY_CATEGORY_PAGINATED_QUERY,
          { category, start, end },
          fetchOptions,
        ),
        client.fetch<number>(NEWS_COUNT_BY_CATEGORY_QUERY, { category }, fetchOptions),
      ])
    : await Promise.all([
        client.fetch<NewsPost[]>(NEWS_PAGINATED_QUERY, { start, end }, fetchOptions),
        client.fetch<number>(NEWS_COUNT_QUERY, {}, fetchOptions),
      ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (news.length === 0) {
    return (
      <div className="stat-block" style={{ textAlign: "center", padding: 48 }}>
        <h3 style={{ color: "var(--neon-1)", marginBottom: 8 }}>NO NEWS FOUND</h3>
        <p style={{ color: "var(--ink-dim)", fontSize: 13 }}>
          Nothing filed under this category yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="news-grid news-grid--listing">
        {news.map((post, i) => (
          <NewsCard key={post._id} post={post} priority={i < 3} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </>
  );
}

function NewsListSkeleton() {
  return (
    <div className="news-grid news-grid--listing">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{ height: 380, background: "var(--bg-1)", border: "3px solid var(--bg-3)" }}
        />
      ))}
    </div>
  );
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);

  const counts = await client.fetch<CountsShape>(NEWS_CATEGORY_COUNTS_QUERY, {}, fetchOptions);

  const requested = typeof params.category === "string" ? params.category : undefined;
  // Ignore an unknown ?category= rather than rendering an empty page for it.
  const category = counts.categories.some((c) => c.slug === requested) ? requested : undefined;
  const active = counts.categories.find((c) => c.slug === category);

  const pageTitle = active ? `${active.title} News` : "News & Previews";
  const entryCount = active ? active.count : counts.all;

  return (
    <>
      <SiteHeader currentPage="news" />
      <JsonLd
        data={graph(
          collectionPageSchema({
            name: pageTitle,
            path: category ? `/news?category=${category}` : "/news",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "News", path: "/news" },
            ...(active ? [{ name: active.title, path: `/news?category=${active.slug}` }] : []),
          ]),
        )}
      />
      <main id="main-content" className="lmp-container" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="section-head">
          <div className="section-head__title">
            <span className="num">RSS</span>
            <h1>{pageTitle.toUpperCase()}</h1>
          </div>
          <span
            style={{
              fontFamily: "var(--font-press-start-2p)",
              fontSize: 10,
              color: "var(--ink-mute)",
            }}
          >
            {entryCount} {entryCount === 1 ? "ENTRY" : "ENTRIES"}
          </span>
        </div>

        <NewsCategoryTabs
          currentCategory={category}
          all={counts.all}
          categories={counts.categories}
        />

        {/* The page previously went h1 -> h3 with no h2 anywhere, a skipped
            level. Matches the /reviews listing, which uses the same device. */}
        <h2 className="sr-only">Results</h2>
        <Suspense fallback={<NewsListSkeleton />}>
          <NewsList category={category} page={currentPage} />
        </Suspense>
      </main>
    </>
  );
}

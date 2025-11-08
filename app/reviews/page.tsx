import { Suspense } from 'react';
import { type SanityDocument } from 'next-sanity';
import { Metadata } from 'next';

import UniversalReviewCard from '@/components/universal-review-card';
import { SiteHeader } from '@/components/site-header';
import { client } from '@/sanity/client';
import { REVIEWS_QUERY, REVIEWS_BY_TYPE_QUERY, fetchOptions } from '@/lib/queries';
import ReviewTypeTabs from '@/components/review-type-tabs';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface ReviewsPageProps {
  searchParams: SearchParams;
}

// Generate metadata based on filter
export async function generateMetadata({ searchParams }: ReviewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const type = params.type as string | undefined;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lifemeetspixel.com';

  const typeMetadata: Record<string, { title: string; description: string }> = {
    videogame: {
      title: 'Video Game Reviews',
      description: 'Honest reviews of the latest and greatest video games across all platforms.',
    },
    movie: {
      title: 'Movie Reviews',
      description: 'In-depth movie reviews covering the latest releases and classic films.',
    },
    anime: {
      title: 'Anime Reviews',
      description: 'Reviews of anime series and films from seasoned fans.',
    },
    book: {
      title: 'Book Reviews',
      description: 'In-depth reviews of books spanning fiction, non-fiction, and more.',
    },
    comic: {
      title: 'Comic & Manga Reviews',
      description: 'Reviews of comics, graphic novels, and manga for enthusiasts.',
    },
    boardgame: {
      title: 'Board Game Reviews',
      description: 'Detailed reviews of board games, card games, and tabletop experiences.',
    },
    tvseries: {
      title: 'TV Series Reviews',
      description: 'Reviews of TV shows and streaming series worth your time.',
    },
    gadget: {
      title: 'Tech & Gadget Reviews',
      description: 'Reviews of the latest tech gadgets and gaming peripherals.',
    },
  };

  const meta = type && typeMetadata[type]
    ? typeMetadata[type]
    : {
        title: 'All Reviews',
        description: 'Browse all our reviews of games, movies, books, anime, and more.',
      };

  const canonicalPath = type ? `/reviews?type=${type}` : '/reviews';
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${meta.title} | Life Meets Pixel`,
      description: meta.description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

async function ReviewsList({ type }: { type?: string }) {
  const reviews = type
    ? await client.fetch<SanityDocument[]>(REVIEWS_BY_TYPE_QUERY, { itemType: type }, fetchOptions)
    : await client.fetch<SanityDocument[]>(REVIEWS_QUERY, {}, fetchOptions);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-bold text-muted-foreground mb-2 font-mono">
          No reviews found
        </h3>
        <p className="text-muted-foreground">
          {type ? `No ${type} reviews available yet. ` : 'No reviews available yet. '}
          Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {reviews.map((review, index) => (
        <UniversalReviewCard
          key={review._id}
          review={review}
          priority={index < 4}
        />
      ))}
    </div>
  );
}

function ReviewsListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-96 bg-muted/20 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const params = await searchParams;
  const type = params.type as string | undefined;

  const typeLabels: Record<string, string> = {
    videogame: 'Video Games',
    movie: 'Movies',
    anime: 'Anime',
    book: 'Books',
    comic: 'Comics/Manga',
    boardgame: 'Board Games',
    tvseries: 'TV Series',
    gadget: 'Tech & Gadgets',
  };

  const pageTitle = type && typeLabels[type]
    ? `${typeLabels[type]} Reviews`
    : 'All Reviews';

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader currentPage="reviews" />

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-mono">
            {pageTitle}
          </h1>
          <p className="text-muted-foreground">
            Browse our collection of honest, in-depth reviews
          </p>
        </div>

        {/* Filter Tabs */}
        <ReviewTypeTabs currentType={type} />

        {/* Reviews Grid */}
        <Suspense fallback={<ReviewsListSkeleton />}>
          <ReviewsList type={type} />
        </Suspense>
      </main>
    </div>
  );
}

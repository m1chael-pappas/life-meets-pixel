import { type SanityDocument } from 'next-sanity';

import UniversalReviewCard from '@/components/universal-review-card';
import {
  FEATURED_REVIEWS_QUERY,
  fetchOptions,
} from '@/lib/queries';
import { client } from '@/sanity/client';

export default async function FeaturedSection() {
  const featuredReviews = await client.fetch<SanityDocument[]>(
    FEATURED_REVIEWS_QUERY,
    {},
    fetchOptions
  );

  if (featuredReviews.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-bold text-foreground font-mono">
          FEATURED REVIEWS
        </h3>
        <div className="h-px bg-primary/30 flex-1"></div>
        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded font-mono">
          EDITOR&apos;S CHOICE
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredReviews.map((review, index) => (
          <UniversalReviewCard
            key={review._id}
            review={review}
            priority={index < 3}
          />
        ))}
      </div>
    </section>
  );
}

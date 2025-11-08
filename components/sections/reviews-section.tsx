import { type SanityDocument } from 'next-sanity';
import Link from 'next/link';

import AnimatedCardWrapper from '@/components/animated-card-wrapper';
import { Button } from '@/components/ui/button';
import UniversalReviewCard from '@/components/universal-review-card';
import {
  fetchOptions,
  REVIEWS_QUERY,
} from '@/lib/queries';
import { client } from '@/sanity/client';

export default async function ReviewsSection() {
  const reviews = await client.fetch<SanityDocument[]>(
    REVIEWS_QUERY,
    {},
    fetchOptions
  );

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-bold text-foreground font-mono">
          LATEST REVIEWS
        </h3>
        <div className="h-px bg-primary/30 flex-1"></div>
      </div>

      {reviews.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {reviews.map((review, index) => (
              <AnimatedCardWrapper key={review._id} index={index}>
                <UniversalReviewCard
                  review={review}
                  priority={index < 4} // Prioritize first row
                />
              </AnimatedCardWrapper>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/reviews">
              <Button variant="outline" className="font-mono">
                SEE ALL REVIEWS →
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-muted-foreground mb-2 font-mono">
            No reviews yet
          </h3>
          <p className="text-muted-foreground">
            Check back soon for the latest reviews!
          </p>
        </div>
      )}
    </section>
  );
}

import { type SanityDocument } from 'next-sanity';

import GameReviewCard from '@/components/ui/game-review-card';
import {
  fetchOptions,
  GAME_REVIEWS_QUERY,
} from '@/lib/queries';
import { client } from '@/sanity/client';

export default async function ReviewsSection() {
  const gameReviews = await client.fetch<SanityDocument[]>(
    GAME_REVIEWS_QUERY,
    {},
    fetchOptions
  );

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-bold text-foreground font-mono">
          ALL REVIEWS
        </h3>
        <div className="h-px bg-primary/30 flex-1"></div>
      </div>

      {gameReviews.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gameReviews.map((review, index) => (
            <GameReviewCard
              key={review._id}
              review={review}
              priority={index < 4} // Prioritize first row
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-2xl font-bold text-muted-foreground mb-2 font-mono">
            No reviews yet
          </h3>
          <p className="text-muted-foreground">
            Check back soon for the latest game reviews!
          </p>
        </div>
      )}
    </section>
  );
}

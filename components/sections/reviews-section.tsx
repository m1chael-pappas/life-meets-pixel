import Link from "next/link";

import { ReviewCard } from "@/components/retro/review-card";
import { getHeroIds } from "@/lib/hero-pool";
import { REVIEWS_QUERY, fetchOptions } from "@/lib/queries";
import type { Review } from "@/lib/types";
import { client } from "@/sanity/client";

const GRID_SIZE = 6;

export default async function ReviewsSection() {
  const [reviews, heroIds] = await Promise.all([
    client.fetch<Review[]>(REVIEWS_QUERY, {}, fetchOptions),
    getHeroIds(),
  ]);

  // Actually skip what the hero already showed. The old code carried this same
  // intention as a comment above a `slice(0, 6)` that skipped nothing, so five
  // of these six cards repeated the top of the page. REVIEWS_QUERY already
  // returns 12, which leaves headroom for the hero's 5.
  const fresh = reviews.filter((r) => !heroIds.has(r._id));

  // If the site is young enough that excluding the hero would empty the grid,
  // show the newest reviews rather than nothing — a thin grid still beats a
  // missing section.
  const items = (fresh.length > 0 ? fresh : reviews).slice(0, GRID_SIZE);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="lmp-section">
      <div className="section-head">
        <div className="section-head__title">
          <span className="num">01</span>
          <h2>LATEST REVIEWS</h2>
        </div>
        <Link href="/reviews" className="section-head__action">
          VIEW ALL
        </Link>
      </div>
      <div className="reviews-grid">
        {items.map((r) => (
          <ReviewCard key={r._id} review={r} />
        ))}
      </div>
    </section>
  );
}

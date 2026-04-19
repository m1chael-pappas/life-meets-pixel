import Link from "next/link";

import { ReviewCard } from "@/components/retro/review-card";
import { REVIEWS_QUERY, fetchOptions } from "@/lib/queries";
import type { Review } from "@/lib/types";
import { client } from "@/sanity/client";

export default async function ReviewsSection() {
  const reviews = await client.fetch<Review[]>(REVIEWS_QUERY, {}, fetchOptions);
  // Skip the first few featured shown in the hero / featured section — then cap at 6
  const items = reviews.slice(0, 6);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="lmp-section">
      <div className="section-head">
        <div className="section-head__title">
          <span className="num">03</span>
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

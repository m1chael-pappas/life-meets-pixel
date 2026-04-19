import Link from "next/link";

import { NewsCard } from "@/components/retro/news-card";
import { NEWS_QUERY, fetchOptions } from "@/lib/queries";
import type { NewsPost } from "@/lib/types";
import { client } from "@/sanity/client";

export default async function NewsSection() {
  const posts = await client.fetch<NewsPost[]>(NEWS_QUERY, {}, fetchOptions);
  const items = posts.slice(0, 3);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="lmp-section">
      <div className="section-head">
        <div className="section-head__title">
          <span className="num">02</span>
          <h2>NEWS &amp; PREVIEWS</h2>
        </div>
        <Link href="/news" className="section-head__action">
          VIEW ALL
        </Link>
      </div>
      <div className="news-grid">
        {items.map((p, i) => (
          <NewsCard key={p._id} post={p} lead={i === 0} />
        ))}
      </div>
    </section>
  );
}

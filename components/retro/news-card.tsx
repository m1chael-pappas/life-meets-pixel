import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import type { NewsPost } from "@/lib/types";

export function NewsCard({
  post,
  lead = false,
  priority = false,
}: {
  post: NewsPost;
  lead?: boolean;
  /** Skip lazy-loading for above-the-fold cards on the listing. */
  priority?: boolean;
}) {
  const date = post.publishedAt
    ? format(new Date(post.publishedAt), "M/d/yyyy")
    : "";
  const category = post.categories?.[0];
  return (
    <Link
      href={`/news/${post.slug.current}`}
      className={`news-card ${lead ? "lead" : ""} ${post.breaking ? "is-breaking" : ""}`}
    >
      <div className="news-card__media">
        {post.featuredImage?.asset?.url && (
          <Image
            src={post.featuredImage.asset.url}
            alt={post.featuredImage.alt || post.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {/* Overlays the media so a breaking card stays the same height as its
            grid siblings. Was a red pill reading "🚨 BREAKING NEWS"; the site
            has a sprite set and no other surface uses emoji as an icon. */}
        {post.breaking && <span className="news-card__flag">◆ BREAKING</span>}
      </div>
      <div className="news-card__body">
        <div className="news-card__meta">
          <span className="news-card__date">{date}</span>
          {category && (
            <span
              className="news-card__cat"
              style={category.color ? { color: category.color, borderColor: category.color } : undefined}
            >
              {category.title.toUpperCase()}
            </span>
          )}
        </div>
        <h3 className="news-card__title">{post.title}</h3>
        <p className="news-card__excerpt">{post.excerpt}</p>
        <div className="news-card__author">By {post.author.name}</div>
      </div>
    </Link>
  );
}

import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import type { NewsPost } from "@/lib/types";

export function NewsCard({
  post,
  lead = false,
}: {
  post: NewsPost;
  lead?: boolean;
}) {
  const date = post.publishedAt
    ? format(new Date(post.publishedAt), "M/d/yyyy")
    : "";
  return (
    <Link href={`/news/${post.slug.current}`} className={`news-card ${lead ? "lead" : ""}`}>
      <div className="news-card__media">
        {post.featuredImage?.asset?.url && (
          <Image
            src={post.featuredImage.asset.url}
            alt={post.featuredImage.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="news-card__body">
        <div className="news-card__date">{date}</div>
        <h3 className="news-card__title">{post.title}</h3>
        <p className="news-card__excerpt">{post.excerpt}</p>
        <div className="news-card__author">By {post.author.name}</div>
      </div>
    </Link>
  );
}

import { type SanityDocument } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  fetchOptions,
  NEWS_QUERY,
} from '@/lib/queries';
import { client } from '@/sanity/client';

export default async function NewsSection() {
  const news = await client.fetch<SanityDocument[]>(
    NEWS_QUERY,
    {},
    fetchOptions
  );

  if (news.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-2xl font-bold text-foreground font-mono">
            GAMING NEWS
          </h3>
          <div className="h-px bg-secondary/30 flex-1"></div>
        </div>
        <div className="text-center py-8 bg-muted/20 rounded-lg">
          <div className="text-4xl mb-2">📰</div>
          <p className="text-muted-foreground">No news articles found</p>
          <p className="text-xs text-muted-foreground mt-2">
            Make sure you have published news articles in your CMS
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-bold text-foreground font-mono">
          GAMING NEWS
        </h3>
        <div className="h-px bg-secondary/30 flex-1"></div>
        {/* Show breaking news indicator if any breaking news exists */}
        {news.some((article) => article.breaking) && (
          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-mono">
            BREAKING
          </span>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {news.slice(0, 6).map((article) => (
          <article key={article._id} className="group">
            <Link href={`/news/${article.slug.current}`} className="block">
              <div
                className={`bg-card border overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-lg ${
                  article.breaking ? "border-red-500 border-2" : "border-border"
                }`}
              >
                {/* Breaking News Badge */}
                {article.breaking && (
                  <div className="bg-red-500 text-white text-xs font-mono px-2 py-1">
                    🚨 BREAKING NEWS
                  </div>
                )}

                {article.featuredImage && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={article.featuredImage.asset.url}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <time className="text-xs text-muted-foreground font-mono mb-2 block">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </time>
                  <h4 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  {article.author && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        By {article.author.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      <div className="text-center mt-6">
        <Link href="/news">
          <Button variant="outline" className="font-mono">
            VIEW ALL NEWS →
          </Button>
        </Link>
      </div>
    </section>
  );
}

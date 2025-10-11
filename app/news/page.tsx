import { Suspense } from 'react';
import { type SanityDocument } from 'next-sanity';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

import { ModeToggle } from '@/components/ui/mode-toggle';
import { Badge } from '@/components/ui/badge';
import { client } from '@/sanity/client';
import { NEWS_QUERY, fetchOptions } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Gaming News',
  description: 'Stay up to date with the latest gaming and geek culture news.',
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: 'Gaming News | Life Meets Pixel',
    description: 'Stay up to date with the latest gaming and geek culture news.',
    url: '/news',
    type: 'website',
  },
};

async function NewsList() {
  const news = await client.fetch<SanityDocument[]>(NEWS_QUERY, {}, fetchOptions);

  if (news.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📰</div>
        <h3 className="text-2xl font-bold text-muted-foreground mb-2 font-mono">
          No news yet
        </h3>
        <p className="text-muted-foreground">
          Check back soon for the latest gaming and geek culture news!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((article) => {
        const relativeDate = formatDistanceToNow(new Date(article.publishedAt), {
          addSuffix: true,
        });

        return (
          <article key={article._id} className="group">
            <Link href={`/news/${article.slug.current}`} className="block">
              <div
                className={`bg-card border overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-lg ${
                  article.breaking ? 'ring-2 ring-red-500' : 'border-border'
                }`}
              >
                {/* Breaking News Badge */}
                {article.breaking && (
                  <div className="bg-red-500 text-white text-xs font-mono px-3 py-1 text-center">
                    🚨 BREAKING NEWS
                  </div>
                )}

                {/* Featured Image */}
                {article.featuredImage?.asset?.url ? (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={article.featuredImage.asset.url}
                      alt={article.featuredImage.alt || article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video overflow-hidden bg-muted flex items-center justify-center">
                    <span className="text-6xl opacity-20">📰</span>
                  </div>
                )}

                <div className="p-5">
                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-3">
                    <time className="text-xs text-muted-foreground font-mono">
                      {relativeDate}
                    </time>
                    {article.categories?.[0] && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={
                            article.categories[0].color
                              ? {
                                  backgroundColor: article.categories[0].color,
                                  color: '#ffffff',
                                  border: 'none',
                                }
                              : {}
                          }
                        >
                          {article.categories[0].title}
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Author */}
                  {article.author && (
                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        By {article.author.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}

function NewsListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-96 bg-muted/20 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-3xl font-bold text-primary font-mono">
                LIFE MEETS PIXEL
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-foreground hover:text-primary font-mono text-sm transition-colors"
              >
                🏠 HOME
              </Link>
              <Link
                href="/reviews"
                className="text-foreground hover:text-primary font-mono text-sm transition-colors"
              >
                📝 REVIEWS
              </Link>
              <Link
                href="/news"
                className="text-primary hover:text-primary/80 font-mono text-sm transition-colors"
              >
                📰 NEWS
              </Link>
              <div className="ml-2">
                <ModeToggle />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2 font-mono">
            Gaming & Geek News
          </h2>
          <p className="text-muted-foreground">
            Stay up to date with the latest news from the gaming and geek culture world
          </p>
        </div>

        {/* News Grid */}
        <Suspense fallback={<NewsListSkeleton />}>
          <NewsList />
        </Suspense>
      </main>
    </div>
  );
}

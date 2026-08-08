import { MetadataRoute } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { PUBLISH_TAGS } from '@/lib/cache-tags';
import { HIDDEN_AUTHOR_IDS, INDEXABLE_NEWS_SLUGS_QUERY } from '@/lib/queries';
import { client } from '@/sanity/client';

/**
 * `export const revalidate` is not allowed alongside cacheComponents, so the
 * hour lives on the cached function instead. The substance is unchanged: this
 * route once carried no expiry at all and froze at deploy time, so a review
 * published between deploys never entered the sitemap.
 *
 * Tagged with every publish tag because the sitemap embeds the full URL set —
 * a new review, news post or author all invalidate it.
 */
async function getContent() {
  'use cache';
  cacheLife('hours');
  cacheTag(...PUBLISH_TAGS);
  const [reviews, news, authors] = await Promise.all([
    client.fetch<Array<{ slug: { current: string }; publishedAt: string }>>(
      `*[_type == "review" && defined(slug.current)]{
        "slug": slug,
        publishedAt
      }`,
    ),
    // Only news posts substantial enough to index. The short ones are marked
    // noindex in their own metadata, so listing them here would contradict that.
    client.fetch<Array<{ slug: { current: string }; publishedAt: string }>>(
      INDEXABLE_NEWS_SLUGS_QUERY,
    ),
    client.fetch<Array<{ slug: { current: string }; _updatedAt: string }>>(
      `*[_type == "author" && defined(slug.current) && !(_id in $hidden)]{
        "slug": slug,
        _updatedAt
      }`,
      { hidden: HIDDEN_AUTHOR_IDS }
    ),
  ]);

  return { reviews, news, authors };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Cached at the top level, not just around the queries. The `lastModified:
  // new Date()` stamps below are unstable values, and in a route handler an
  // unstable value does not error — it silently bails out of prerendering, so
  // the route went back to being computed per request. Caching the whole
  // function keeps it prerendered and keeps the stamps stable for the window.
  'use cache';
  cacheLife('hours');
  cacheTag(...PUBLISH_TAGS);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lifemeetspixel.com';
  const { reviews, news, authors } = await getContent();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/membership`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Review pages
  const reviewPages: MetadataRoute.Sitemap = reviews.map((review) => ({
    url: `${baseUrl}/reviews/${review.slug.current}`,
    lastModified: new Date(review.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // News pages
  const newsPages: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${baseUrl}/news/${article.slug.current}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Author pages
  const authorPages: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${baseUrl}/author/${author.slug.current}`,
    lastModified: new Date(author._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...reviewPages, ...newsPages, ...authorPages];
}

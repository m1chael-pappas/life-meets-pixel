import { MetadataRoute } from 'next';
import { client } from '@/sanity/client';

// Fetch all reviews and news for sitemap
async function getContent() {
  const [reviews, news] = await Promise.all([
    client.fetch<Array<{ slug: { current: string }; publishedAt: string }>>(
      `*[_type == "review" && defined(slug.current)]{
        "slug": slug,
        publishedAt
      }`
    ),
    client.fetch<Array<{ slug: { current: string }; publishedAt: string }>>(
      `*[_type == "newsPost" && defined(slug.current)]{
        "slug": slug,
        publishedAt
      }`
    ),
  ]);

  return { reviews, news };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lifemeetspixel.com';
  const { reviews, news } = await getContent();

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

  return [...staticPages, ...reviewPages, ...newsPages];
}

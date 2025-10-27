import { MetadataRoute } from 'next';
import { client } from '@/sanity/client';

// Fetch all reviews, news, and authors for sitemap
async function getContent() {
  const [reviews, news, authors] = await Promise.all([
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
    client.fetch<Array<{ slug: { current: string }; _updatedAt: string }>>(
      `*[_type == "author" && defined(slug.current)]{
        "slug": slug,
        _updatedAt
      }`
    ),
  ]);

  return { reviews, news, authors };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

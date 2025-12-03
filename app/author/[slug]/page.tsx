import { Suspense } from 'react';

import { Metadata } from 'next';
import { type SanityDocument } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiDiscord } from 'react-icons/si';

import { SiteHeader } from '@/components/site-header';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import UniversalReviewCard from '@/components/universal-review-card';
import { SITE_CONFIG } from '@/lib/constants';
import { fetchOptions } from '@/lib/queries';
import { client } from '@/sanity/client';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

  const author = await client.fetch<SanityDocument>(
    `*[_type == "author" && slug.current == $slug][0]{
      name,
      bio
    }`,
    { slug },
    fetchOptions
  );

  if (!author) {
    return {
      title: "Author Not Found",
    };
  }

  const canonicalUrl = `${siteUrl}/author/${slug}`;

  return {
    title: `${author.name} - Author`,
    description:
      author.bio || `Meet ${author.name}, a writer at Life Meets Pixel.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${author.name} - Author | Life Meets Pixel`,
      description:
        author.bio || `Meet ${author.name}, a writer at Life Meets Pixel.`,
      url: canonicalUrl,
      type: "profile",
    },
  };
}

const getAuthorInitials = (name: string) => {
  const words = name.split(" ");
  const initials = words.reduce((acc, word) => acc + (word[0] || ""), "");
  return initials.toUpperCase().slice(0, 2);
};

async function AuthorContent({ slug }: { slug: string }) {
  // Fetch author profile by slug
  const author = await client.fetch<SanityDocument>(
    `*[_type == "author" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      bio,
      email,
      avatar{
        asset->{
          url
        },
        alt
      },
      socialLinks
    }`,
    { slug },
    fetchOptions
  );

  if (!author) {
    notFound();
  }

  // Fetch author's reviews
  const reviews = await client.fetch<SanityDocument[]>(
    `*[_type == "review" && author._ref == $authorId] | order(publishedAt desc)[0...6]{
      _id,
      title,
      slug,
      reviewScore,
      summary,
      publishedAt,
      featured,
      reviewableItem->{
        title,
        slug,
        itemType,
        coverImage{
          asset->{
            url
          },
          alt
        },
        creator,
        publisher,
        releaseDate
      },
      author->{
        name,
        slug,
        avatar{
          asset->{
            url
          },
          alt
        }
      },
      categories[]->{
        title,
        slug,
        color
      }
    }`,
    { authorId: author._id },
    fetchOptions
  );

  // Fetch author's news posts
  const newsPosts = await client.fetch<SanityDocument[]>(
    `*[_type == "newsPost" && author._ref == $authorId] | order(publishedAt desc)[0...6]{
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      breaking,
      featuredImage{
        asset->{
          url
        },
        alt
      },
      categories[]->{
        title,
        slug,
        color
      }
    }`,
    { authorId: author._id },
    fetchOptions
  );

  const reviewCount = await client.fetch<number>(
    `count(*[_type == "review" && author._ref == $authorId])`,
    { authorId: author._id },
    fetchOptions
  );

  const newsCount = await client.fetch<number>(
    `count(*[_type == "newsPost" && author._ref == $authorId])`,
    { authorId: author._id },
    fetchOptions
  );

  return (
    <div className="space-y-12">
      {/* Author Hero Section */}
      <Card className="border-2">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            {author?.name && (
              <Avatar className="w-32 h-32">
                {author.avatar?.asset?.url ? (
                  <AvatarImage
                    src={author.avatar?.asset.url}
                    alt={author.name}
                  />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-mono">
                  {getAuthorInitials(author.name)}
                </AvatarFallback>
              </Avatar>
            )}

            {/* Author Info */}
            <div className="flex-1">
              {author?.name && (
                <h1 className="text-4xl font-bold text-foreground mb-4 font-mono">
                  {author.name}
                </h1>
              )}

              {author?.bio && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {author.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold text-primary font-mono">
                    {reviewCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Reviews</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary font-mono">
                    {newsCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    News Posts
                  </div>
                </div>
              </div>

              {/* Contact & Links */}
              {(author?.email || author?.socialLinks) && (
                <div className="flex flex-wrap gap-4">
                  {author.email && (
                    <a
                      href={`mailto:${author.email}`}
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-mono"
                    >
                      📧 {author.email}
                    </a>
                  )}
                  {author.socialLinks?.x && (
                    <a
                      href={author.socialLinks.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-mono"
                    >
                      𝕏 X
                    </a>
                  )}
                  {author.socialLinks?.github && (
                    <a
                      href={author.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-mono"
                    >
                      💻 GitHub
                    </a>
                  )}
                  {author.socialLinks?.etsy && (
                    <a
                      href={author.socialLinks.etsy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-mono"
                    >
                      🛍️ Etsy
                    </a>
                  )}
                  {author.socialLinks?.twitch && (
                    <a
                      href={author.socialLinks.twitch}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-mono"
                    >
                      🎮 Twitch
                    </a>
                  )}
                  {author.socialLinks?.youtube && (
                    <a
                      href={author.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-mono"
                    >
                      📺 YouTube
                    </a>
                  )}
                  {author.socialLinks?.instagram && (
                    <a
                      href={author.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-mono"
                    >
                      📸 Instagram
                    </a>
                  )}
                  {author.socialLinks?.linkedin && (
                    <a
                      href={author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-mono"
                    >
                      💼 LinkedIn
                    </a>
                  )}
                  {author.socialLinks?.website && (
                    <a
                      href={author.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-mono"
                    >
                      🌐 Website
                    </a>
                  )}
                  {author.socialLinks?.discord && (
                    <a
                      href={SITE_CONFIG.social.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 transition-colors font-mono inline-flex items-center gap-1"
                    >
                      <SiDiscord className="h-4 w-4" /> Discord
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <section>
        <div className="bg-muted/20 rounded-lg p-6 text-center border border-border">
          <h3 className="text-lg font-bold text-foreground mb-2 font-mono">
            SUPPORT LIFE MEETS PIXEL
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enjoying our reviews? Help us keep the pixels flowing with coffee ☕
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://ko-fi.com/lifemeetspixel"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-mono hover:bg-primary/90 transition-colors"
            >
              ☕ Buy us a Coffee
            </a>
            <a
              href="https://patreon.com/lifemeetspixel"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-mono hover:bg-secondary/90 transition-colors"
            >
              💖 Become a Patron
            </a>
          </div>
        </div>
      </section>

      {/* Latest Reviews */}
      {reviews.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground font-mono">
              Latest Reviews
            </h2>
            {reviewCount > 6 && (
              <Link
                href="/reviews"
                className="text-sm text-primary hover:text-primary/80 font-mono"
              >
                View all →
              </Link>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <UniversalReviewCard
                key={review._id}
                review={review}
                priority={index < 3}
              />
            ))}
          </div>
        </section>
      )}

      {/* Latest News */}
      {newsPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground font-mono">
              Latest News
            </h2>
            {newsCount > 6 && (
              <Link
                href="/news"
                className="text-sm text-primary hover:text-primary/80 font-mono"
              >
                View all →
              </Link>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsPosts.map((article) => (
              <article key={article._id} className="group">
                <Link href={`/news/${article.slug.current}`} className="block">
                  <div className="bg-card border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-lg">
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
                      <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AuthorSkeleton() {
  return (
    <div className="space-y-12">
      <div className="h-64 bg-muted/20 rounded-lg animate-pulse" />
      <div className="h-96 bg-muted/20 rounded-lg animate-pulse" />
    </div>
  );
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="min-h-screen">
      <SiteHeader currentPage="author" />

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl p-6 py-12">
        <Suspense fallback={<AuthorSkeleton />}>
          <AuthorContent slug={slug} />
        </Suspense>
      </main>
    </div>
  );
}

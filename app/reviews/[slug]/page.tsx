import { formatDistanceToNow } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  ThumbsDown,
  ThumbsUp,
  User,
} from 'lucide-react';
import { Metadata } from 'next';
import {
  PortableText,
  type PortableTextComponents,
  type SanityDocument,
} from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';

import PixelHeartRating from '@/components/pixel-heart-rating';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Updated query for game reviews with all related data
const GAME_REVIEW_QUERY = `*[_type == "gameReview" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  reviewScore,
  summary,
  content,
  pros,
  cons,
  publishedAt,
  featured,
  game->{
    title,
    slug,
    developer,
    publisher,
    releaseDate,
    platforms[]->{
      title,
      slug
    },
    genres[]->{
      title,
      slug
    },
    esrbRating,
    coverImage{
      asset->{
        url
      },
      alt
    },
    officialWebsite
  },
  author->{
    name,
    slug,
    bio,
    avatar{
      asset->{
        url
      },
      alt
    },
    socialLinks
  },
  categories[]->{
    title,
    slug,
    color
  },
  tags[]->{
    title,
    slug
  },
  seo{
    metaTitle,
    metaDescription,
    keywords
  }
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const review = await client.fetch<SanityDocument>(
    GAME_REVIEW_QUERY,
    await params,
    options
  );

  if (!review) {
    return {
      title: "Review Not Found",
      description: "The requested game review could not be found.",
    };
  }

  const gameImageUrl = review.game?.coverImage
    ? urlFor(review.game.coverImage)?.width(1200).height(630).url()
    : null;

  // Use SEO data from CMS if available, otherwise fall back to review data
  const seoTitle =
    review.seo?.metaTitle || `${review.title} | ${review.game?.title} Review`;
  const seoDescription =
    review.seo?.metaDescription ||
    review.summary ||
    `Read our review of ${review.game?.title}. Score: ${review.reviewScore}/10`;
  const seoKeywords = review.seo?.keywords || [
    review.game?.title,
    "game review",
    "gaming",
    ...(review.categories?.map((cat: any) => cat.title) || []),
  ];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    authors: [{ name: review.author?.name || "Life Meets Pixel" }],
    alternates: {
      canonical: `/reviews/${review.slug.current}`,
    },
    openGraph: {
      type: "article",
      title: seoTitle,
      description: seoDescription,
      url: `/reviews/${review.slug.current}`,
      siteName: "Life Meets Pixel",
      publishedTime: review.publishedAt,
      authors: [review.author?.name || "Life Meets Pixel"],
      images: gameImageUrl
        ? [
            {
              url: gameImageUrl,
              width: 1200,
              height: 630,
              alt:
                review.game?.coverImage?.alt || `${review.game?.title} cover`,
            },
          ]
        : [],
      tags: review.categories?.map((cat: any) => cat.title) || [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: gameImageUrl ? [gameImageUrl] : [],
      creator: review.author?.socialLinks?.twitter || "@lifemeetspixel",
    },
    other: {
      "article:author": review.author?.name || "Life Meets Pixel",
      "article:published_time": review.publishedAt,
      "article:section": "Gaming",
      "article:tag":
        review.categories?.map((cat: any) => cat.title).join(", ") || "Gaming",
    },
  };
}

// Custom Portable Text components
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = urlFor(value)?.width(800).height(450).url();
      return imageUrl ? (
        <div className="my-8">
          <Image
            src={imageUrl}
            alt={value.caption || "Review image"}
            width={800}
            height={450}
            className="rounded-lg shadow-md"
          />
          {value.caption && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              {value.caption}
            </p>
          )}
        </div>
      ) : null;
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-foreground mb-6 font-mono">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-foreground mb-4 font-mono">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-foreground mb-3 font-mono">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-foreground leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-muted-foreground bg-muted/30 p-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-primary hover:text-primary-alt underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

export default async function GameReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const review = await client.fetch<SanityDocument>(
    GAME_REVIEW_QUERY,
    await params,
    options
  );

  if (!review) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Review Not Found
          </h1>
          <Link href="/" className="text-primary hover:text-primary-alt">
            ← Back to reviews
          </Link>
        </div>
      </div>
    );
  }

  const gameImageUrl = review.game?.coverImage
    ? urlFor(review.game.coverImage)?.width(800).height(450).url()
    : null;

  const authorImageUrl = review.author?.avatar
    ? urlFor(review.author.avatar)?.width(64).height(64).url()
    : null;

  const publishDate = new Date(review.publishedAt);
  const relativeDate = formatDistanceToNow(publishDate, { addSuffix: true });

  const getAuthorInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8.5) return "text-green-600";
    if (score >= 7.0) return "text-primary";
    if (score >= 5.0) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 9.0) return "MASTERPIECE";
    if (score >= 8.5) return "EXCELLENT";
    if (score >= 7.5) return "GREAT";
    if (score >= 6.5) return "GOOD";
    if (score >= 5.0) return "AVERAGE";
    return "POOR";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-alt transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO REVIEWS
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <section className="mb-8">
          {gameImageUrl && (
            <div className="relative aspect-video mb-6 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={gameImageUrl}
                alt={
                  review.game?.coverImage?.alt ||
                  review.game?.title ||
                  review.title
                }
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Score Overlay */}
              <div className="absolute bottom-6 right-6 bg-background/90 backdrop-blur-sm rounded-lg p-4">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold font-mono ${getScoreColor(
                      review.reviewScore
                    )}`}
                  >
                    {review.reviewScore}
                  </div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {getScoreLabel(review.reviewScore)}
                  </div>
                  <div className="mt-2">
                    <PixelHeartRating
                      reviewScore={review.reviewScore}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Badge */}
              {review.featured && (
                <div className="absolute top-6 left-6">
                  <Badge className="bg-accent text-accent-foreground font-mono">
                    FEATURED
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Title and Meta */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-mono">
              {review.title}
            </h1>

            {review.game && (
              <div className="mb-4">
                <h2 className="text-xl text-primary font-semibold mb-2">
                  {review.game.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {review.game.developer && (
                    <span>Developer: {review.game.developer}</span>
                  )}
                  {review.game.publisher && (
                    <span>Publisher: {review.game.publisher}</span>
                  )}
                  {review.game.releaseDate && (
                    <span>
                      Released:{" "}
                      {new Date(review.game.releaseDate).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Categories and Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {review.categories?.map((category: any) => (
                <Badge
                  key={category._id || category.slug?.current || category.title}
                  variant="outline"
                  style={
                    category.color
                      ? {
                          backgroundColor: category.color,
                          color: "#ffffff",
                          borderColor: category.color,
                        }
                      : {}
                  }
                >
                  {category.title}
                </Badge>
              ))}
              {review.tags?.map((tag: any) => (
                <Badge
                  key={tag._id || tag.slug?.current || tag.title}
                  variant="secondary"
                  className="font-mono"
                >
                  {tag.title}
                </Badge>
              ))}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={review.publishedAt}>
                  {relativeDate} • {publishDate.toLocaleDateString()}
                </time>
              </div>
              {review.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <Link
                    href={`/authors/${review.author.slug.current}`}
                    className="hover:text-primary transition-colors"
                  >
                    {review.author.name}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {review.summary && (
            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <p className="text-lg text-foreground leading-relaxed font-medium">
                {review.summary}
              </p>
            </div>
          )}
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Review Content */}
            {Array.isArray(review.content) && (
              <div className="prose prose-lg max-w-none">
                <PortableText
                  value={review.content}
                  components={portableTextComponents}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center font-mono">
                  REVIEW SCORE
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div
                  className={`text-6xl font-bold font-mono mb-2 ${getScoreColor(
                    review.reviewScore
                  )}`}
                >
                  {review.reviewScore}
                </div>
                <div className="text-sm text-muted-foreground font-mono mb-4">
                  {getScoreLabel(review.reviewScore)}
                </div>
                <PixelHeartRating reviewScore={review.reviewScore} size="lg" />
              </CardContent>
            </Card>

            {/* Pros and Cons */}
            {(review.pros?.length > 0 || review.cons?.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">PROS & CONS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {review.pros?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsUp className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600 font-mono">
                          PROS
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {review.pros.map((pro: string, index: number) => (
                          <li
                            key={`pro-${index}`}
                            className="text-sm text-foreground"
                          >
                            • {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.cons?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ThumbsDown className="w-4 h-4 text-red-600" />
                        <span className="font-semibold text-red-600 font-mono">
                          CONS
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {review.cons.map((con: string, index: number) => (
                          <li
                            key={`con-${index}`}
                            className="text-sm text-foreground"
                          >
                            • {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Game Info */}
            {review.game && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">GAME INFO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {review.game.platforms?.length > 0 && (
                    <div>
                      <span className="font-semibold">Platforms:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {review.game.platforms.map((platform: any) => (
                          <Badge
                            key={
                              platform._id ||
                              platform.slug?.current ||
                              platform.title
                            }
                            variant="outline"
                            className="text-xs"
                          >
                            {platform.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {review.game.genres?.length > 0 && (
                    <div>
                      <span className="font-semibold">Genres:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {review.game.genres.map((genre: any) => (
                          <Badge
                            key={
                              genre._id || genre.slug?.current || genre.title
                            }
                            variant="outline"
                            className="text-xs"
                          >
                            {genre.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {review.game.esrbRating && (
                    <div>
                      <span className="font-semibold">ESRB Rating:</span>
                      <span className="ml-2">{review.game.esrbRating}</span>
                    </div>
                  )}

                  {review.game.officialWebsite && (
                    <div>
                      <a
                        href={review.game.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-alt underline"
                      >
                        Official Website →
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Author Card */}
            {review.author && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">AUTHOR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      {authorImageUrl ? (
                        <AvatarImage
                          src={authorImageUrl}
                          alt={review.author.name}
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary text-primary-foreground font-mono">
                        {getAuthorInitials(review.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={`/authors/${review.author.slug.current}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {review.author.name}
                      </Link>
                      {review.author.bio && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {review.author.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

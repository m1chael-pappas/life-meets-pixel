import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PixelHeartRating from "@/components/ui/pixel-heart-rating";
import { fetchOptions, REVIEW_QUERY } from "@/lib/queries";
import { Category, Genre, Platform, Review, Tag } from "@/lib/types";
import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const review = await client.fetch<Review>(
    REVIEW_QUERY,
    await params,
    fetchOptions
  );

  if (!review) {
    return {
      title: "Review Not Found",
      description: "The requested review could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";
  const itemImageUrl = review.reviewableItem?.coverImage
    ? urlFor(review.reviewableItem.coverImage)?.width(1200).height(630).url()
    : null;

  // Use SEO data from CMS if available, otherwise fall back to review data
  const seoTitle =
    review.seo?.metaTitle ||
    `${review.title} | ${review.reviewableItem?.title} Review`;
  const seoDescription =
    review.seo?.metaDescription ||
    review.summary ||
    `Read our review of ${review.reviewableItem?.title}. Score: ${review.reviewScore}/10`;
  const seoKeywords = review.seo?.keywords || [
    review.reviewableItem?.title,
    `${review.reviewableItem?.itemType} review`,
    "review",
    ...(review.categories?.map((cat: Category) => cat.title) || []),
  ];

  const canonicalUrl = `${siteUrl}/reviews/${review.slug.current}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    authors: [{ name: review.author?.name || "Life Meets Pixel" }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: "Life Meets Pixel",
      publishedTime: review.publishedAt,
      authors: [review.author?.name || "Life Meets Pixel"],
      images: itemImageUrl
        ? [
            {
              url: itemImageUrl,
              width: 1200,
              height: 630,
              alt:
                review.reviewableItem?.coverImage?.alt ||
                `${review.reviewableItem?.title} cover`,
            },
          ]
        : [],
      tags: review.categories?.map((cat: Category) => cat.title) || [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: itemImageUrl ? [itemImageUrl] : [],
      creator: review.author?.socialLinks?.x || "@lifemeetspixel",
    },
    other: {
      "article:author": review.author?.name || "Life Meets Pixel",
      "article:published_time": review.publishedAt,
      "article:section": review.reviewableItem?.itemType || "Review",
      "article:tag":
        review.categories?.map((cat: Category) => cat.title).join(", ") ||
        "Review",
    },
  };
}

// Helper function to get video embed URL
const getVideoEmbedUrl = (url: string): string | null => {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Direct video files
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return url;
  }

  return null;
};

// Custom Portable Text components
const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = urlFor(value)?.width(800).url();
      return imageUrl ? (
        <div className="my-8">
          <div className="relative w-full max-w-[800px] mx-auto">
            <Image
              src={imageUrl}
              alt={value.caption || "Review image"}
              width={800}
              height={450}
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
          {value.caption && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              {value.caption}
            </p>
          )}
        </div>
      ) : null;
    },
    videoEmbed: ({ value }) => {
      const embedUrl = getVideoEmbedUrl(value.url);

      if (!embedUrl) {
        return (
          <div className="my-8 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Invalid video URL: {value.url}
            </p>
          </div>
        );
      }

      const isDirectVideo = embedUrl.match(/\.(mp4|webm|ogg)$/i);

      return (
        <div className="my-8">
          <div className="relative w-full max-w-[800px] mx-auto aspect-video rounded-lg overflow-hidden shadow-md">
            {isDirectVideo ? (
              <video
                src={embedUrl}
                controls
                className="w-full h-full"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={value.caption || "Embedded video"}
              />
            )}
          </div>
          {value.caption && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    divider: () => <hr className="my-8 border-t-2 border-primary/30" />,
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
    hr: () => <hr className="my-8 border-t-2 border-primary/30" />,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-foreground leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-foreground leading-relaxed">{children}</li>
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

// Helper functions
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

const getItemTypeInfo = (itemType: string) => {
  const typeMap = {
    videogame: { emoji: "🎮", label: "Game" },
    boardgame: { emoji: "🎲", label: "Board Game" },
    movie: { emoji: "🎬", label: "Movie" },
    tvseries: { emoji: "📺", label: "TV Series" },
    anime: { emoji: "🍥", label: "Anime" },
    book: { emoji: "📚", label: "Book" },
    comic: { emoji: "📖", label: "Comic" },
    gadget: { emoji: "📱", label: "Tech" },
  };
  return (
    typeMap[itemType as keyof typeof typeMap] || {
      emoji: "📦",
      label: "Item",
    }
  );
};

const getCreatorLabel = (itemType: string): string => {
  switch (itemType) {
    case "book":
      return "Author";
    case "movie":
    case "tvseries":
    case "anime":
      return "Director";
    default:
      return "Creator";
  }
};

const getPublisherLabel = (itemType: string): string => {
  switch (itemType) {
    case "book":
      return "Publisher";
    case "movie":
    case "tvseries":
    case "anime":
      return "Studio";
    default:
      return "Publisher";
  }
};

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const review = await client.fetch<Review>(
    REVIEW_QUERY,
    await params,
    fetchOptions
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

  const itemImageUrl = review.reviewableItem?.coverImage
    ? urlFor(review.reviewableItem.coverImage)?.width(800).height(450).url()
    : null;

  const authorImageUrl = review.author?.avatar
    ? urlFor(review.author.avatar)?.width(64).height(64).url()
    : null;

  const publishDate = new Date(review.publishedAt);
  const relativeDate = formatDistanceToNow(publishDate, { addSuffix: true });

  const itemType = review.reviewableItem?.itemType;
  const typeInfo = getItemTypeInfo(itemType || "");

  // Structured data for SEO and AI search engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": itemType === "videogame" || itemType === "boardgame" ? "Game" :
               itemType === "movie" ? "Movie" :
               itemType === "tvseries" || itemType === "anime" ? "TVSeries" :
               itemType === "book" || itemType === "comic" ? "Book" :
               itemType === "gadget" ? "Product" : "CreativeWork",
      "name": review.reviewableItem?.title || review.title,
      "image": itemImageUrl || undefined,
      "description": review.reviewableItem?.description || review.summary,
      "author": review.reviewableItem?.creator ? {
        "@type": "Person",
        "name": review.reviewableItem.creator
      } : undefined,
      "publisher": review.reviewableItem?.publisher ? {
        "@type": "Organization",
        "name": review.reviewableItem.publisher
      } : undefined,
      "datePublished": review.reviewableItem?.releaseDate || undefined,
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.reviewScore,
      "bestRating": 10,
      "worstRating": 0
    },
    "author": {
      "@type": "Person",
      "name": review.author?.name || "Life Meets Pixel",
      "url": review.author?.slug?.current ? `https://lifemeetspixel.com/author/${review.author.slug.current}` : undefined
    },
    "datePublished": review.publishedAt,
    "publisher": {
      "@type": "Organization",
      "name": "Life Meets Pixel",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lifemeetspixel.com/logo.png"
      }
    },
    "headline": review.title,
    "reviewBody": review.summary || "",
    "inLanguage": "en-US"
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://lifemeetspixel.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Reviews",
        "item": "https://lifemeetspixel.com/reviews"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": review.title,
        "item": `https://lifemeetspixel.com/reviews/${review.slug.current}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Link
            href="/reviews"
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
          {itemImageUrl && (
            <div className="relative aspect-video mb-6 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={itemImageUrl}
                alt={
                  review.reviewableItem?.coverImage?.alt ||
                  review.reviewableItem?.title ||
                  review.title
                }
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px, 896px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Item Type Badge */}
              <div className="absolute top-6 left-6">
                <Badge className="bg-primary text-primary-foreground font-mono">
                  {typeInfo.emoji} {typeInfo.label}
                </Badge>
              </div>

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
                <div className="absolute top-6 right-6">
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

            {review.reviewableItem && (
              <div className="mb-4">
                <h2 className="text-xl text-primary font-semibold mb-2">
                  {review.reviewableItem.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {review.reviewableItem.creator && (
                    <span>
                      {getCreatorLabel(itemType || "")}:{" "}
                      {review.reviewableItem.creator}
                    </span>
                  )}
                  {review.reviewableItem.publisher && (
                    <span>
                      {getPublisherLabel(itemType || "")}:{" "}
                      {review.reviewableItem.publisher}
                    </span>
                  )}
                  {review.reviewableItem.releaseDate && (
                    <span>
                      Released:{" "}
                      {new Date(
                        review.reviewableItem.releaseDate
                      ).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Categories and Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {review.categories?.map((category: Category) => (
                <Badge
                  key={category._id || category.slug?.current || category.title}
                  className="bg-accent text-black border-none hover:bg-accent/90 px-3 py-1.5"
                >
                  {category.title}
                </Badge>
              ))}
              {review.tags?.map((tag: Tag) => (
                <Badge
                  key={tag._id || tag.slug?.current || tag.title}
                  variant="secondary"
                  className="font-mono px-3 py-1.5"
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
                    href={`/author/${review.author.slug.current}`}
                    className="hover:text-primary transition-colors"
                  >
                    {review.author.name}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Verdict */}
          {review.verdict && (
            <div className="mt-8 bg-muted/20 rounded-lg p-6 border border-border border-l-4 border-l-primary">
              <h3 className="text-xl font-bold text-foreground mb-3 font-mono">
                TL;DR
              </h3>
              <p className="text-foreground leading-relaxed">
                {review.verdict}
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
          <div className="space-y-6 sticky top-24 self-start">
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
            {(review.pros?.length || review.cons?.length) && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">PROS & CONS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {review.pros?.length && (
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

                  {review.cons?.length && (
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

            {/* Item Info - Dynamic based on type */}
            {review.reviewableItem && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">
                    {typeInfo.emoji} {typeInfo.label.toUpperCase()} INFO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {/* Video Game specific fields */}
                  {itemType === "videogame" && (
                    <>
                      {review.reviewableItem.platforms?.length && (
                        <div>
                          <span className="font-semibold">Platforms:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {review.reviewableItem.platforms.map(
                              (platform: Platform) => (
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
                              )
                            )}
                          </div>
                        </div>
                      )}
                      {review.reviewableItem.esrbRating && (
                        <div>
                          <span className="font-semibold">ESRB Rating:</span>
                          <span className="ml-2">
                            {review.reviewableItem.esrbRating}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Board Game specific fields */}
                  {itemType === "boardgame" && (
                    <>
                      {review.reviewableItem.playerCount && (
                        <div>
                          <span className="font-semibold">Players:</span>
                          <span className="ml-2">
                            {review.reviewableItem.playerCount}
                          </span>
                        </div>
                      )}
                      {review.reviewableItem.playTime && (
                        <div>
                          <span className="font-semibold">Play Time:</span>
                          <span className="ml-2">
                            {review.reviewableItem.playTime}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Movie/TV/Anime specific fields */}
                  {(itemType === "movie" ||
                    itemType === "tvseries" ||
                    itemType === "anime") && (
                    <>
                      {review.reviewableItem.runtime && (
                        <div>
                          <span className="font-semibold">Runtime:</span>
                          <span className="ml-2">
                            {review.reviewableItem.runtime}
                          </span>
                        </div>
                      )}
                      {review.reviewableItem.seasons && (
                        <div>
                          <span className="font-semibold">Seasons:</span>
                          <span className="ml-2">
                            {review.reviewableItem.seasons}
                          </span>
                        </div>
                      )}
                      {review.reviewableItem.episodes && (
                        <div>
                          <span className="font-semibold">Episodes:</span>
                          <span className="ml-2">
                            {review.reviewableItem.episodes}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Book/Comic specific fields */}
                  {(itemType === "book" || itemType === "comic") && (
                    <>
                      {review.reviewableItem.pageCount && (
                        <div>
                          <span className="font-semibold">Pages:</span>
                          <span className="ml-2">
                            {review.reviewableItem.pageCount}
                          </span>
                        </div>
                      )}
                      {review.reviewableItem.isbn && (
                        <div>
                          <span className="font-semibold">ISBN:</span>
                          <span className="ml-2">
                            {review.reviewableItem.isbn}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Common fields for all types */}
                  {review.reviewableItem.genres?.length && (
                    <div>
                      <span className="font-semibold">Genres:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {review.reviewableItem.genres.map((genre: Genre) => (
                          <Badge
                            key={
                              genre._id || genre.slug?.current || genre.title
                            }
                            className="text-xs bg-secondary text-black border-none hover:bg-secondary/90 px-3 py-1.5"
                          >
                            {genre.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {review.reviewableItem.officialWebsite && (
                    <div>
                      <a
                        href={review.reviewableItem.officialWebsite}
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
              <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <Link href={`/author/${review.author.slug.current}`} className="block">
                  <CardHeader>
                    <CardTitle className="font-mono">WRITTEN BY</CardTitle>
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
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {review.author.name}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          {"//"} Click to view profile
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

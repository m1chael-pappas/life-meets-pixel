import { formatDistanceToNow } from 'date-fns';
import { Metadata } from 'next';
import {
  PortableText,
  type PortableTextComponents,
  type SanityDocument,
} from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/ui/mode-toggle';
import {
  fetchOptions,
  NEWS_POST_QUERY,
} from '@/lib/queries';
import { Category } from '@/lib/types';
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface NewsPostPageProps {
  params: Promise<{ slug: string }>;
}

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

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
              alt={value.caption || "Article image"}
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
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-mono">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 font-mono">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-mono">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-foreground leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-muted-foreground bg-[whitesmoke] dark:bg-[#2a2a2a] p-4 rounded-r-lg">
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

// Generate metadata
export async function generateMetadata({
  params,
}: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";

  const post = await client.fetch<SanityDocument>(
    NEWS_POST_QUERY,
    { slug },
    fetchOptions
  );

  if (!post) {
    return {
      title: "News Not Found | Life Meets Pixel",
    };
  }

  const canonicalUrl = `${siteUrl}/news/${slug}`;

  return {
    title: `${post.title}`,
    description:
      post.excerpt ||
      post.seo?.metaDescription ||
      "Read the latest gaming and geek culture news.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      publishedTime: post.publishedAt,
      authors: [post.author?.name || "Life Meets Pixel"],
      images: post.featuredImage?.asset?.url
        ? [post.featuredImage.asset.url]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage?.asset?.url
        ? [post.featuredImage.asset.url]
        : [],
    },
  };
}

const getAuthorInitials = (name: string) => {
  const words = name.split(" ");
  const initials = words.reduce((acc, word) => acc + (word[0] || ""), "");
  return initials.toUpperCase().slice(0, 2);
};

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params;
  const post = await client.fetch<SanityDocument>(
    NEWS_POST_QUERY,
    { slug },
    fetchOptions
  );

  if (!post) {
    notFound();
  }

  const relativeDate = formatDistanceToNow(new Date(post.publishedAt), {
    addSuffix: true,
  });

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Structured data for SEO and AI search engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": post.breaking ? "NewsArticle" : "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    image: post.featuredImage?.asset?.url ? [post.featuredImage.asset.url] : [],
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || "Life Meets Pixel",
      url: post.author?.slug?.current
        ? `https://lifemeetspixel.com/author/${post.author.slug.current}`
        : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "Life Meets Pixel",
      logo: {
        "@type": "ImageObject",
        url: "https://lifemeetspixel.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lifemeetspixel.com/news/${post.slug.current}`,
    },
    articleSection: post.categories?.[0]?.title || "News",
    keywords:
      post.categories?.map((cat: { title: string }) => cat.title).join(", ") ||
      "",
    inLanguage: "en-US",
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://lifemeetspixel.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "News",
        item: "https://lifemeetspixel.com/news",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://lifemeetspixel.com/news/${post.slug.current}`,
      },
    ],
  };

  return (
    <div className="min-h-screen">
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
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity flex items-center gap-3"
            >
              <Image
                src="/logo.png"
                alt="Life Meets Pixel"
                width={40}
                height={40}
                className="w-10 h-10"
              />
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
      <main className="container mx-auto max-w-3xl p-6 py-12">
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 card-shadow-static">
          {/* Back Link */}
          <Link
            href="/news"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8 font-mono"
          >
            ← Back to News
          </Link>

          {/* Article Header */}
          <article>
            {/* Breaking Badge */}
            {post.breaking && (
              <div className="mb-4">
                <Badge className="bg-red-500 text-white border-none">
                  🚨 BREAKING NEWS
                </Badge>
              </div>
            )}

            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((cat: Category, index: number) => (
                  <Badge
                    key={cat.slug?.current || cat.title || index}
                    className="bg-accent text-black border-none hover:bg-accent/90 px-3 py-1.5"
                  >
                    {cat.title}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-mono leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    {post.author.avatar?.asset?.url ? (
                      <AvatarImage
                        src={post.author.avatar.asset.url}
                        alt={post.author.name}
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-mono">
                      {getAuthorInitials(post.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/author/${post.author.slug.current}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {post.author.name}
                    </Link>
                    <div className="text-xs text-muted-foreground font-mono">
                      {publishedDate} • {relativeDate}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Featured Image */}
            {post.featuredImage?.asset?.url && (
              <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.featuredImage.asset.url}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {Array.isArray(post.content) ? (
                <PortableText
                  value={post.content}
                  components={portableTextComponents}
                />
              ) : (
                <p className="text-muted-foreground">No content available.</p>
              )}
            </div>

            {/* Author Card */}
            {post.author && (
              <div className="mt-12 p-6 bg-card rounded-lg border border-border card-shadow">
                <Link
                  href={`/author/${post.author.slug.current}`}
                  className="block"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      {post.author.avatar?.asset?.url ? (
                        <AvatarImage
                          src={post.author.avatar.asset.url}
                          alt={post.author.name}
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary text-primary-foreground font-mono">
                        {getAuthorInitials(post.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-1 font-mono hover:text-primary transition-colors">
                        {post.author.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {"//"} Click to view author profile
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </article>

          {/* Back to News */}
          <div className="mt-12 pt-8 border-t border-border">
            <Link
              href="/news"
              className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors font-mono"
            >
              ← Back to all news
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

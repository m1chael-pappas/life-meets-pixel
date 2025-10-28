import { type SanityDocument } from 'next-sanity';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { PortableText, type PortableTextComponents } from 'next-sanity';

import { ModeToggle } from '@/components/ui/mode-toggle';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { client } from '@/sanity/client';
import { NEWS_POST_QUERY, fetchOptions } from '@/lib/queries';
import { Category } from '@/lib/types';
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

// Generate metadata
export async function generateMetadata({ params }: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lifemeetspixel.com';

  const post = await client.fetch<SanityDocument>(
    NEWS_POST_QUERY,
    { slug },
    fetchOptions
  );

  if (!post) {
    return {
      title: 'News Not Found | Life Meets Pixel',
    };
  }

  const canonicalUrl = `${siteUrl}/news/${slug}`;

  return {
    title: `${post.title}`,
    description: post.excerpt || post.seo?.metaDescription || 'Read the latest gaming and geek culture news.',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      publishedTime: post.publishedAt,
      authors: [post.author?.name || 'Life Meets Pixel'],
      images: post.featuredImage?.asset?.url ? [post.featuredImage.asset.url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage?.asset?.url ? [post.featuredImage.asset.url] : [],
    },
  };
}

const getAuthorInitials = (name: string) => {
  const words = name.split(' ');
  const initials = words.reduce((acc, word) => acc + (word[0] || ''), '');
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

  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Structured data for SEO and AI search engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": post.breaking ? "NewsArticle" : "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || "",
    "image": post.featuredImage?.asset?.url ? [post.featuredImage.asset.url] : [],
    "datePublished": post.publishedAt,
    "dateModified": post._updatedAt || post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author?.name || "Life Meets Pixel",
      "url": post.author?.slug?.current ? `https://lifemeetspixel.com/author/${post.author.slug.current}` : undefined
    },
    "publisher": {
      "@type": "Organization",
      "name": "Life Meets Pixel",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lifemeetspixel.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://lifemeetspixel.com/news/${post.slug.current}`
    },
    "articleSection": post.categories?.[0]?.title || "News",
    "keywords": post.categories?.map((cat: { title: string }) => cat.title).join(", ") || "",
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
        "name": "News",
        "item": "https://lifemeetspixel.com/news"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://lifemeetspixel.com/news/${post.slug.current}`
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
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-3">
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
                  variant="secondary"
                  style={
                    cat.color
                      ? {
                          backgroundColor: cat.color,
                          color: '#ffffff',
                          border: 'none',
                        }
                      : {}
                  }
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
                className="object-cover"
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
            <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-border hover:shadow-lg transition-all duration-300">
              <Link href={`/author/${post.author.slug.current}`} className="block">
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
                      {'//'} Click to view author profile
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
      </main>
    </div>
  );
}

import { formatDistanceToNow } from "date-fns";
import { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AuthorChip } from "@/components/retro/author-chip";
import { SiteHeader } from "@/components/site-header";
import { fetchOptions, NEWS_POST_QUERY } from "@/lib/queries";
import type { Category, NewsPost } from "@/lib/types";
import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

interface NewsPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsPostPageProps): Promise<Metadata> {
  const post = await client.fetch<NewsPost>(NEWS_POST_QUERY, await params, fetchOptions);
  if (!post) {
    return { title: "News Post Not Found", description: "The requested news post could not be found." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";
  const imageUrl = post.featuredImage
    ? urlFor(post.featuredImage)?.width(1200).height(630).url()
    : null;
  const canonicalUrl = `${siteUrl}/news/${post.slug.current}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      siteName: "Life Meets Pixel",
      publishedTime: post.publishedAt,
      authors: [post.author?.name || "Life Meets Pixel"],
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: post.featuredImage?.alt || post.title }]
        : [],
      tags: post.categories?.map((cat: Category) => cat.title) || [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

const getVideoEmbedUrl = (url: string): string | null => {
  const yt = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (url.match(/\.(mp4|webm|ogg)$/i)) return url;
  return null;
};

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlFor(value)?.width(800).url();
      if (!imageUrl) return null;
      return (
        <figure style={{ margin: "24px 0" }}>
          <Image
            src={imageUrl}
            alt={value.alt || value.caption || "News image"}
            width={800}
            height={450}
            style={{ width: "100%", height: "auto" }}
          />
          {value.caption && (
            <figcaption style={{ textAlign: "center", fontSize: 12, color: "var(--ink-mute)", marginTop: 8 }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    videoEmbed: ({ value }) => {
      const embedUrl = getVideoEmbedUrl(value.url);
      if (!embedUrl) return null;
      const direct = embedUrl.match(/\.(mp4|webm|ogg)$/i);
      return (
        <figure style={{ margin: "24px 0" }}>
          <div style={{ position: "relative", aspectRatio: "16 / 9", border: "3px solid var(--bg-3)" }}>
            {direct ? (
              <video src={embedUrl} controls style={{ width: "100%", height: "100%" }} preload="metadata" />
            ) : (
              <iframe
                src={embedUrl}
                style={{ width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={value.caption || "Embedded video"}
              />
            )}
          </div>
        </figure>
      );
    },
    divider: () => <hr style={{ border: 0, borderTop: "2px dashed var(--bg-3)", margin: "24px 0" }} />,
    spacer: ({ value }) => {
      const size = value?.size as string | undefined;
      const h = size === "large" ? 48 : size === "small" ? 12 : 24;
      return <div style={{ height: h }} aria-hidden="true" />;
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const post = await client.fetch<NewsPost>(NEWS_POST_QUERY, await params, fetchOptions);

  if (!post) notFound();

  const publishDate = new Date(post.publishedAt);
  const relativeDate = formatDistanceToNow(publishDate, { addSuffix: true });
  const imageUrl = post.featuredImage?.asset?.url ?? null;

  return (
    <>
      <SiteHeader currentPage="news" />
      <main className="lmp-container" style={{ paddingTop: 32, paddingBottom: 48 }}>
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">HOME</Link>
          <span className="sep">/</span>
          <Link href="/news">NEWS</Link>
          <span className="sep">/</span>
          <span>{post.title.toUpperCase()}</span>
        </nav>

        <div className="article-hero" style={{ minHeight: 380 }}>
          {imageUrl && (
            <div className="article-hero__bg">
              <Image src={imageUrl} alt="" fill priority sizes="100vw" aria-hidden="true" />
            </div>
          )}
          <div className="article-hero__overlay" aria-hidden="true" />
          <div className="article-hero__inner" style={{ gridTemplateColumns: "1fr" }}>
            <div className="article-meta">
              {post.breaking && (
                <div className="article-meta__cat" style={{ color: "var(--heart)" }}>
                  ◆ BREAKING NEWS
                </div>
              )}
              <h1 className="article-meta__title">{post.title}</h1>
              <p className="hero-feature__sub">{post.excerpt}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <AuthorChip name={post.author.name} accentColor={post.author.accentColor} />
                <time
                  dateTime={post.publishedAt}
                  style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--ink-mute)" }}
                >
                  {relativeDate}
                </time>
              </div>
            </div>
          </div>
        </div>

        <article className="article-content" style={{ maxWidth: 820, margin: "0 auto" }}>
          {Array.isArray(post.content) && (
            <PortableText value={post.content} components={portableTextComponents} />
          )}
        </article>
      </main>
    </>
  );
}

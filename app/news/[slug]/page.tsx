import { formatDistanceToNow } from "date-fns";
import { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AuthorChip } from "@/components/retro/author-chip";
import { NewsCard } from "@/components/retro/news-card";
import { SiteHeader } from "@/components/site-header";
import { authorInitial, authorLevel } from "@/lib/mappings";
import {
  fetchOptions,
  NEWS_POST_QUERY,
  RELATED_NEWS_QUERY,
} from "@/lib/queries";
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

function countWords(blocks: NewsPost["content"]): number {
  if (!Array.isArray(blocks)) return 0;
  let total = 0;
  for (const block of blocks) {
    if (block && typeof block === "object" && "_type" in block && block._type === "block") {
      const children = (block as { children?: Array<{ text?: string }> }).children ?? [];
      for (const child of children) {
        if (child?.text) total += child.text.trim().split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return total;
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const resolvedParams = await params;
  const post = await client.fetch<NewsPost>(NEWS_POST_QUERY, resolvedParams, fetchOptions);

  if (!post) notFound();

  const related = await client.fetch<NewsPost[]>(
    RELATED_NEWS_QUERY,
    { slug: resolvedParams.slug },
    fetchOptions,
  );

  const publishDate = new Date(post.publishedAt);
  const relativeDate = formatDistanceToNow(publishDate, { addSuffix: true });
  const imageUrl = post.featuredImage?.asset?.url ?? null;
  const wordCount = countWords(post.content);
  const readMin = Math.max(1, Math.round(wordCount / 220));

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
              <p className="article-meta__lead">{post.excerpt}</p>
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

        <div className="article-body">
          <article className="article-content">
            {Array.isArray(post.content) && (
              <PortableText value={post.content} components={portableTextComponents} />
            )}
          </article>

          <aside>
            <div className="stat-block">
              <h3>◆ AT A GLANCE</h3>
              <div className="stat-row">
                <span className="lbl">Type</span>
                <span className="val">{post.breaking ? "BREAKING" : "NEWS"}</span>
              </div>
              <div className="stat-row">
                <span className="lbl">Published</span>
                <span className="val">
                  {publishDate
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, "·")}
                </span>
              </div>
              <div className="stat-row">
                <span className="lbl">Read Time</span>
                <span className="val">
                  {readMin} MIN · {wordCount} WORDS
                </span>
              </div>
              {post.categories?.length ? (
                <div className="stat-row">
                  <span className="lbl">Categories</span>
                  <span className="val">
                    {post.categories
                      .map((c: Category) => c.title.toUpperCase())
                      .join(" · ")}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="stat-block">
              <h3>◆ REPORTED BY</h3>
              <Link
                href={`/author/${post.author.slug.current}`}
                className="reviewed-by"
              >
                <div
                  className="reviewed-by__avatar"
                  style={{
                    borderColor: post.author.accentColor || "var(--neon-2)",
                    color: post.author.accentColor || "var(--neon-2)",
                  }}
                >
                  {authorInitial(post.author.name)}
                </div>
                <div>
                  <div className="reviewed-by__name">
                    {post.author.name.toUpperCase()}
                  </div>
                  <div className="reviewed-by__lvl">
                    LV {authorLevel(post.author.reviewCount, post.author.newsCount)} · REPORTER
                  </div>
                </div>
              </Link>
              {post.author.bio && (
                <p className="reviewed-by__bio">{post.author.bio}</p>
              )}
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="lmp-section--tight">
            <div className="section-head">
              <div className="section-head__title">
                <span className="num">◆</span>
                <h2>MORE FROM THE NEWS DESK</h2>
              </div>
              <Link href="/news" className="section-head__action">
                ALL NEWS
              </Link>
            </div>
            <div className="news-grid">
              {related.map((p, i) => (
                <NewsCard key={p._id} post={p} lead={i === 0} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

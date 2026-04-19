import { Suspense } from "react";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NewsCard } from "@/components/retro/news-card";
import { ReviewCard } from "@/components/retro/review-card";
import { SiteHeader } from "@/components/site-header";
import { authorInitial } from "@/lib/mappings";
import { fetchOptions, HIDDEN_AUTHOR_IDS } from "@/lib/queries";
import type { Author, NewsPost, Review } from "@/lib/types";
import { client } from "@/sanity/client";

type Props = {
  params: Promise<{ slug: string }>;
};

const AUTHOR_BY_SLUG_QUERY = `*[_type == "author" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  bio,
  email,
  "accentColor": accentColor.hex,
  avatar{ asset->{ url }, alt },
  socialLinks
}`;

const AUTHOR_REVIEWS_QUERY = `*[_type == "review" && author._ref == $authorId && defined(slug.current)]|order(publishedAt desc)[0...6]{
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
    coverImage{ asset->{ url }, alt },
    creator,
    publisher,
    releaseDate,
    genres[]->{ title, slug, "color": color.hex }
  },
  author->{
    name,
    slug,
    "accentColor": accentColor.hex,
    avatar{ asset->{ url }, alt }
  },
  categories[]->{ title, slug, "color": color.hex },
  tags[]->{ _id, title, slug }
}`;

const AUTHOR_NEWS_QUERY = `*[_type == "newsPost" && author._ref == $authorId && defined(slug.current)]|order(publishedAt desc)[0...6]{
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  breaking,
  featuredImage{ asset->{ url }, alt },
  author->{ name, slug, "accentColor": accentColor.hex, avatar{ asset->{ url }, alt } },
  categories[]->{ title, slug, "color": color.hex }
}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lifemeetspixel.com";
  const author = await client.fetch<Author>(AUTHOR_BY_SLUG_QUERY, { slug }, fetchOptions);
  if (!author) return { title: "Author Not Found" };
  const canonicalUrl = `${siteUrl}/author/${slug}`;
  return {
    title: `${author.name} - Author`,
    description: author.bio || `Meet ${author.name}, a writer at Life Meets Pixel.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${author.name} - Author | Life Meets Pixel`,
      description: author.bio || `Meet ${author.name}, a writer at Life Meets Pixel.`,
      url: canonicalUrl,
      type: "profile",
    },
  };
}

async function AuthorContent({ slug }: { slug: string }) {
  const author = await client.fetch<Author>(AUTHOR_BY_SLUG_QUERY, { slug }, fetchOptions);
  if (!author || HIDDEN_AUTHOR_IDS.includes(author._id)) notFound();

  const [reviews, newsPosts, reviewCount, newsCount] = await Promise.all([
    client.fetch<Review[]>(AUTHOR_REVIEWS_QUERY, { authorId: author._id }, fetchOptions),
    client.fetch<NewsPost[]>(AUTHOR_NEWS_QUERY, { authorId: author._id }, fetchOptions),
    client.fetch<number>(`count(*[_type == "review" && author._ref == $authorId])`, { authorId: author._id }, fetchOptions),
    client.fetch<number>(`count(*[_type == "newsPost" && author._ref == $authorId])`, { authorId: author._id }, fetchOptions),
  ]);

  const accent = author.accentColor || "var(--neon-2)";
  const avatarUrl = author.avatar?.asset?.url;

  return (
    <>
      <section className="contact-hero">
        <div className="contact-hero__grid" style={{ gridTemplateColumns: "auto 1fr" }}>
          <div
            className="contact-hero__badge"
            style={{ borderColor: accent, overflow: "hidden" }}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={author.avatar?.alt || author.name}
                width={140}
                height={140}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <span style={{ color: accent, fontFamily: "var(--font-press-start-2p)", fontSize: 36 }}>
                {authorInitial(author.name)}
              </span>
            )}
          </div>
          <div>
            <h1 className="contact-hero__title">{author.name.toUpperCase()}</h1>
            {author.bio && <p className="contact-hero__sub">{author.bio}</p>}
            <div style={{ display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
              <div>
                <div
                  style={{ fontFamily: "var(--font-press-start-2p)", fontSize: 28, color: "var(--neon-3)" }}
                >
                  {reviewCount}
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.1em" }}>REVIEWS</div>
              </div>
              <div>
                <div
                  style={{ fontFamily: "var(--font-press-start-2p)", fontSize: 28, color: "var(--neon-1)" }}
                >
                  {newsCount}
                </div>
                <div style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.1em" }}>NEWS POSTS</div>
              </div>
            </div>
            {(author.email || author.socialLinks) && (
              <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                {author.email && (
                  <a className="retro-btn" href={`mailto:${author.email}`}>
                    ✉ EMAIL
                  </a>
                )}
                {author.socialLinks?.x && (
                  <a className="retro-btn" href={author.socialLinks.x} target="_blank" rel="noopener noreferrer">
                    𝕏 X
                  </a>
                )}
                {author.socialLinks?.youtube && (
                  <a
                    className="retro-btn"
                    href={author.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ▶ YOUTUBE
                  </a>
                )}
                {author.socialLinks?.instagram && (
                  <a
                    className="retro-btn"
                    href={author.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ◆ INSTAGRAM
                  </a>
                )}
                {author.socialLinks?.website && (
                  <a
                    className="retro-btn"
                    href={author.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ⌘ WEBSITE
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="lmp-section--tight">
          <div className="section-head">
            <div className="section-head__title">
              <span className="num">★</span>
              <h2>LATEST REVIEWS</h2>
            </div>
            {reviewCount > 6 && (
              <Link href="/reviews" className="section-head__action">
                VIEW ALL
              </Link>
            )}
          </div>
          <div className="reviews-grid">
            {reviews.map((r) => (
              <ReviewCard key={r._id} review={r} />
            ))}
          </div>
        </section>
      )}

      {newsPosts.length > 0 && (
        <section className="lmp-section--tight">
          <div className="section-head">
            <div className="section-head__title">
              <span className="num">▤</span>
              <h2>LATEST NEWS</h2>
            </div>
            {newsCount > 6 && (
              <Link href="/news" className="section-head__action">
                VIEW ALL
              </Link>
            )}
          </div>
          <div className="news-grid">
            {newsPosts.map((p, i) => (
              <NewsCard key={p._id} post={p} lead={i === 0} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function AuthorSkeleton() {
  return (
    <div className="contact-hero" style={{ minHeight: 200 }}>
      <div className="contact-hero__grid">
        <div className="contact-hero__badge" aria-hidden="true">
          ◆
        </div>
        <div />
      </div>
    </div>
  );
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <SiteHeader currentPage="author" />
      <main className="lmp-container" style={{ paddingTop: 32, paddingBottom: 48 }}>
        <Suspense fallback={<AuthorSkeleton />}>
          <AuthorContent slug={slug} />
        </Suspense>
      </main>
    </>
  );
}

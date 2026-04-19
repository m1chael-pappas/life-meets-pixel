import Image from "next/image";
import Link from "next/link";

import { HeartRow } from "@/components/retro/heart-row";
import { itemTypeToCat, scoreTone } from "@/lib/mappings";
import { FEATURED_REVIEWS_QUERY, TOP_PICKS_QUERY, fetchOptions } from "@/lib/queries";
import type { Review } from "@/lib/types";
import { client } from "@/sanity/client";

type TopPick = { _id: string; title: string; slug: { current: string }; reviewScore: number };

export default async function HeroSection() {
  const [featured, topPicks] = await Promise.all([
    client.fetch<Review[]>(FEATURED_REVIEWS_QUERY, {}, fetchOptions),
    client.fetch<TopPick[]>(TOP_PICKS_QUERY, {}, fetchOptions),
  ]);

  const hero = featured[0];

  if (!hero) {
    return null;
  }

  const item = hero.reviewableItem;
  const cat = itemTypeToCat(item.itemType);
  const studio = item.publisher || item.creator || "";
  const tone = scoreTone(hero.reviewScore);
  const toneColor =
    tone === "low"
      ? "var(--heart)"
      : tone === "mid"
        ? "var(--neon-4)"
        : "var(--neon-3)";

  return (
    <section className="hero">
      <div className="crt-frame">
        <div className="hero-grid">
          <Link href={`/reviews/${hero.slug.current}`} className="hero-feature">
            <div className="hero-feature__media">
              {item.coverImage?.asset?.url && (
                <Image
                  src={item.coverImage.asset.url}
                  alt={item.coverImage.alt || item.title}
                  fill
                  priority
                  sizes="(max-width: 980px) 100vw, 60vw"
                />
              )}
            </div>
            <div className="hero-feature__body">
              <div className="hero-feature__overline">★ EDITOR&apos;S CHOICE · {cat.toUpperCase()}</div>
              <h2 className="hero-feature__title">{hero.title}</h2>
              <p className="hero-feature__sub">
                {item.title}
                {studio && ` — ${studio}`}
              </p>
              <div className="hero-feature__meta">
                <span
                  className="hero-feature__score"
                  style={{ color: toneColor, borderColor: toneColor }}
                >
                  {hero.reviewScore.toFixed(1)}
                </span>
                <span className="hero-feature__hearts">
                  <HeartRow score={hero.reviewScore} size={18} />
                </span>
                <span style={{ color: "var(--ink-dim)", fontSize: 12 }}>
                  by {hero.author.name}
                </span>
              </div>
            </div>
          </Link>

          <aside className="hero-side">
            <div className="hero-side__head">
              <span>◆ TOP PICKS THIS WEEK</span>
              <span className="blink">●</span>
            </div>
            <div className="hero-side__list">
              {topPicks
                .filter((p) => p._id !== hero._id)
                .slice(0, 4)
                .map((pick, i) => (
                  <Link
                    key={pick._id}
                    href={`/reviews/${pick.slug.current}`}
                    className="hero-side-item"
                  >
                    <span className="hero-side-item__num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="hero-side-item__title">{pick.title}</span>
                    <span className="hero-side-item__score">
                      {pick.reviewScore.toFixed(1)}
                    </span>
                  </Link>
                ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

import { HeartRow } from "@/components/retro/heart-row";
import { itemTypeToCat, scoreTone } from "@/lib/mappings";
import { HERO_TOP_RATED_QUERY, fetchOptions } from "@/lib/queries";
import type { Review } from "@/lib/types";
import { client } from "@/sanity/client";

// How far back "lately" reaches, and how many reviews that window has to hold
// before we trust it. Below MIN_POOL the list would render with one or two rows,
// so we widen to best-of-all-time instead.
const WINDOW_DAYS = 60;
const MIN_POOL = 5;

/** Midnight UTC, WINDOW_DAYS ago. Rounded to the day so the query params are
 *  stable and the `revalidate` fetch cache is not busted on every render. */
function windowStart(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - WINDOW_DAYS);
  return d.toISOString();
}

export default async function HeroSection() {
  const { recent, allTime } = await client.fetch<{
    recent: Review[];
    allTime: Review[];
  }>(HERO_TOP_RATED_QUERY, { cutoff: windowStart() }, fetchOptions);

  const pool = recent.length >= MIN_POOL ? recent : allTime;
  const isRecent = pool === recent;
  const hero = pool[0];

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
              <div className="hero-feature__overline">★ TOP RATED · {cat.toUpperCase()}</div>
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
              {/* Say what the list actually is. The old "THIS WEEK" heading sat
                  above reviews from the previous October for months. */}
              <span>◆ {isRecent ? "TOP RATED LATELY" : "TOP RATED"}</span>
              <span className="blink">●</span>
            </div>
            <div className="hero-side__list">
              {pool
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

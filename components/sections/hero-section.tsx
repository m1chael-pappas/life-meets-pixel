import Image from "next/image";
import Link from "next/link";

import { HeartRow } from "@/components/retro/heart-row";
import { getHeroPool } from "@/lib/content/hero-pool";
import { itemTypeToCat, scoreTone } from "@/lib/content/mappings";

export default async function HeroSection() {
  const { feature: hero, topTen } = await getHeroPool();

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
                {studio && ` · ${studio}`}
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
            <h2 className="hero-side__head">
              <span>◆ TOP 10 · ALL TIME</span>
              <span className="blink">●</span>
            </h2>
            <ol className="hero-top10">
              {topTen.map((pick, i) => (
                <li key={pick._id}>
                  <Link href={`/reviews/${pick.slug.current}`} className="hero-side-item">
                    <span className="hero-side-item__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="hero-side-item__title">{pick.reviewableItem.title}</span>
                    <span className="hero-side-item__score">{pick.reviewScore.toFixed(1)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}

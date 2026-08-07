import Image from "next/image";
import Link from "next/link";

import { HeartRow } from "@/components/retro/heart-row";
import { HPBar } from "@/components/retro/hp-bar";
import { getHeroPool } from "@/lib/hero-pool";
import { itemTypeToCat, scoreTone } from "@/lib/mappings";

/** Rows shown in the hero. The article page shows all of them; the hero is a
 *  teaser sitting in a fixed-height column, so it takes the first few. */
const HERO_BREAKDOWN_ROWS = 3;

export default async function HeroSection() {
  // Selection logic lives in lib/hero-pool so ReviewsSection can exclude
  // whatever the hero used. Next dedupes the shared fetch.
  const { pool, isRecent } = await getHeroPool();
  const hero = pool[0];

  if (!hero) {
    return null;
  }

  const item = hero.reviewableItem;
  const cat = itemTypeToCat(item.itemType);
  const studio = item.publisher || item.creator || "";
  const breakdown = (hero.scoreBreakdown ?? []).slice(0, HERO_BREAKDOWN_ROWS);
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
                    {/* The feature is rank 1, so the list starts at 2. It used
                        to restart at 01 beside the second-best score, which
                        made the whole ranking read one place too high. */}
                    <span className="hero-side-item__num">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <span className="hero-side-item__title">{pick.title}</span>
                    <span className="hero-side-item__score">
                      {pick.reviewScore.toFixed(1)}
                    </span>
                  </Link>
                ))}
            </div>

            {/* The proof panel. The homepage used to show seven colour-coded
                scores with no breakdown and no route to the published scale —
                on a site whose entire claim is auditable scoring. This fills
                the dead space the flexed list left at the bottom of the column
                and carries the only /about link in main. */}
            <div className="score-key">
              {breakdown.length > 0 && (
                <>
                  <span className="score-key__head">
                    ◆ HOW {hero.reviewScore.toFixed(1)} BREAKS DOWN
                  </span>
                  <div className="score-key__rows">
                    {breakdown.map((row) => (
                      <HPBar
                        key={row._key ?? row.label}
                        label={row.label}
                        score={row.score}
                      />
                    ))}
                  </div>
                </>
              )}
              <Link href="/about" className="score-key__link">
                <span className="score-key__bands">
                  <span className="score-key__band">
                    <i style={{ background: "var(--neon-3)" }} aria-hidden="true" />
                    8.0+
                  </span>
                  <span className="score-key__band">
                    <i style={{ background: "var(--neon-4)" }} aria-hidden="true" />
                    6.0&ndash;7.9
                  </span>
                  <span className="score-key__band">
                    <i style={{ background: "var(--heart)" }} aria-hidden="true" />
                    &lt;6.0
                  </span>
                </span>
                <span className="score-key__more">
                  {breakdown.length > 0
                    ? "How we score, and what each band means →"
                    : "Every score breaks down into the 3–5 things it is made of. Read the full scale →"}
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

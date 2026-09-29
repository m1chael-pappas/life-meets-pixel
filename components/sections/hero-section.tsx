import { Fragment, type CSSProperties } from "react";

import Link from "next/link";

import { CabArcadeBoss, ScoreStarburst, Sunburst, TwinkleStar } from "@/components/retro/arcade-art";
import { PixelHeart } from "@/components/retro/sprites";
import { getHeroPool } from "@/lib/content/hero-pool";
import { reviewTagline } from "@/lib/content/mappings";

/** Arcade rank labels for the ten High Scores rows, in rank order. */
const ORDINALS = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH", "9TH", "10TH"];

/**
 * Inline custom properties `.boss-title` sizes itself from: the longest word
 * (`--title-word`) and the total length (`--title-len`), both in characters.
 */
function titleFit(title: string): CSSProperties {
  const longestWord = Math.max(...title.split(/\s+/).map((word) => word.length));
  return { "--title-word": longestWord, "--title-len": title.length } as CSSProperties;
}

/**
 * A High Scores game name. Text after the first `": "` renders in an
 * inline-block `.hs-row__sub`, so a name that wraps breaks at its colon first.
 */
function ScoreName({ title }: { title: string }) {
  const cut = title.indexOf(": ");
  if (cut < 0) {
    return <span>{title}</span>;
  }
  return (
    <span>
      {title.slice(0, cut + 1)} <span className="hs-row__sub">{title.slice(cut + 2)}</span>
    </span>
  );
}

/**
 * The homepage hero: a boss screen for the feature review beside a High
 * Scores board of the all-time top ten, both from `getHeroPool()`. Renders
 * nothing when there is no feature review.
 */
export default async function HeroSection() {
  const { feature, topTen } = await getHeroPool();

  if (!feature) {
    return null;
  }

  const item = feature.reviewableItem;
  const gameTitle = item.title.trim();
  const publisher = (item.publisher || item.creator || "").trim();
  const score = feature.reviewScore;
  const hp = Math.round(score * 10);
  const meta = [gameTitle, publisher, `reviewed by ${feature.author.name}`].filter(Boolean);
  const tagline = reviewTagline(feature);

  return (
    <section className="boss-hero" aria-labelledby="boss-title">
      <Sunburst className="boss-hero__rays" />
      <div className="lmp-container boss-hero__grid">
        <div className="arcade-bezel arcade-bezel--cyan">
          <div className="arcade-screen boss-screen">
            <Sunburst className="arcade-screen__rays" />
            <div className="bricks" aria-hidden="true" />

            <div className="boss-hud">
              <span className="boss-hud__label" aria-hidden="true">
                BOSS
              </span>
              <div className="hp-bar" role="img" aria-label={`Score ${score.toFixed(1)} out of 10`}>
                <div className="hp-bar__fill" style={{ width: `${hp}%` }} />
              </div>
              <span className="boss-hud__pct" aria-hidden="true">
                {hp}%
              </span>
            </div>

            <div className="boss-copy">
              <p className="boss-kicker">
                ★ TOP RATED<span className="boss-kicker__sep"> · </span>BOSS STAGE
              </p>
              <h2 id="boss-title" className="extruded-title extruded-title--pink boss-title" style={titleFit(gameTitle)}>
                {gameTitle}
              </h2>
              <div className="score-burst" aria-hidden="true">
                <ScoreStarburst />
                <span className="score-burst__value">{score.toFixed(1)}</span>
                <span className="score-burst__label">SCORE</span>
              </div>
              {tagline && <p className="boss-quote">&quot;{tagline}&quot;</p>}
              <p className="boss-meta">
                {meta.map((part, i) => (
                  <Fragment key={i}>
                    {i > 0 && "\u00a0· "}
                    <span className="boss-meta__part">{part}</span>
                  </Fragment>
                ))}
              </p>
              <div className="boss-actions">
                <Link href={`/reviews/${feature.slug.current}`} className="retro-btn retro-btn--magenta retro-btn--solid">
                  ► PRESS START<span className="sr-only">: read the {gameTitle} review</span>
                </Link>
                <Link href="/reviews" className="retro-btn">
                  ALL REVIEWS
                </Link>
              </div>
            </div>

            <CabArcadeBoss className="boss-character" />
            <TwinkleStar className="twinkle twinkle--a" />
            <TwinkleStar className="twinkle twinkle--b" />

            <div className="p1-hud" aria-hidden="true">
              <span className="p1-hud__box">
                P1
                <span className="p1-hud__hearts">
                  <PixelHeart size={18} />
                  <PixelHeart size={18} />
                  <PixelHeart size={18} />
                </span>
              </span>
              <span className="p1-hud__box p1-hud__credits">CREDITS 01</span>
            </div>
            <div className="scanlines" aria-hidden="true" />
          </div>
        </div>

        <div className="arcade-bezel arcade-bezel--pink">
          <div className="arcade-screen hs-board">
            <p className="hs-board__kicker">◆ ALL-TIME TOP 10 ◆</p>
            <h2 className="extruded-title extruded-title--gold hs-board__title">HIGH SCORES</h2>
            <div className="hs-row hs-row--head" aria-hidden="true">
              <span>RANK</span>
              <span>GAME</span>
              <span>PTS</span>
            </div>
            <ol className="hs-list">
              {topTen.map((pick, i) => (
                <li key={pick._id}>
                  <Link href={`/reviews/${pick.slug.current}`} className="hs-row">
                    <span>{ORDINALS[i]}</span>
                    <ScoreName title={pick.reviewableItem.title.trim()} />
                    <span>{pick.reviewScore.toFixed(1)}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link href="/reviews?sort=score" className="hs-board__more">
              ► FULL TABLE
            </Link>
            <div className="scanlines" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

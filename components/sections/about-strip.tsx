import { SmilingGamepad, Sunburst } from "@/components/retro/arcade-art";

/** The character bio's joke stat rows: bar fill in percent, shown value and accent colour. */
const STATS = [
  { label: "HONESTY", fill: 100, value: "MAX", color: "var(--neon-3)" },
  { label: "NERD LEVEL", fill: 90, value: "99", color: "var(--neon-2)" },
  { label: "SPONSORS", fill: 0, value: "0", color: "var(--neon-1)" },
  { label: "PR FLUFF", fill: 0, value: "0", color: "var(--neon-4)" },
] as const;

/** The homepage character bio: a P1 portrait panel beside the greeting and the joke stat bars. */
export default function AboutStrip() {
  return (
    <section className="lmp-section--tight" aria-labelledby="bio-title">
      <div className="bio-card">
        <div className="bio-card__portrait" aria-hidden="true">
          <Sunburst className="bio-card__rays" />
          <SmilingGamepad className="bio-card__pad" />
          <span className="player-tag player-tag--cyan">P1</span>
        </div>
        <div className="bio-card__body">
          <p className="bio-card__kicker">CHARACTER BIO</p>
          <h2 id="bio-title" className="bio-card__title">
            <span className="bio-card__arrow" aria-hidden="true">►</span>
            G&apos;DAY, PLAYER.
          </h2>
          <p className="bio-card__text">
            I&apos;m a fellow nerd who spends too much time gaming, watching anime, reading comics, and tinkering
            with tech. Life Meets Pixel is where I share honest reviews: no sponsors, no PR fluff, just what I
            actually think.
          </p>
          <dl className="bio-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="bio-stat" style={{ color: stat.color }}>
                <dt>{stat.label}</dt>
                <dd>
                  <span className="hp-bar hp-bar--stat" aria-hidden="true">
                    <span className="hp-bar__fill" style={{ width: `${stat.fill}%` }} />
                  </span>
                  <span className="bio-stat__value">{stat.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

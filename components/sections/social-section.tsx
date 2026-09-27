import { RSS_CHANNEL, SOCIAL_CHANNELS } from "@/lib/site/constants";

/** The social tile grid: every channel in `SOCIAL_CHANNELS`, then the RSS feed. */
export function SocialTiles() {
  return (
    <div className="socials-grid">
      {[...SOCIAL_CHANNELS, RSS_CHANNEL].map((t) => (
        <a
          key={t.label}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-tile"
          style={{ color: t.color }}
        >
          <div className="social-tile__mark">{t.mark}</div>
          <div className="social-tile__name">{t.label.toUpperCase()}</div>
          <div className="social-tile__handle">{t.handle}</div>
        </a>
      ))}
    </div>
  );
}

export default function SocialSection() {
  return (
    <section className="lmp-section--tight">
      <div className="section-head">
        <div className="section-head__title">
          <span className="num">03</span>
          <h2>CONNECT WITH US</h2>
        </div>
      </div>
      <SocialTiles />
    </section>
  );
}

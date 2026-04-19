import { SITE_CONFIG } from "@/lib/constants";

type Tile = {
  name: string;
  mark: string;
  handle: string;
  href: string;
  variant: string;
};

const TILES: Tile[] = [
  {
    name: "DISCORD",
    mark: "DC",
    handle: "life_meets_pixel",
    href: SITE_CONFIG.social.discord,
    variant: "discord",
  },
  {
    name: "INSTAGRAM",
    mark: "IG",
    handle: "@life_meets_pixel",
    href: SITE_CONFIG.social.instagram,
    variant: "insta",
  },
  {
    name: "FACEBOOK",
    mark: "FB",
    handle: "Life Meets Pixel",
    href: SITE_CONFIG.social.facebook,
    variant: "fb",
  },
  {
    name: "RSS FEED",
    mark: "RSS",
    handle: "/feed.xml",
    href: "/feed.xml",
    variant: "rss",
  },
];

const VARIANT_COLOR: Record<string, string> = {
  discord: "#a3adf6",
  insta: "var(--neon-1)",
  fb: "var(--neon-2)",
  rss: "var(--neon-4)",
};

export default function SocialSection() {
  return (
    <section className="lmp-section--tight">
      <div className="section-head">
        <div className="section-head__title">
          <span className="num">04</span>
          <h2>CONNECT WITH US</h2>
        </div>
      </div>
      <div className="socials-grid">
        {TILES.map((t) => (
          <a
            key={t.name}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-tile"
            style={{ color: VARIANT_COLOR[t.variant] }}
          >
            <div className="social-tile__mark">{t.mark}</div>
            <div className="social-tile__name">{t.name}</div>
            <div className="social-tile__handle">{t.handle}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

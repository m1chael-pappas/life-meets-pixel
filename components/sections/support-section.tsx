import Link from "next/link";

import { HeartPlayerTwo, MarqueeWords, Sunburst } from "@/components/retro/arcade-art";

/**
 * The homepage membership pitch as a versus screen: P1 (the site's promise)
 * against P2 (the reader), split by a slanted `--neon-4` divider with a VS
 * coin on it. The divider, the pink ground's edge and the coin all derive
 * from `--vs-lean` and `--vs-slash`, so both sides of the divider stay
 * parallel at every width.
 */
export default function SupportSection() {
  return (
    <section className="lmp-section--tight" aria-labelledby="vs-title">
      <div className="vs-card">
        <div className="vs-card__p1">
          <span className="player-tag player-tag--cyan">P1 · READY</span>
          <p className="vs-card__lead">
            No sponsors.
            <br />
            No PR fluff.
          </p>
          <p className="vs-card__text">
            Members keep it that way: ad-free reading, comments, full-text RSS, and member-only posts.
          </p>
        </div>
        <div className="vs-card__p2">
          <div className="vs-card__ground" aria-hidden="true">
            <Sunburst className="vs-card__rays" />
          </div>
          <div className="vs-card__slash" aria-hidden="true" />
          <span className="vs-card__coin" aria-hidden="true">
            VS
          </span>
          <div className="vs-card__copy">
            <span className="player-tag player-tag--dark">P2 · ???</span>
            <h2 id="vs-title" className="extruded-title extruded-title--on-pink vs-card__title">
              <span className="sr-only">Player 2 wanted: </span>
              <MarqueeWords text="PRESS START" />
            </h2>
            <div className="vs-card__actions">
              <Link href="/membership" className="retro-btn retro-btn--dark">
                <span aria-hidden="true">♥</span> JOIN AS PLAYER 2
              </Link>
              <a
                href="https://ko-fi.com/lifemeetspixel"
                target="_blank"
                rel="noopener noreferrer"
                className="retro-btn retro-btn--solid retro-btn--lime"
              >
                ONE-OFF COFFEE
              </a>
            </div>
          </div>
          <HeartPlayerTwo className="vs-card__hero" />
        </div>
      </div>
    </section>
  );
}

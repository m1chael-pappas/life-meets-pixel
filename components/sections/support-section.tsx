import Link from "next/link";

export default function SupportSection() {
  return (
    <section className="lmp-section--tight">
      <div className="cta-strip">
        <div>
          {/* h2: the membership strip is its own section, not a sub-part of
              whatever precedes it. As an h3 it outlined as a child of NEWS &
              PREVIEWS. Styling is class-based, so the level change is
              invisible. */}
          <h2 className="cta-strip__title">◆ PLAYER 2 WANTED</h2>
          <p className="cta-strip__sub">
            No sponsors, no PR fluff. Members keep it that way: ad-free
            reading, comments, full-text RSS, and member-only posts.
          </p>
        </div>
        <div className="cta-strip__buttons">
          <Link href="/membership" className="retro-btn retro-btn--magenta">
            ♥ JOIN AS PLAYER 2
          </Link>
          <a
            href="https://ko-fi.com/lifemeetspixel"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-btn retro-btn--lime"
          >
            ☕ ONE-OFF COFFEE
          </a>
        </div>
      </div>
    </section>
  );
}

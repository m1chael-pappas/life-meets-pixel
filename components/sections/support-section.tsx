export default function SupportSection() {
  return (
    <section className="lmp-section--tight">
      <div className="cta-strip">
        <div>
          <h3 className="cta-strip__title">◆ SUPPORT THE MISSION</h3>
          <p className="cta-strip__sub">
            No sponsors, no ads in reviews — just honest takes. Help keep the lights on.
          </p>
        </div>
        <div className="cta-strip__buttons">
          <a
            href="https://www.buymeacoffee.com/lifemeetspixel"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-btn retro-btn--lime"
          >
            ☕ BUY US A COFFEE
          </a>
          <a
            href="https://patreon.com/lifemeetspixel"
            target="_blank"
            rel="noopener noreferrer"
            className="retro-btn retro-btn--magenta"
          >
            💖 BECOME A PATRON
          </a>
        </div>
      </div>
    </section>
  );
}

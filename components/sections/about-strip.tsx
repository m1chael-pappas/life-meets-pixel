export default function AboutStrip() {
  return (
    <section className="lmp-section--tight" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div className="about-strip">
        <div className="about-portrait" aria-hidden="true">
          🎮
        </div>
        <div className="about-text">
          <span className="greet">► G&apos;DAY, PLAYER.</span>
          I&apos;m a <strong>fellow nerd</strong> who spends too much time gaming, watching anime, reading comics,
          and tinkering with tech. Life Meets Pixel is where I share <strong>honest reviews</strong> — no
          sponsors, no PR fluff, just what I actually think.
        </div>
        <div className="about-pills">
          <span className="about-pill">HONEST REVIEWS</span>
          <span className="about-pill">PERSONAL TAKES</span>
          <span className="about-pill">GEEK-CENTRIC</span>
        </div>
      </div>
    </section>
  );
}

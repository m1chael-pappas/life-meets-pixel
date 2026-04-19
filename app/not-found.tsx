import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        className="lmp-container"
        style={{
          paddingTop: 80,
          paddingBottom: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-press-start-2p)",
            fontSize: 72,
            color: "var(--neon-1)",
            textShadow: "6px 6px 0 #000",
            marginBottom: 16,
            animation: "blink 1.6s steps(2) infinite",
          }}
        >
          404
        </div>
        <div
          style={{
            fontFamily: "var(--font-press-start-2p)",
            fontSize: 14,
            color: "var(--ink-dim)",
            marginBottom: 32,
          }}
        >
          ERROR · PIXEL_NOT_FOUND
        </div>

        <div
          className="stat-block"
          style={{ maxWidth: 560, margin: "0 auto 32px", textAlign: "left" }}
        >
          <h3>◆ DEBUG TRACE</h3>
          <div className="stat-row">
            <span className="lbl">STATUS</span>
            <span className="val">404</span>
          </div>
          <div className="stat-row">
            <span className="lbl">MESSAGE</span>
            <span className="val">Requested pixel does not exist</span>
          </div>
          <div className="stat-row">
            <span className="lbl">SUGGESTION</span>
            <span className="val" style={{ color: "var(--neon-3)" }}>
              Return to home screen
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="retro-btn retro-btn--magenta">
            ◉ RETURN HOME
          </Link>
          <Link href="/reviews" className="retro-btn">
            ★ BROWSE REVIEWS
          </Link>
          <Link href="/news" className="retro-btn retro-btn--lime">
            ▤ READ NEWS
          </Link>
        </div>
      </main>
    </>
  );
}

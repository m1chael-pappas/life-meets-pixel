import { notFound } from "next/navigation";

import type { SlidePayload } from "@/lib/social-templates";

// Dev-only showcase of the carousel slide templates with placeholder photos
// (picsum.photos). Visit http://localhost:3000/social-preview with `pnpm dev`.
// Production returns 404: this page exists purely to approve template work.

const pic = (seed: string, w = 1080, h = 1350) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const HANDLE = "@life_meets_pixel";

interface Deck {
  id: string;
  title: string;
  note: string;
  slides: SlidePayload[];
}

const DECKS: Deck[] = [
  {
    id: "review-grid",
    title: "Review — Grid Match (1a)",
    note: "Rotation A for reviews. Dark frame, cream panels, purple pills.",
    slides: [
      { t: "grid.hook", img: pic("keyart1"), pill: "Game Review", title: "Palworld 1.0: the meme grew up.", sub: "I bounced off it in early access. Then 1.0 killed the grind and ate my week.", cue: "swipe for the verdict" },
      { t: "grid.context", label: "WHAT IS IT", statement: "Open-world survival, creature capture, and a base that runs itself.", img: pic("gameplay1", 920, 500), body: "1.0 added a real endgame at the World Tree, fixed the jank, and rebalanced progression end to end." },
      { t: "grid.verdict", img: pic("verdictbg"), label: "THE VERDICT", points: [
        { sign: "+", text: "Grind is gone: progression finally respects your time" },
        { sign: "+", text: "World Tree endgame is a genuine 30-hour destination" },
        { sign: "+", text: "Base automation is the best in the genre right now" },
        { sign: "-", text: "Boss variety still thin past hour 40" },
      ], cue: "the score" },
      { t: "grid.score", kicker: "PALWORLD 1.0", score: "8.5", blurb: "Buy it if you dropped it in early access. It's a different game now." },
      { t: "grid.cta", title: "Agree with the 8.5?", sub: "Comment your score: hottest take gets pinned.", button: "💬 Drop your rating", handle: HANDLE },
    ],
  },
  {
    id: "review-hype",
    title: "Review — Hype Mode (1b)",
    note: "Rotation B for reviews. Full-bleed art, giant type, score tease.",
    slides: [
      { t: "hype.hook", img: pic("keyart2"), kicker: "GAME REVIEW", title: "I bounced off it. Then 1.0 fixed everything.", cue: "score at the end" },
      { t: "hype.fact", img: pic("gameplay2"), heading: "01 / The grind is dead", body: "Progression rebalanced end to end. What took 60 hours now takes 25, and it's the fun 25." },
      { t: "hype.fact", img: pic("boss1"), heading: "02 / A real endgame", body: "The World Tree is a 30-hour destination, not a credits screen. It ate my week." },
      { t: "hype.score", kicker: "PALWORLD 1.0", big: "8.5", button: "Play it now" },
      { t: "hype.cta", title: "New review every week", sub: "No scores bought. No jank forgiven.", button: `Follow ${HANDLE}` },
    ],
  },
  {
    id: "news-hype",
    title: "News — Hype Mode (2a)",
    note: "4 slides: hook → details → date card → share CTA.",
    slides: [
      { t: "hype.hook", img: pic("news1"), kicker: "Gaming News", kickerPill: true, title: "Belmont's Curse previews are glowing", cue: "everything we know" },
      { t: "hype.bullets", img: pic("news2"), heading: "What we know", items: [
        "You play Rose Belmont, 1499 Paris",
        "Whip-grapple traversal + combat",
        "Tarot Arcana build system",
        "First previews: \"the new Castlevania rules\"",
      ] },
      { t: "hype.date", label: "RELEASE DATE", big: "OCT 15", chips: ["PS5", "Switch", "PC"] },
      { t: "hype.cta", title: "Know a Castlevania fan?", sub: "Send them this. They'll owe you one.", button: "Share ➤", handle: HANDLE },
    ],
  },
  {
    id: "top5-grid",
    title: "Top 5 — Grid Match (2b)",
    note: "7 slides: hook → #5…#1 countdown → comment CTA.",
    slides: [
      { t: "grid.hook", img: pic("top5hook", 1080, 680), pill: "Top 5", title: "Top 5 games of 2026 (so far)", sub: "Ranked by our review scores. #1 surprised us.", cue: "start the countdown" },
      { t: "grid.rank", img: pic("rank5", 1080, 760), rank: "5", name: "Emberville", blurb: "Diablo meets Stardew: early access, already special. 7.5/10" },
      { t: "grid.rank", img: pic("rank4", 1080, 760), rank: "4", name: "Regions of Ruin: Runegate", blurb: "Gorgeous pixel art, compulsive settlement loop. 8/10" },
      { t: "grid.rank", img: pic("rank3", 1080, 760), rank: "3", name: "Palworld 1.0", blurb: "The meme grew up. It ate our week. 8.5/10" },
      { t: "grid.rank", img: pic("rank2", 1080, 760), rank: "2", name: "Hades III", blurb: "Supergiant three-peat. Combat has never felt better. 9/10" },
      { t: "grid.rank", img: pic("rank1", 1080, 760), rank: "1", name: "Hollow Knight: Silksong", blurb: "Worth every year of the wait. 9.5/10", top: true },
      { t: "grid.cta", title: "Wrong order?", sub: "Comment your top 5: best list gets featured in our next post.", button: "💬 Rank yours", handle: HANDLE, cream: true },
    ],
  },
  {
    id: "hottake-hype",
    title: "Hot Take — Hype Mode (2c)",
    note: "4 slides: the take → the argument → the receipts → fight-me CTA.",
    slides: [
      { t: "hype.score", kicker: "HOT TAKE", big: "!", button: "hear me out" },
      { t: "hype.bullets", img: pic("take1"), heading: "The argument", items: [
        "A number implies a finished product. Early access is a promise, not a product.",
        "Scores stick. Palworld carried its EA jank reputation for two years after fixing it.",
        "Impressions, not verdicts: score at 1.0 or don't score at all.",
      ] },
      { t: "hype.fact", img: pic("take2"), heading: "Exhibit A", body: "Palworld: 6/10 at early access. 8.5/10 at launch. Same game, two years apart. One number followed it everywhere." },
      { t: "hype.cta", title: "Am I wrong?", sub: "Comments are open. Bring receipts.", button: `Follow ${HANDLE}` },
    ],
  },
  {
    id: "review-zine",
    title: "Review — Editorial Zine (1c, benched)",
    note: "The third direction, kept implemented in case rotation data wants it.",
    slides: [
      { t: "zine.cover", img: pic("zine1", 920, 560), label: "GAME REVIEW", issue: "№ 24", title: "Is Palworld finally worth your time?", cue: "the honest answer inside" },
      { t: "zine.summary", label: "02 — THE SHORT VERSION", body: "Early access was a meme with a grind problem. Version 1.0 is a different game: the jank is gone, the pacing works, and the endgame exists.", quote: "\"It ate my week, and I don't want it back.\"", handle: HANDLE },
      { t: "zine.stats", img: pic("zine2"), label: "03 — IN NUMBERS", cells: [
        { big: "25h", small: "to the endgame, down from 60" },
        { big: "30h", small: "of World Tree endgame content" },
        { big: "140+", small: "Pals at launch" },
        { big: "$0", small: "upgrade cost from early access" },
      ] },
      { t: "zine.verdict", label: "04 — VERDICT", score: "8.5", blurb: "Buy it if you bounced off early access. Skip it only if creature-collectors were never your thing." },
      { t: "zine.save", label: "SAVE THIS", title: "Deciding later? Save this review.", button: "🔖 Tap save → collection", foot: `full written review: link in bio · ${HANDLE}` },
    ],
  },
];

const SCALE = 0.22;

export default function SocialPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main style={{ background: "#161419", minHeight: "100vh", padding: 40, color: "#f6efe2", fontFamily: "monospace" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Carousel template showcase</h1>
      <p style={{ color: "#9c94a8", marginBottom: 32, fontSize: 14 }}>
        Placeholder photos via picsum.photos. Each frame is the exact 1080×1350 render the pipeline will screenshot.
      </p>
      {DECKS.map((deck) => (
        <section key={deck.id} style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, color: "#a88bff", marginBottom: 4 }}>{deck.title}</h2>
          <p style={{ color: "#9c94a8", fontSize: 13, marginBottom: 16 }}>{deck.note}</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {deck.slides.map((slide, i) => (
              <div
                key={i}
                style={{
                  width: 1080 * SCALE,
                  height: 1350 * SCALE,
                  overflow: "hidden",
                  border: "1px solid #2a2632",
                  borderRadius: 6,
                }}
              >
                <iframe
                  src={`/social-template?p=${encodeURIComponent(JSON.stringify(slide))}`}
                  style={{
                    width: 1080,
                    height: 1350,
                    border: 0,
                    transform: `scale(${SCALE})`,
                    transformOrigin: "top left",
                  }}
                  title={`${deck.id}-${i}`}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

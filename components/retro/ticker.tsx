import { client } from "@/sanity/client";
import { fetchOptions } from "@/lib/queries";

const TICKER_QUERY = `*[
  _type == "review"
  && defined(slug.current)
]|order(publishedAt desc)[0...10]{
  _id,
  title,
  reviewScore
}`;

type TickerReview = { _id: string; title: string; reviewScore: number };

function tickerLine(r: TickerReview) {
  return `${r.title} — ${r.reviewScore.toFixed(1)}/10`;
}

export async function Ticker() {
  let items: string[] = [];
  try {
    const recent = await client.fetch<TickerReview[]>(TICKER_QUERY, {}, fetchOptions);
    items = recent.map(tickerLine);
  } catch {
    items = [];
  }

  if (items.length === 0) {
    items = [
      "Welcome to Life Meets Pixel",
      "Honest reviews · no sponsors · no PR fluff",
      "Press START to continue",
    ];
  }

  // Duplicate for seamless CSS scroll-left wrap
  const repeat = [...items, ...items, ...items];

  return (
    <div className="lmp-ticker" aria-label="Latest reviews ticker">
      <div className="lmp-ticker__label">▶ LIVE FEED</div>
      <div className="lmp-ticker__track">
        {repeat.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}

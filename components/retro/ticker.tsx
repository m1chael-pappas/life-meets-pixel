import { TICKER_QUERY, fetchOptions } from "@/lib/queries";
import { client } from "@/sanity/client";

import { TickerBar, type TickerItem } from "./ticker-bar";

type TickerReview = {
  _id: string;
  title: string;
  reviewScore: number;
  slug: string;
};

export async function Ticker() {
  let items: TickerItem[] = [];
  try {
    const recent = await client.fetch<TickerReview[]>(TICKER_QUERY, {}, fetchOptions);
    items = recent
      .filter((r) => r.slug)
      .map((r) => ({
        text: `${r.title} — ${r.reviewScore.toFixed(1)}/10`,
        href: `/reviews/${r.slug}`,
      }));
  } catch {
    items = [];
  }

  // Brand lines when the fetch fails or the site has no reviews yet. These have
  // no href and render as plain text rather than dead links.
  if (items.length === 0) {
    items = [
      { text: "Welcome to Life Meets Pixel" },
      { text: "Honest reviews · no sponsors · no PR fluff" },
      { text: "Press START to continue" },
    ];
  }

  return <TickerBar items={items} />;
}

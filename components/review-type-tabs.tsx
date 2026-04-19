import Link from "next/link";

import { CAT_LABELS, ITEM_TYPES, itemTypeToCat } from "@/lib/mappings";
import type { ReviewableItem } from "@/lib/types";

type Counts = Partial<Record<ReviewableItem["itemType"] | "all", number>>;

interface ReviewTypeTabsProps {
  currentType?: string;
  counts?: Counts;
}

export default function ReviewTypeTabs({ currentType, counts }: ReviewTypeTabsProps) {
  return (
    <div className="filters-bar" aria-label="Filter reviews by category">
      <Link
        href="/reviews"
        className={`filter-btn ${!currentType ? "is-on" : ""}`}
        aria-current={!currentType ? "page" : undefined}
      >
        ALL
        {counts?.all !== undefined && <span className="filter-count">{counts.all}</span>}
      </Link>
      {ITEM_TYPES.map((t) => {
        const cat = itemTypeToCat(t);
        const label = CAT_LABELS[cat];
        const count = counts?.[t];
        return (
          <Link
            key={t}
            href={`/reviews?type=${t}`}
            className={`filter-btn ${currentType === t ? "is-on" : ""}`}
            aria-current={currentType === t ? "page" : undefined}
          >
            {label}
            {typeof count === "number" && <span className="filter-count">{count}</span>}
          </Link>
        );
      })}
    </div>
  );
}

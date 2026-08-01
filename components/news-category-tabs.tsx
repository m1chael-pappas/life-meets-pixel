import Link from "next/link";

export type NewsCategoryCount = {
  title: string;
  slug: string;
  color?: string | null;
  count: number;
};

interface NewsCategoryTabsProps {
  currentCategory?: string;
  all: number;
  categories: NewsCategoryCount[];
}

/**
 * Mirrors ReviewTypeTabs so the two listings filter the same way. The query
 * already drops zero-count categories, so every chip here leads somewhere.
 */
export default function NewsCategoryTabs({
  currentCategory,
  all,
  categories,
}: NewsCategoryTabsProps) {
  if (categories.length === 0) return null;

  return (
    <div className="filters-bar" aria-label="Filter news by category">
      <Link
        href="/news"
        className={`filter-btn ${!currentCategory ? "is-on" : ""}`}
        aria-current={!currentCategory ? "page" : undefined}
      >
        ALL
        <span className="filter-count">{all}</span>
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/news?category=${c.slug}`}
          className={`filter-btn ${currentCategory === c.slug ? "is-on" : ""}`}
          aria-current={currentCategory === c.slug ? "page" : undefined}
        >
          {c.title.toUpperCase()}
          <span className="filter-count">{c.count}</span>
        </Link>
      ))}
    </div>
  );
}

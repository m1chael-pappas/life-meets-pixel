/**
 * Revision dates for the legal documents.
 *
 * These pages used to stamp `new Date()`, so each one claimed to have been
 * revised today, every day. That is not a rendering quirk — "Last updated" is a
 * factual claim about when the terms changed, and it drives whether a reader
 * needs to re-read them.
 *
 * Tying it to the financial year was considered and rejected: rolling the date
 * to 1 July asserts a revision that did not happen, and it understates a real
 * amendment made mid-year. A hard date per document is the only version that is
 * true.
 *
 * The initial values come from the git history rather than a guess. All four
 * documents were written on 2025-11-01; the commits since (2025-12-03 UI
 * refactor, 2026-07-16 a11y pass, 2026-08-08 cache migration) were verified to
 * have changed markup and styling only, with no edit to a single sentence of
 * the terms.
 *
 * **Bump the entry when you change the words, and only then.** A styling pass
 * over these files is not a revision.
 */
export const LEGAL_REVISED = {
  terms: "2025-11-01",
  privacy: "2025-11-01",
  affiliate: "2025-11-01",
} as const;

export type LegalDoc = keyof typeof LEGAL_REVISED;

/**
 * en-AU, matching `<html lang>`, the OG locale and every `inLanguage` on the
 * site — so "1 November 2025", not the American "November 1, 2025" these pages
 * previously rendered.
 *
 * Formatting a fixed ISO string is deterministic, so unlike the `new Date()`
 * it replaces this prerenders cleanly under Cache Components with no caching
 * needed.
 */
export function formatRevised(doc: LegalDoc): string {
  return new Date(`${LEGAL_REVISED[doc]}T00:00:00Z`).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** The most recent revision across all documents, for the legal index. */
export function formatLatestRevised(): string {
  const latest = (Object.keys(LEGAL_REVISED) as LegalDoc[]).reduce((a, b) =>
    LEGAL_REVISED[a] >= LEGAL_REVISED[b] ? a : b
  );
  return formatRevised(latest);
}

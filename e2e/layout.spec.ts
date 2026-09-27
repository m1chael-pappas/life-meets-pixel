import { expect, test, type Page } from "@playwright/test";

/**
 * Layout rules checked on real pages at phone, tablet and desktop widths.
 * They assert properties (no sideways scroll, legible text, tappable targets,
 * one h1, alt text, three-line card excerpts) instead of comparing pixels, so
 * they hold as Sanity content, the ticker and the clock change.
 */

const VIEWPORTS = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

const STATIC_PAGES = ["/", "/reviews", "/news", "/about", "/contact", "/membership", "/legal/privacy", "/this-page-does-not-exist"];

/** The legibility floor from DESIGN.md. */
const MIN_TEXT_PX = 11;
/** WCAG 2.2 AA 2.5.8 target size minimum. */
const MIN_TARGET_PX = 24;

interface LayoutReport {
  scrollWidth: number;
  innerWidth: number;
  smallText: string[];
  smallTargets: string[];
  h1Count: number;
  imagesWithoutAlt: string[];
  overlongExcerpts: string[];
}

async function inspect(page: Page): Promise<LayoutReport> {
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate(
    ({ minText, minTarget }) => {
      const visible = (el: Element) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
      };
      const describe = (el: Element) =>
        `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 2).join(".")} "${(el.textContent ?? "").trim().slice(0, 30)}"`;
      /** Third-party UI (Clerk) and screen-reader-only text are outside the site's own rules. */
      const exempt = (el: Element) => Boolean(el.closest('[class*="cl-"], .sr-only, [aria-hidden="true"]'));

      const smallText = [...document.querySelectorAll("body *")]
        .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim()))
        .filter((el) => visible(el) && !exempt(el))
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) < minText)
        .map((el) => `${getComputedStyle(el).fontSize} ${describe(el)}`);

      const smallTargets = [...document.querySelectorAll("a[href], button, input:not([type=hidden]), select, textarea")]
        .filter((el) => visible(el) && !exempt(el))
        .filter((el) => !(getComputedStyle(el).display === "inline" && el.closest("p, li, figcaption, td")))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width < minTarget || r.height < minTarget;
        })
        .map((el) => {
          const r = el.getBoundingClientRect();
          return `${Math.round(r.width)}x${Math.round(r.height)} ${describe(el)}`;
        });

      const overlongExcerpts = [...document.querySelectorAll(".review-card__excerpt, .news-card__excerpt")]
        .filter(visible)
        .filter((el) => {
          const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(getComputedStyle(el).fontSize) * 1.55;
          return el.getBoundingClientRect().height > lineHeight * 3 + 1;
        })
        .map(describe);

      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        smallText,
        smallTargets,
        h1Count: document.querySelectorAll("h1").length,
        imagesWithoutAlt: [...document.images].filter((i) => visible(i) && !i.hasAttribute("alt")).map((i) => i.src),
        overlongExcerpts,
      };
    },
    { minText: MIN_TEXT_PX, minTarget: MIN_TARGET_PX },
  );
}

async function firstLink(page: Page, listing: string, prefix: string): Promise<string> {
  await page.goto(listing);
  const href = await page.locator(`main a[href^="${prefix}"]`).first().getAttribute("href");
  if (!href) throw new Error(`no ${prefix} link on ${listing}`);
  return href;
}

for (const viewport of VIEWPORTS) {
  test.describe(`layout at ${viewport.width}px (${viewport.name})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    const check = async (page: Page, path: string) => {
      await page.goto(path);
      const report = await inspect(page);
      expect.soft(report.scrollWidth, `${path} scrolls sideways`).toBeLessThanOrEqual(report.innerWidth);
      expect.soft(report.smallText, `${path} text under ${MIN_TEXT_PX}px`).toEqual([]);
      expect.soft(report.smallTargets, `${path} targets under ${MIN_TARGET_PX}px`).toEqual([]);
      expect.soft(report.h1Count, `${path} h1 count`).toBe(1);
      expect.soft(report.imagesWithoutAlt, `${path} images without alt`).toEqual([]);
      expect.soft(report.overlongExcerpts, `${path} excerpts over three lines`).toEqual([]);
    };

    for (const path of STATIC_PAGES) {
      test(path, async ({ page }) => check(page, path));
    }

    test("newest review", async ({ page }) => check(page, await firstLink(page, "/reviews", "/reviews/")));
    test("newest news post", async ({ page }) => check(page, await firstLink(page, "/news", "/news/")));
  });
}

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PUBLISH_TAGS, TAGS } from "@/lib/content/cache-tags";

const cache = vi.hoisted(() => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }));
vi.mock("next/cache", () => cache);

/** Document types that never render on the public site, so a webhook for them needs no page refresh. */
const NOT_RENDERED = new Set(["storyCandidate"]);

const SCHEMA_DIR = join(__dirname, "../../../studio/schemaTypes");

/** Every `type: 'document'` declared in the Studio schema, by name. */
function studioDocumentTypes(): string[] {
  return readdirSync(SCHEMA_DIR)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .flatMap((f) => {
      const source = readFileSync(join(SCHEMA_DIR, f), "utf8").replace(/\s+/g, " ");
      const m = source.match(/defineType\(\{\s*name:\s*['"](\w+)['"].*?type:\s*['"](\w+)['"]/);
      return m && m[2] === "document" ? [m[1]] : [];
    });
}

async function loadRoute() {
  vi.resetModules();
  return import("./route");
}

function webhook(body: unknown, secret = "right") {
  return new NextRequest(`https://lifemeetspixel.com/api/revalidate?secret=${secret}`, {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const paths = () => cache.revalidatePath.mock.calls.map(([p]) => p);
const tags = () => cache.revalidateTag.mock.calls.map(([t]) => t);

beforeEach(() => vi.stubEnv("REVALIDATE_SECRET", "right"));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("/api/revalidate", () => {
  it("rejects a missing or wrong secret without revalidating anything", async () => {
    const { POST, GET } = await loadRoute();
    expect((await POST(webhook({ _type: "review" }, "wrong"))).status).toBe(401);
    const get = new NextRequest("https://lifemeetspixel.com/api/revalidate?path=/");
    expect((await GET(get)).status).toBe(401);
    vi.stubEnv("REVALIDATE_SECRET", "");
    const unset = await loadRoute();
    expect((await unset.POST(webhook({ _type: "review" }, ""))).status).toBe(401);
    expect(cache.revalidatePath).not.toHaveBeenCalled();
  });

  it("refreshes a review, its listing, the homepage and both feeds", async () => {
    const { POST } = await loadRoute();
    await POST(webhook({ _type: "review", slug: { current: "lost-judgment-review" } }));
    expect(paths()).toEqual(
      expect.arrayContaining(["/reviews/lost-judgment-review", "/reviews", "/", "/sitemap.xml", "/feed.xml"]),
    );
    expect(tags()).toEqual(expect.arrayContaining([TAGS.reviews, TAGS.feeds]));
  });

  it("refreshes a news post, its listing, the homepage and both feeds", async () => {
    const { POST } = await loadRoute();
    await POST(webhook({ _type: "newsPost", slug: { current: "some-post" } }));
    expect(paths()).toEqual(expect.arrayContaining(["/news/some-post", "/news", "/", "/sitemap.xml", "/feed.xml"]));
    expect(tags()).toEqual(expect.arrayContaining([TAGS.news, TAGS.feeds]));
  });

  it("refreshes an author page and every tag", async () => {
    const { POST } = await loadRoute();
    await POST(webhook({ _type: "author", slug: { current: "michael" } }));
    expect(paths()).toEqual(expect.arrayContaining(["/author/michael", "/"]));
    expect(tags()).toEqual(expect.arrayContaining([...PUBLISH_TAGS]));
  });

  it.each(studioDocumentTypes().filter((t) => !NOT_RENDERED.has(t)))(
    "handles the Studio document type %s explicitly, not through the homepage-only fallback",
    async (type) => {
      const { POST } = await loadRoute();
      await POST(webhook({ _type: type, slug: { current: "x" } }));
      expect(paths()).not.toEqual(["/"]);
    },
  );

  it("finds the Studio schema, so the check above is not vacuous", () => {
    expect(studioDocumentTypes()).toEqual(expect.arrayContaining(["review", "newsPost", "author", "storyCandidate"]));
  });

  it("answers 500 on a body that is not JSON", async () => {
    const { POST } = await loadRoute();
    expect((await POST(webhook("not json"))).status).toBe(500);
  });
});

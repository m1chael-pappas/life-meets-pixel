import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST as vote } from "./vote/route";
import { DELETE, POST } from "./route";

interface SqlCall {
  text: string;
  values: unknown[];
}

const mocks = vi.hoisted(() => {
  const calls: SqlCall[] = [];
  const results: unknown[][] = [];
  const sql = (strings: TemplateStringsArray, ...values: unknown[]) => {
    calls.push({ text: strings.join("?").replace(/\s+/g, " ").trim(), values });
    return Promise.resolve(results.shift() ?? []);
  };
  return { calls, results, sql, getMembership: vi.fn(), currentUser: vi.fn() };
});

vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: vi.fn(),
}));
vi.mock("@/lib/comments-db", () => ({
  commentsEnabled: () => true,
  ensureSchema: async () => undefined,
  db: () => mocks.sql,
}));
vi.mock("@/lib/membership", () => ({
  getMembership: mocks.getMembership,
  MEMBER_FEATURES: { adFree: "ad_free", comments: "comments", fullRss: "full_rss", memberPosts: "member_posts" },
}));
vi.mock("@clerk/nextjs/server", () => ({ currentUser: mocks.currentUser }));
vi.mock("@/lib/telegram", () => ({ escapeHtml: (s: string) => s, sendMessage: vi.fn() }));
vi.mock("@/sanity/client", () => ({ client: { fetch: vi.fn() } }));

type Features = string[];

function as(userId: string | null, { features = [] as Features, isAdmin = false } = {}) {
  mocks.getMembership.mockResolvedValue({
    userId,
    isAdmin,
    isMember: features.length > 0,
    hasFeature: (f: string) => isAdmin || features.includes(f),
  });
}

function request(method: string, url: string, body?: unknown) {
  return new NextRequest(`https://lifemeetspixel.com${url}`, {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body), headers: { "content-type": "application/json" } }),
  });
}

beforeEach(() => {
  mocks.calls.length = 0;
  mocks.results.length = 0;
  mocks.currentUser.mockResolvedValue({ fullName: "Test Member", imageUrl: null });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/comments", () => {
  const comment = { postId: "review-judgment", body: "  Great review.  " };

  it("asks a signed-out visitor to sign in and writes nothing", async () => {
    as(null);
    const res = await POST(request("POST", "/api/comments", comment));
    expect(res.status).toBe(401);
    expect(mocks.calls).toHaveLength(0);
  });

  it("refuses a signed-in user without the comments perk and points to /membership", async () => {
    as("user_free");
    const res = await POST(request("POST", "/api/comments", comment));
    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toMatchObject({ upgrade: "/membership" });
    expect(mocks.calls).toHaveLength(0);
  });

  it("stores a member's comment under their own id, trimmed", async () => {
    as("user_member", { features: ["comments"] });
    mocks.results.push([{ id: 7 }]);
    const res = await POST(request("POST", "/api/comments", { ...comment, userId: "user_someone_else" }));
    expect(res.status).toBe(201);
    const insert = mocks.calls.find((c) => c.text.startsWith("INSERT INTO comments"));
    expect(insert?.values).toEqual(["review-judgment", "user_member", "Test Member", null, "Great review."]);
  });

  it.each([
    ["too short", "x"],
    ["too long", "x".repeat(2001)],
  ])("rejects a comment that is %s", async (_, body) => {
    as("user_member", { features: ["comments"] });
    const res = await POST(request("POST", "/api/comments", { postId: "review-judgment", body }));
    expect(res.status).toBe(400);
    expect(mocks.calls).toHaveLength(0);
  });
});

describe("DELETE /api/comments", () => {
  it("rejects a signed-out visitor", async () => {
    as(null);
    expect((await DELETE(request("DELETE", "/api/comments?id=7"))).status).toBe(401);
    expect(mocks.calls).toHaveLength(0);
  });

  it("rejects an id that is not a number before touching the database", async () => {
    as("user_member", { features: ["comments"] });
    expect((await DELETE(request("DELETE", "/api/comments?id=7;DROP"))).status).toBe(400);
    expect(mocks.calls).toHaveLength(0);
  });

  it("only lets a member delete their own comment", async () => {
    as("user_member", { features: ["comments"] });
    mocks.results.push([]);
    const res = await DELETE(request("DELETE", "/api/comments?id=7"));
    expect(res.status).toBe(404);
    expect(mocks.calls[0].text).toContain("AND user_id =");
    expect(mocks.calls[0].values).toEqual([7, "user_member"]);
  });

  it("lets an admin delete any comment", async () => {
    as("user_admin", { isAdmin: true });
    mocks.results.push([{ id: 7 }]);
    const res = await DELETE(request("DELETE", "/api/comments?id=7"));
    expect(res.status).toBe(200);
    expect(mocks.calls[0].text).not.toContain("user_id");
    expect(mocks.calls[0].values).toEqual([7]);
  });
});

describe("POST /api/comments/vote", () => {
  it("asks a signed-out visitor to sign in", async () => {
    as(null);
    expect((await vote(request("POST", "/api/comments/vote", { commentId: 7, value: 1 }))).status).toBe(401);
    expect(mocks.calls).toHaveLength(0);
  });

  it("lets any signed-in user vote, with no membership needed", async () => {
    as("user_free");
    mocks.results.push([], [{ likes: 1, dislikes: 0 }]);
    const res = await vote(request("POST", "/api/comments/vote", { commentId: 7, value: 1 }));
    expect(res.status).toBe(200);
    expect(mocks.calls[0].values).toEqual([7, "user_free", 1, 1]);
  });

  it.each([2, "1", null])("rejects the vote value %j", async (value) => {
    as("user_free");
    const res = await vote(request("POST", "/api/comments/vote", { commentId: 7, value }));
    expect(res.status).toBe(400);
    expect(mocks.calls).toHaveLength(0);
  });
});

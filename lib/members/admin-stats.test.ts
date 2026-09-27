import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getSubscriptionStats, getUserStats, loadAdminDashboard } from "@/lib/members/admin-stats";

const mocks = vi.hoisted(() => ({
  getCount: vi.fn(),
  getUserList: vi.fn(),
  commentsEnabled: vi.fn(() => false),
  getEngagementStats: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: async () => ({ users: { getCount: mocks.getCount, getUserList: mocks.getUserList } }),
}));
vi.mock("next/server", () => ({ connection: async () => undefined }));
vi.mock("@/lib/members/comments-db", () => ({
  commentsEnabled: mocks.commentsEnabled,
  getEngagementStats: mocks.getEngagementStats,
}));

const DAY = 86_400_000;
const NOW = Date.UTC(2026, 8, 27, 12);

const money = (amount: number) => ({ amount, currency_symbol: "$" });
const PLAYER_2 = { name: "Player 2", fee: money(499), annual_monthly_fee: money(408) };
const BOSS = { name: "Boss", fee: money(999), annual_monthly_fee: money(833) };

function item(overrides: Record<string, unknown>) {
  return {
    status: "active",
    plan_period: "month",
    is_free_trial: false,
    canceled_at: null,
    ended_at: null,
    plan: PLAYER_2,
    ...overrides,
  };
}

function respondWith(...pages: unknown[][]) {
  const fetchMock = vi.fn();
  for (const data of pages) {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data }), { status: 200 }));
  }
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.stubEnv("CLERK_SECRET_KEY", "sk_test_stub");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("getSubscriptionStats", () => {
  it("sorts every item state into the right bucket", async () => {
    respondWith([
      item({}),
      item({ plan_period: "annual" }),
      item({ is_free_trial: true }),
      item({ plan: BOSS, canceled_at: NOW - 2 * DAY }),
      item({ status: "past_due" }),
      item({ status: "ended", ended_at: NOW - 5 * DAY }),
      item({ status: "ended", ended_at: NOW - 45 * DAY }),
      item({ status: "canceled", canceled_at: NOW - 2 * DAY }),
      item({ status: "expired", ended_at: NOW - 29 * DAY }),
      item({ plan: null }),
    ]);

    const stats = await getSubscriptionStats(NOW);

    expect(stats.paying).toBe(4);
    expect(stats.freeTrials).toBe(1);
    expect(stats.pastDue).toBe(1);
    expect(stats.cancelling).toBe(1);
    expect(stats.endedLast30Days).toBe(3);
    expect(stats.byPlan).toEqual([
      { plan: "Player 2", monthly: 1, annual: 1 },
      { plan: "Boss", monthly: 1, annual: 0 },
      { plan: "Unknown plan", monthly: 1, annual: 0 },
    ]);
  });

  it("normalises annual plans to their monthly equivalent and ignores trials", async () => {
    respondWith([
      item({}),
      item({ plan_period: "annual" }),
      item({ plan: BOSS }),
      item({ is_free_trial: true, plan: BOSS }),
      item({ status: "past_due", plan: BOSS }),
    ]);
    const stats = await getSubscriptionStats(NOW);
    expect(stats.monthlyRevenueCents).toBe(499 + 408 + 999);
    expect(stats.currencySymbol).toBe("$");
  });

  it("pages through every result with the pinned API version", async () => {
    const fetchMock = respondWith(Array.from({ length: 500 }, () => item({})), [item({})]);
    const stats = await getSubscriptionStats(NOW);

    expect(stats.paying).toBe(501);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [first, second] = fetchMock.mock.calls.map(([url]) => new URL(String(url)));
    expect(first.searchParams.get("offset")).toBe("0");
    expect(second.searchParams.get("offset")).toBe("500");
    expect(first.searchParams.get("payer_type")).toBe("user");
    expect(first.searchParams.get("include_free")).toBe("false");
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.headers).toMatchObject({
      Authorization: "Bearer sk_test_stub",
      "Clerk-API-Version": "2026-05-12",
    });
  });

  it("throws on a non-OK response instead of reporting zeros", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 403 })));
    await expect(getSubscriptionStats(NOW)).rejects.toThrow("403");
  });
});

describe("getUserStats", () => {
  it("counts sign-ups in the 7 and 30 day windows and names the newest users", async () => {
    mocks.getCount.mockResolvedValue(42);
    mocks.getUserList.mockImplementation(async (params: { createdAtAfter?: number; orderBy?: string }) => {
      if (params.createdAtAfter === NOW - 7 * DAY) return { data: [], totalCount: 3 };
      if (params.createdAtAfter === NOW - 30 * DAY) return { data: [], totalCount: 9 };
      if (params.orderBy === "-created_at") {
        return {
          data: [
            { id: "u1", firstName: "Ada", lastName: "Lovelace", username: null, createdAt: NOW },
            { id: "u2", firstName: null, lastName: null, username: "pixelfan", createdAt: NOW - DAY },
            { id: "u3", firstName: null, lastName: null, username: null, createdAt: NOW - 2 * DAY },
          ],
          totalCount: 42,
        };
      }
      throw new Error(`unexpected params ${JSON.stringify(params)}`);
    });

    const stats = await getUserStats(NOW);

    expect(stats).toMatchObject({ total: 42, last7Days: 3, last30Days: 9 });
    expect(stats.recent.map((u) => u.name)).toEqual(["Ada Lovelace", "pixelfan", "(no name)"]);
  });
});

describe("loadAdminDashboard", () => {
  it("keeps the other panels when one source fails", async () => {
    mocks.getCount.mockRejectedValue(new Error("clerk down"));
    mocks.getUserList.mockRejectedValue(new Error("clerk down"));
    respondWith([item({})]);

    const dashboard = await loadAdminDashboard();

    expect(dashboard.users.status).toBe("rejected");
    expect(dashboard.subscriptions.status).toBe("fulfilled");
    expect(dashboard.engagement).toMatchObject({ status: "rejected" });
    expect(String((dashboard.engagement as PromiseRejectedResult).reason)).toContain("DATABASE_URL");
  });
});

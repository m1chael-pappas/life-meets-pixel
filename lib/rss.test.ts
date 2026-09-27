import { afterEach, describe, expect, it, vi } from "vitest";

import { userHasPaidSubscription, userIdForRssToken } from "@/lib/rss";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  getUserBillingSubscription: vi.fn(),
  db: vi.fn(),
  ensureSchema: vi.fn(async () => undefined),
}));

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: async () => ({
    users: { getUser: mocks.getUser },
    billing: { getUserBillingSubscription: mocks.getUserBillingSubscription },
  }),
}));
vi.mock("@/lib/comments-db", () => ({
  commentsEnabled: () => true,
  db: () => mocks.db,
  ensureSchema: mocks.ensureSchema,
}));

const member = { publicMetadata: {} };
const paidItem = { status: "active", plan: { isDefault: false } };
const freeItem = { status: "active", plan: { isDefault: true } };

afterEach(() => {
  vi.clearAllMocks();
});

describe("userHasPaidSubscription", () => {
  it("comps admins without asking billing", async () => {
    mocks.getUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
    await expect(userHasPaidSubscription("user_admin")).resolves.toBe(true);
    expect(mocks.getUserBillingSubscription).not.toHaveBeenCalled();
  });

  it("grants an active subscription with an active paid item", async () => {
    mocks.getUser.mockResolvedValue(member);
    mocks.getUserBillingSubscription.mockResolvedValue({
      status: "active",
      subscriptionItems: [freeItem, paidItem],
    });
    await expect(userHasPaidSubscription("user_member")).resolves.toBe(true);
  });

  it.each([
    ["no subscription", null],
    ["a subscription that is not active", { status: "past_due", subscriptionItems: [paidItem] }],
    ["only the free default plan", { status: "active", subscriptionItems: [freeItem] }],
    ["a paid item that has ended", { status: "active", subscriptionItems: [{ ...paidItem, status: "ended" }] }],
    ["an item with no plan", { status: "active", subscriptionItems: [{ status: "active", plan: null }] }],
    ["no items at all", { status: "active" }],
  ])("denies %s", async (_, subscription) => {
    mocks.getUser.mockResolvedValue(member);
    mocks.getUserBillingSubscription.mockResolvedValue(subscription);
    await expect(userHasPaidSubscription("user_x")).resolves.toBe(false);
  });

  it("fails closed when Clerk errors", async () => {
    mocks.getUser.mockResolvedValue(member);
    mocks.getUserBillingSubscription.mockRejectedValue(new Error("billing down"));
    await expect(userHasPaidSubscription("user_x")).resolves.toBe(false);

    mocks.getUser.mockRejectedValue(new Error("users down"));
    await expect(userHasPaidSubscription("user_x")).resolves.toBe(false);
  });
});

describe("userIdForRssToken", () => {
  it.each(["", "short", "g".repeat(48), "A".repeat(48), `${"a".repeat(48)}x`, "a".repeat(47)])(
    "rejects the malformed token %j without touching the database",
    async (token) => {
      await expect(userIdForRssToken(token)).resolves.toBeNull();
      expect(mocks.db).not.toHaveBeenCalled();
    },
  );

  it("looks up a well-formed token", async () => {
    mocks.db.mockResolvedValue([{ user_id: "user_member" }]);
    await expect(userIdForRssToken("a1".repeat(24))).resolves.toBe("user_member");
    expect(mocks.db).toHaveBeenCalledOnce();
  });
});

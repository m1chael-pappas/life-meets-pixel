import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getMembership, MEMBER_FEATURES, requireAdmin } from "@/lib/membership";

const clerk = vi.hoisted(() => ({ auth: vi.fn(), currentUser: vi.fn() }));

vi.mock("@clerk/nextjs/server", () => clerk);
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

interface Visitor {
  userId: string | null;
  features?: string[];
  role?: unknown;
}

const EVERY_FEATURE = Object.values(MEMBER_FEATURES);

function visit({ userId, features = [], role }: Visitor) {
  clerk.auth.mockResolvedValue({
    userId,
    has: ({ feature }: { feature: string }) => features.includes(feature),
  });
  clerk.currentUser.mockResolvedValue(
    userId ? { id: userId, publicMetadata: role === undefined ? {} : { role } } : null,
  );
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_stub");
  vi.stubEnv("CLERK_SECRET_KEY", "sk_test_stub");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("requireAdmin", () => {
  it.each<[string, Visitor]>([
    ["a signed-out visitor", { userId: null }],
    ["a signed-in user with no role", { userId: "user_plain" }],
    ["a paying member with every feature", { userId: "user_member", features: EVERY_FEATURE }],
    ["a user with another role", { userId: "user_editor", role: "editor" }],
    ["a role that only matches ignoring case", { userId: "user_case", role: "Admin" }],
    ["a role stored as a non-string", { userId: "user_array", role: ["admin"] }],
  ])("rejects %s", async (_, visitor) => {
    visit(visitor);
    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("rejects even an admin while the Clerk keys are missing", async () => {
    vi.stubEnv("CLERK_SECRET_KEY", "");
    visit({ userId: "user_admin", role: "admin" });
    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(clerk.auth).not.toHaveBeenCalled();
  });

  it("admits an admin", async () => {
    visit({ userId: "user_admin", role: "admin" });
    await expect(requireAdmin()).resolves.toBeUndefined();
  });
});

describe("getMembership", () => {
  it("gives a paying member their features but not admin", async () => {
    visit({ userId: "user_member", features: EVERY_FEATURE });
    const membership = await getMembership();
    expect(membership.isAdmin).toBe(false);
    expect(membership.hasFeature(MEMBER_FEATURES.comments)).toBe(true);
  });

  it("gives an admin every feature without a subscription", async () => {
    visit({ userId: "user_admin", role: "admin" });
    const membership = await getMembership();
    expect(membership.isAdmin).toBe(true);
    expect(EVERY_FEATURE.every((f) => membership.hasFeature(f))).toBe(true);
  });
});

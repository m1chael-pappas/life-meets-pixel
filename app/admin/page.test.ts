import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminPage from "./page";

const deps = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  loadAdminDashboard: vi.fn(),
}));

vi.mock("@/lib/membership", () => ({ requireAdmin: deps.requireAdmin }));
vi.mock("@/lib/admin-stats", () => ({ loadAdminDashboard: deps.loadAdminDashboard }));
vi.mock("@/components/site-header", () => ({ SiteHeader: () => null }));

const unavailable = { status: "rejected", reason: new Error("stub") } as const;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AdminPage", () => {
  it("loads no data when the admin check rejects", async () => {
    deps.requireAdmin.mockRejectedValue(new Error("NEXT_NOT_FOUND"));
    await expect(AdminPage()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(deps.loadAdminDashboard).not.toHaveBeenCalled();
  });

  it("runs the admin check before loading any data", async () => {
    const calls: string[] = [];
    deps.requireAdmin.mockImplementation(async () => {
      calls.push("requireAdmin");
    });
    deps.loadAdminDashboard.mockImplementation(async () => {
      calls.push("loadAdminDashboard");
      return { now: 0, users: unavailable, subscriptions: unavailable, engagement: unavailable };
    });
    await AdminPage();
    expect(calls).toEqual(["requireAdmin", "loadAdminDashboard"]);
  });
});

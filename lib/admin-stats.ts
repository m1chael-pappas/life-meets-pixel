import { connection } from "next/server";

import { clerkClient } from "@clerk/nextjs/server";

import { commentsEnabled, getEngagementStats, type EngagementStats } from "@/lib/comments-db";

/**
 * Read-only numbers for the admin dashboard, from the Clerk Backend API and the
 * comments database. `loadAdminDashboard` reads the clock once and passes `now`
 * (epoch ms) to every section.
 */

const DAY_MS = 86_400_000;
const CLERK_API = "https://api.clerk.com/v1";
/** Pinned to the version `@clerk/backend` 3.16.1 targets (`SUPPORTED_BAPI_VERSION`). */
const CLERK_API_VERSION = "2026-05-12";
const PAGE_SIZE = 500;

export interface RecentUser {
  id: string;
  name: string;
  createdAt: number;
}

export interface UserStats {
  total: number;
  last7Days: number;
  last30Days: number;
  /** Ten newest sign-ups, newest first. */
  recent: RecentUser[];
}

export interface PlanCount {
  plan: string;
  monthly: number;
  annual: number;
}

export interface SubscriptionStats {
  /** Active, not on a free trial. Includes those cancelling at period end. */
  paying: number;
  byPlan: PlanCount[];
  freeTrials: number;
  pastDue: number;
  /** Active items with a cancellation scheduled for the end of the period. */
  cancelling: number;
  /** Items that ended, expired or were cancelled in the last 30 days. */
  endedLast30Days: number;
  /** Paying items normalised to a monthly amount: monthly fee, or the annual plan's monthly equivalent. Cents. */
  monthlyRevenueCents: number;
  currencySymbol: string;
}

interface Money {
  amount: number;
  currency_symbol: string;
}

/** The subset of Clerk's `CommerceSubscriptionItem` this module reads. */
interface SubscriptionItem {
  status: string;
  plan_period: "month" | "annual";
  is_free_trial: boolean;
  canceled_at: number | null;
  ended_at: number | null;
  plan: { name: string; fee: Money | null; annual_monthly_fee: Money | null } | null;
}

function displayName(user: {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return full || user.username || "(no name)";
}

/** Totals, sign-ups in the last 7 and 30 days, and the ten newest users. */
export async function getUserStats(now: number): Promise<UserStats> {
  const clerk = await clerkClient();
  const [total, week, month, recent] = await Promise.all([
    clerk.users.getCount(),
    clerk.users.getUserList({ createdAtAfter: now - 7 * DAY_MS, limit: 1 }),
    clerk.users.getUserList({ createdAtAfter: now - 30 * DAY_MS, limit: 1 }),
    clerk.users.getUserList({ orderBy: "-created_at", limit: 10 }),
  ]);
  return {
    total,
    last7Days: week.totalCount,
    last30Days: month.totalCount,
    recent: recent.data.map((u) => ({ id: u.id, name: displayName(u), createdAt: u.createdAt })),
  };
}

/**
 * Every user subscription item on a paid plan, all statuses. Raw REST because
 * `@clerk/backend` has no wrapper for `GET /billing/subscription_items`.
 * Throws on any non-OK response.
 */
async function listSubscriptionItems(): Promise<SubscriptionItem[]> {
  const items: SubscriptionItem[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const url = new URL(`${CLERK_API}/billing/subscription_items`);
    url.search = new URLSearchParams({
      payer_type: "user",
      include_free: "false",
      limit: String(PAGE_SIZE),
      offset: String(offset),
    }).toString();
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Clerk-API-Version": CLERK_API_VERSION,
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Clerk billing list failed: ${res.status}`);
    const page = (await res.json()) as { data: SubscriptionItem[] };
    items.push(...page.data);
    if (page.data.length < PAGE_SIZE) return items;
  }
}

/** Subscriber counts by plan and state, plus an estimated monthly revenue. */
export async function getSubscriptionStats(now: number): Promise<SubscriptionStats> {
  const items = await listSubscriptionItems();
  const since = now - 30 * DAY_MS;
  const byPlan = new Map<string, PlanCount>();
  const stats: SubscriptionStats = {
    paying: 0,
    byPlan: [],
    freeTrials: 0,
    pastDue: 0,
    cancelling: 0,
    endedLast30Days: 0,
    monthlyRevenueCents: 0,
    currencySymbol: "$",
  };

  for (const item of items) {
    if (item.status === "past_due") stats.pastDue += 1;
    if (["ended", "expired", "canceled"].includes(item.status)) {
      const at = item.ended_at ?? item.canceled_at ?? 0;
      if (at >= since) stats.endedLast30Days += 1;
    }
    if (item.status !== "active") continue;
    if (item.is_free_trial) {
      stats.freeTrials += 1;
      continue;
    }

    stats.paying += 1;
    if (item.canceled_at) stats.cancelling += 1;

    const name = item.plan?.name ?? "Unknown plan";
    const row = byPlan.get(name) ?? { plan: name, monthly: 0, annual: 0 };
    row[item.plan_period === "annual" ? "annual" : "monthly"] += 1;
    byPlan.set(name, row);

    const fee = item.plan_period === "annual" ? item.plan?.annual_monthly_fee : item.plan?.fee;
    if (fee) {
      stats.monthlyRevenueCents += fee.amount;
      stats.currencySymbol = fee.currency_symbol;
    }
  }

  stats.byPlan = [...byPlan.values()].sort((a, b) => b.monthly + b.annual - (a.monthly + a.annual));
  return stats;
}

export interface AdminDashboard {
  /** Epoch ms the numbers were read at. */
  now: number;
  users: PromiseSettledResult<UserStats>;
  subscriptions: PromiseSettledResult<SubscriptionStats>;
  engagement: PromiseSettledResult<EngagementStats>;
}

/**
 * Everything the admin dashboard shows, read at request time. Each section
 * settles independently so one failing source leaves the others intact.
 */
export async function loadAdminDashboard(): Promise<AdminDashboard> {
  await connection();
  const now = Date.now();
  const [users, subscriptions, engagement] = await Promise.allSettled([
    getUserStats(now),
    getSubscriptionStats(now),
    commentsEnabled()
      ? getEngagementStats()
      : Promise.reject(new Error("DATABASE_URL is not set")),
  ]);
  return { now, users, subscriptions, engagement };
}

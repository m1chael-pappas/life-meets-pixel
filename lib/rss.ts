import { randomBytes } from "crypto";

import { clerkClient } from "@clerk/nextjs/server";

import { commentsEnabled, db, ensureSchema } from "@/lib/comments-db";

/**
 * Personal full-text RSS feeds (the full_rss perk, 404 Media-style).
 * Each member gets a private tokenized URL: /feed/<token>.xml. The token
 * maps to a Clerk user; on every feed request we re-check that the user
 * still has an active paid subscription, so lapsed members lose the feed
 * without any bookkeeping.
 */

export function rssFeedsEnabled(): boolean {
  return commentsEnabled(); // same Neon database
}

export async function getOrCreateRssToken(userId: string): Promise<string> {
  await ensureSchema();
  const sql = db();
  const existing = (await sql`
    SELECT token FROM rss_tokens WHERE user_id = ${userId}
  `) as { token: string }[];
  if (existing.length > 0) return existing[0].token;

  const token = randomBytes(24).toString("hex");
  await sql`INSERT INTO rss_tokens (token, user_id) VALUES (${token}, ${userId})
            ON CONFLICT (user_id) DO NOTHING`;
  return getOrCreateRssToken(userId);
}

export async function rotateRssToken(userId: string): Promise<string> {
  await ensureSchema();
  const token = randomBytes(24).toString("hex");
  await db()`
    INSERT INTO rss_tokens (token, user_id) VALUES (${token}, ${userId})
    ON CONFLICT (user_id) DO UPDATE SET token = ${token}, created_at = now()
  `;
  return token;
}

export async function userIdForRssToken(token: string): Promise<string | null> {
  if (!/^[a-f0-9]{48}$/.test(token)) return null;
  await ensureSchema();
  const rows = (await db()`
    SELECT user_id FROM rss_tokens WHERE token = ${token}
  `) as { user_id: string }[];
  return rows[0]?.user_id ?? null;
}

/**
 * Server-side membership check without a browser session: an active
 * subscription with at least one active item on a non-default (paid) plan.
 * Clerk's billing backend API is beta — fail closed on errors.
 */
export async function userHasPaidSubscription(userId: string): Promise<boolean> {
  try {
    const clerk = await clerkClient();
    const sub = await clerk.billing.getUserBillingSubscription(userId);
    if (!sub || sub.status !== "active") return false;
    const items =
      (sub as unknown as { subscriptionItems?: Array<{ status: string; plan: { isDefault: boolean } | null }> })
        .subscriptionItems ?? [];
    return items.some((i) => i.status === "active" && i.plan && !i.plan.isDefault);
  } catch {
    return false;
  }
}

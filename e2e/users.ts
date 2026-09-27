import { createClerkClient, type User } from "@clerk/nextjs/server";

/** Test accounts in the Clerk development instance. Never created in production. */
export const TEST_USERS = {
  plain: "lmp-e2e-plain+clerk_test@example.com",
  member: "lmp-e2e-member+clerk_test@example.com",
  admin: "lmp-e2e-admin+clerk_test@example.com",
} as const;

export type TestRole = keyof typeof TEST_USERS;

const API = "https://api.clerk.com/v1";
const API_VERSION = "2026-05-12";

/** Throws unless the configured Clerk keys belong to a development instance. */
export function assertDevelopmentInstance(): void {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  if (!key.startsWith("pk_test_") || !process.env.CLERK_SECRET_KEY?.startsWith("sk_test_")) {
    throw new Error("E2E tests only run against a Clerk development instance (pk_test_/sk_test_ keys)");
  }
}

function backend() {
  return createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
}

/** Finds or creates the test user for `role`; the admin gets `publicMetadata.role = "admin"`. */
export async function ensureTestUser(role: TestRole): Promise<User> {
  assertDevelopmentInstance();
  const clerk = backend();
  const emailAddress = TEST_USERS[role];
  const publicMetadata = role === "admin" ? { role: "admin" } : {};
  const [existing] = (await clerk.users.getUserList({ emailAddress: [emailAddress] })).data;
  if (existing) {
    if (existing.publicMetadata?.role !== publicMetadata.role) {
      return clerk.users.updateUserMetadata(existing.id, { publicMetadata: { role: publicMetadata.role ?? null } });
    }
    return existing;
  }
  return clerk.users.createUser({
    emailAddress: [emailAddress],
    firstName: "E2E",
    lastName: role,
    skipPasswordRequirement: true,
    publicMetadata,
  });
}

/** True when the user's subscription has an active item on a non-default (paid) plan. */
export async function hasPaidPlan(userId: string): Promise<boolean> {
  const res = await fetch(`${API}/users/${userId}/billing/subscription`, {
    headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`, "Clerk-API-Version": API_VERSION },
  });
  if (!res.ok) return false;
  const sub = (await res.json()) as { subscription_items?: { status: string; plan?: { is_default?: boolean } }[] };
  return (sub.subscription_items ?? []).some((i) => i.status === "active" && i.plan && !i.plan.is_default);
}

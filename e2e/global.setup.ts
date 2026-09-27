import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { expect, test as setup } from "@playwright/test";

import { assertDevelopmentInstance, ensureTestUser, hasPaidPlan, TEST_USERS } from "./users";

setup.describe.configure({ mode: "serial" });

setup("Clerk testing token", async () => {
  assertDevelopmentInstance();
  await clerkSetup({ publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY });
});

setup("test users exist", async () => {
  await ensureTestUser("plain");
  await ensureTestUser("admin");
  await ensureTestUser("member");
});

/**
 * Clerk will not move a user onto a paid plan without a payment method, and its
 * API cannot add one, so the member subscribes once through the real checkout
 * with Stripe's test card. Later runs find the subscription and skip this.
 */
setup("member holds Player 2", async ({ page }) => {
  const member = await ensureTestUser("member");
  setup.skip(await hasPaidPlan(member.id), "already subscribed");

  await page.goto("/");
  await clerk.signIn({ page, emailAddress: TEST_USERS.member });
  await page.goto("/membership");

  const card = page.locator(".cl-pricingTableCard").filter({ hasText: "Player 2" });
  await card.getByRole("button", { name: /subscribe|get started|switch/i }).click();

  const stripe = page.frameLocator('iframe[title*="Secure payment input" i], iframe[name^="__privateStripeFrame"]').first();
  await stripe.getByPlaceholder(/1234 1234 1234 1234/).fill("4242424242424242");
  await stripe.getByPlaceholder(/MM \/ YY/i).fill("12 / 34");
  await stripe.getByPlaceholder(/CVC/i).fill("123");
  const postcode = stripe.getByPlaceholder(/ZIP|postal/i);
  if (await postcode.count()) await postcode.fill("2000");

  await page.getByRole("button", { name: /^(pay|subscribe|start)/i }).last().click();
  await expect.poll(() => hasPaidPlan(member.id), { timeout: 60_000 }).toBe(true);
});

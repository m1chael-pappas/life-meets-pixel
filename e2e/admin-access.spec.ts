import { clerk } from "@clerk/testing/playwright";
import { expect, test, type Page } from "@playwright/test";

import { TEST_USERS, type TestRole } from "./users";

/** Any published review, used to see which comment UI a visitor gets. */
async function firstReviewPath(page: Page): Promise<string> {
  await page.goto("/reviews");
  const href = await page.locator('a[href^="/reviews/"]').first().getAttribute("href");
  if (!href) throw new Error("no review link on /reviews");
  return href;
}

async function signInAs(page: Page, role: TestRole) {
  await page.goto("/");
  await clerk.signIn({ page, emailAddress: TEST_USERS[role] });
}

async function expectNotFound(page: Page) {
  await page.goto("/admin");
  await expect(page.getByText("PIXEL_NOT_FOUND")).toBeVisible();
  await expect(page.getByRole("heading", { name: /NEWEST SIGN-UPS/ })).toHaveCount(0);
}

test.describe("/admin access", () => {
  test("a signed-out visitor gets the 404 page", async ({ page }) => {
    await expectNotFound(page);
  });

  test("a signed-in user with no role gets the 404 page", async ({ page }) => {
    await signInAs(page, "plain");
    await expectNotFound(page);
  });

  test("a paying member gets member features but still the 404 page", async ({ page }) => {
    await signInAs(page, "member");
    await page.goto(await firstReviewPath(page));
    await expect(page.getByRole("textbox", { name: "Write a comment" })).toBeVisible();
    await expectNotFound(page);
  });

  test("an admin gets the dashboard", async ({ page }) => {
    await signInAs(page, "admin");
    await page.goto("/admin");
    await expect(page.getByRole("heading", { level: 1, name: "ADMIN" })).toBeVisible();
    for (const panel of ["USERS", "MEMBERSHIP", "ENGAGEMENT", "NEWEST SIGN-UPS"]) {
      await expect(page.getByRole("heading", { level: 2, name: new RegExp(panel) })).toBeVisible();
    }
  });
});

test.describe("member perks in a real session", () => {
  test("a signed-in user without a plan is offered the membership instead of the comment form", async ({ page }) => {
    await signInAs(page, "plain");
    await page.goto(await firstReviewPath(page));
    await expect(page.getByRole("link", { name: "JOIN AS PLAYER 2" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Write a comment" })).toHaveCount(0);
  });

  test("the RSS token API refuses a signed-out visitor and a user without the perk", async ({ page }) => {
    expect((await page.request.get("/api/rss-token")).status()).toBe(401);
    await signInAs(page, "plain");
    expect((await page.request.get("/api/rss-token")).status()).toBe(403);
  });
});

import { describe, expect, it } from "vitest";

import { reviewTagline } from "@/lib/content/mappings";

function review(title: string, item: string, summary = "The summary.") {
  return { title, summary, reviewableItem: { title: item } };
}

describe("reviewTagline", () => {
  it.each([
    ["Big Walk review: the game is your friends yelling across a valley", "Big Walk", "the game is your friends yelling across a valley"],
    ["Dispatch Review: With Great Power Comes Great Paperwork", "Dispatch ", "With Great Power Comes Great Paperwork"],
    ["Clair Obscur: Expedition 33 Review - Truly amazing", "Clair Obscur: Expedition 33 ", "Truly amazing"],
    ["Hollow Knight: A Masterclass in Metroidvania Design", "Hollow Knight", "A Masterclass in Metroidvania Design"],
    ["Dave the Diver Review – The Most Addictive Game About Sushi", "Dave the Diver", "The Most Addictive Game About Sushi"],
  ])("strips the item prefix from %j", (title, item, expected) => {
    expect(reviewTagline(review(title, item))).toBe(expected);
  });

  it.each([
    ["Demon Slayer: Infinity Castle Review - Pure Cinematic Perfection", "Demon Slayer: Kimetsu no Yaiba (Movie)"],
    ["I Have 200+ Hours and My Factory Still Isn't Efficient Enough", "Satisfactory"],
    ["Big Walk review", "Big Walk"],
    ["Big Walker review: a different game", "Big Walk"],
  ])("falls back to the summary for %j", (title, item) => {
    expect(reviewTagline(review(title, item, "  The summary.  "))).toBe("The summary.");
  });

  it("returns an empty string when there is no prefix and no summary", () => {
    expect(reviewTagline({ title: "Untitled", reviewableItem: { title: "Game" } })).toBe("");
  });
});

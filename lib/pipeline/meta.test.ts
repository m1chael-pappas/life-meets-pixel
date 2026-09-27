import { afterEach, describe, expect, it, vi } from "vitest";

import {
  assertCaptionRules,
  captionViolations,
  postCarouselToInstagram,
  postPhotosToFacebook,
  postToFacebook,
  postToInstagram,
} from "@/lib/pipeline/meta";

const GOOD_IG = `Judgment on PS5 and PC is the Yakuza spin-off with the better script.

RGG Studio hands Kamurocho to a disgraced defence lawyer. Score: 8.7/10.

Full review: link in bio`;

const GOOD_FB =
  "Judgment review: RGG Studio's Yakuza spin-off with the better script. 8.7/10. https://lifemeetspixel.com/reviews/judgment-review";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("captionViolations", () => {
  it("passes a clean Instagram caption and a clean Facebook post", () => {
    expect(captionViolations(GOOD_IG, "instagram")).toEqual([]);
    expect(captionViolations(GOOD_FB, "facebook")).toEqual([]);
  });

  it.each([
    ["a trailing hashtag block", `${GOOD_IG}\n\n#LifeMeetsPixel #Xbox`],
    ["a hashtag at the very start", `#Gaming ${GOOD_IG}`],
    ["a hashtag mid-sentence", GOOD_IG.replace("Kamurocho", "#Kamurocho")],
  ])("flags %s on both platforms", (_, text) => {
    expect(captionViolations(text, "instagram").join()).toContain("hashtag");
    expect(captionViolations(`${text} https://lifemeetspixel.com/x`, "facebook").join()).toContain("hashtag");
  });

  it.each([
    ["a programming language", "Built in C# and Unity. Full review: link in bio"],
    ["a chart position", "It went straight to #1 on Steam. Full review: link in bio"],
    ["an HTML entity", "Michael&#39;s pick. Full review: link in bio"],
  ])("does not mistake %s for a hashtag", (_, text) => {
    expect(captionViolations(text, "instagram")).toEqual([]);
  });

  it("flags an em dash but not a hyphen", () => {
    expect(captionViolations(GOOD_IG.replace(".", " \u2014"), "instagram").join()).toContain("em dash");
  });

  it.each([
    "https://lifemeetspixel.com/reviews/judgment-review",
    "www.lifemeetspixel.com",
    "lifemeetspixel.com/reviews/judgment-review",
  ])("flags the raw URL %s in an Instagram caption", (url) => {
    expect(captionViolations(`${GOOD_IG}\n${url}`, "instagram").join()).toContain("raw URL");
  });

  it("requires the link in bio CTA on Instagram", () => {
    expect(captionViolations("Judgment is great.", "instagram").join()).toContain("link in bio");
  });

  it("caps an Instagram caption at 2200 characters", () => {
    expect(captionViolations(`${GOOD_IG}${" word".repeat(500)}`, "instagram").join()).toContain("2200");
  });

  it("requires an article link on Facebook, with or without the scheme", () => {
    expect(captionViolations("Judgment is great.", "facebook").join()).toContain("lifemeetspixel.com");
    expect(captionViolations("Judgment is great. https://lifemeetspixel.com/", "facebook").join()).toContain("lifemeetspixel.com");
    expect(captionViolations("Judgment is great. lifemeetspixel.com/reviews/judgment-review", "facebook")).toEqual([]);
  });
});

describe("posting", () => {
  it("refuses to call the Graph API with a caption that breaks the rules", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const bad = `${GOOD_IG} #Xbox`;
    await expect(postToInstagram("https://x/a.png", bad)).rejects.toThrow("hashtag");
    await expect(postCarouselToInstagram(["https://x/a.png", "https://x/b.png"], bad)).rejects.toThrow("hashtag");
    await expect(postToFacebook("https://x/a.png", "No link here")).rejects.toThrow("lifemeetspixel.com");
    await expect(postPhotosToFacebook(["https://x/a.png", "https://x/b.png"], "No link")).rejects.toThrow(
      "lifemeetspixel.com",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("names every violation in one error", () => {
    expect(() => assertCaptionRules("Great \u2014 #Xbox https://x.com/a", "instagram")).toThrow(
      /Instagram caption has a hashtag.*em dash.*raw URL.*link in bio/,
    );
  });
});

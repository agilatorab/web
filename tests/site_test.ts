// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { describe, expect, it } from "vitest";

import { SITE } from "../src/site.ts";

describe("site facts", () => {
  it("names all three storefronts, in order", () => {
    expect(SITE.platforms.map((p) => p.name)).toEqual([
      "App Store",
      "Google Play",
      "Steam",
    ]);
  });

  it("the tagline says what the company makes and where", () => {
    for (const word of ["App Store", "Google Play", "Steam"]) {
      expect(SITE.tagline).toContain(word);
    }
  });

  it("links are absolute and https", () => {
    for (const url of [SITE.url, SITE.appsUrl, SITE.githubUrl]) {
      expect(url).toMatch(/^https:\/\//);
    }
    expect(SITE.url.endsWith("/")).toBe(false);
  });

  it("contact is a plain address, not a mailto", () => {
    expect(SITE.contact).toMatch(/^[^@\s]+@agilator\.se$/);
  });
});

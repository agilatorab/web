// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { describe, expect, it } from "vitest";

import {
  canonicalUrl,
  headTags,
  isProductionSlot,
  jsonLd,
  lastModified,
  renderLlms,
  renderRobots,
  renderSitemap,
} from "../seo-plugin.ts";
import { SITE } from "../src/site.ts";

describe("deploy slots", () => {
  it("only the root build is production", () => {
    expect(isProductionSlot("/")).toBe(true);
    expect(isProductionSlot("/preview/")).toBe(false);
    expect(isProductionSlot("/branch/")).toBe(false);
  });

  it("every slot's canonical URL is production", () => {
    expect(canonicalUrl()).toBe("https://agilator.se/");
  });

  it("production is indexable and secondary slots are not", () => {
    const robots = (base: string) =>
      headTags(base).find((t) => t.attrs?.name === "robots")?.attrs?.content;
    expect(robots("/")).toBe("index,follow");
    expect(robots("/preview/")).toBe("noindex,nofollow");
    expect(robots("/branch/")).toBe("noindex,nofollow");
  });

  it("robots.txt allows crawling only in production", () => {
    expect(renderRobots("/")).toContain("Allow: /");
    expect(renderRobots("/")).toContain(`Sitemap: ${SITE.url}/sitemap.xml`);
    expect(renderRobots("/preview/")).toContain("Disallow: /");
    expect(renderRobots("/preview/")).not.toContain("Sitemap:");
  });

  it("icon links are rooted at the slot's base", () => {
    const icon = headTags("/preview/").find(
      (t) => t.attrs?.rel === "icon" && t.attrs?.type === "image/svg+xml",
    );
    expect(icon?.attrs?.href).toBe("/preview/favicon.svg");
  });
});

describe("head", () => {
  const tags = headTags("/");
  const find = (key: string, value: string) =>
    tags.find((t) => t.attrs?.[key] === value);

  it("carries the eight discoverability signals", () => {
    expect(tags.find((t) => t.tag === "title")?.children).toContain(
      SITE.company,
    );
    expect(find("name", "description")?.attrs?.content).toBe(SITE.description);
    expect(find("rel", "canonical")?.attrs?.href).toBe(canonicalUrl());
    expect(find("property", "og:image")?.attrs?.content).toBe(
      `${SITE.url}/og.png`,
    );
    expect(find("name", "twitter:card")?.attrs?.content).toBe(
      "summary_large_image",
    );
    expect(find("name", "referrer")).toBeDefined();
    expect(tags.filter((t) => t.attrs?.name === "theme-color")).toHaveLength(2);
    expect(find("type", "application/ld+json")).toBeDefined();
  });

  it("JSON-LD parses, names the organisation and agrees on the image", () => {
    const doc = JSON.parse(jsonLd()) as {
      "@graph": { "@type": string; image: string; sameAs?: string[] }[];
    };
    const types = doc["@graph"].map((n) => n["@type"]);
    expect(types).toEqual(["Organization", "WebSite"]);
    for (const node of doc["@graph"]) {
      expect(node.image).toBe(`${SITE.url}/og.png`);
    }
    expect(doc["@graph"][0].sameAs).toContain(SITE.githubUrl);
  });
});

describe("crawler files", () => {
  it("sitemap lists the one page with a real lastmod", () => {
    const xml = renderSitemap("2026-09-22");
    expect(xml).toContain(`<loc>${canonicalUrl()}</loc>`);
    expect(xml).toContain("<lastmod>2026-09-22</lastmod>");
  });

  it("lastModified is an ISO date", () => {
    expect(lastModified()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("llms.txt starts with the title and lists the platforms", () => {
    const txt = renderLlms("1.2.3");
    expect(txt.startsWith(`# ${SITE.company}\n`)).toBe(true);
    for (const p of SITE.platforms) expect(txt).toContain(`- ${p.name}:`);
    expect(txt).toContain("Build: 1.2.3");
  });
});

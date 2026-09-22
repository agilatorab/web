// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
//
// Everything a crawler, an unfurler or a feed reader needs, written from
// `src/site.ts` at build time: the <head> signals (title, description,
// canonical, Open Graph, Twitter Card, JSON-LD, theme colours, icons), plus
// robots.txt, sitemap.xml and llms.txt at the dist root.
//
// The deploy slots (see pages.yml) are told apart by `base`: only the
// production build at `/` is indexable. `/preview/` and `/branch/` carry
// `noindex,nofollow` and a robots.txt that disallows everything, so search
// engines never index a second copy of the site — and every slot's canonical
// URL still points at production.
import { execSync } from "node:child_process";

import type { HtmlTagDescriptor, Plugin } from "vite";

import { SITE } from "./src/site.ts";

type SeoOptions = {
  /** The slot's base path: `/`, `/preview/` or `/branch/`. */
  base: string;
  /** The build label, recorded in llms.txt so a reader can tell builds apart. */
  buildLabel: string;
};

export const isProductionSlot = (base: string): boolean => base === "/";

/** The canonical page URL: production, whatever slot built the page. */
export const canonicalUrl = (): string => `${SITE.url}/`;

/** The last content change, as an ISO date — for the sitemap's <lastmod>. */
export function lastModified(now = new Date()): string {
  try {
    // The date of the last commit that touched the page's sources, not the
    // build time: a redeploy with no content change must not bump it.
    const iso = execSync(
      "git log -1 --format=%cI -- src index.html seo-plugin.ts public",
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    if (iso) return iso.slice(0, 10);
  } catch {
    // Not a git checkout (a tarball build) — fall through.
  }
  return now.toISOString().slice(0, 10);
}

export function renderRobots(base: string): string {
  const production = isProductionSlot(base);
  return production
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;
}

export function renderSitemap(lastmod: string): string {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url>\n` +
    `    <loc>${canonicalUrl()}</loc>\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>monthly</changefreq>\n` +
    `    <priority>1.0</priority>\n` +
    `  </url>\n` +
    `</urlset>\n`
  );
}

export function renderLlms(buildLabel: string): string {
  const platforms = SITE.platforms
    .map((p) => `- ${p.name}: ${p.what.toLowerCase()}`)
    .join("\n");
  return (
    `# ${SITE.company}\n\n` +
    `> ${SITE.tagline}\n\n` +
    `${SITE.description}\n\n` +
    `- Website: ${canonicalUrl()}\n` +
    `- Apps and games, with privacy policies and support: ${SITE.appsUrl}\n` +
    `- Source code: ${SITE.githubUrl}\n` +
    `- Contact: ${SITE.contact}\n\n` +
    `## Platforms\n\n${platforms}\n\n` +
    `## Principles\n\n` +
    SITE.principles.map((p) => `- ${p.title}: ${p.body}`).join("\n") +
    `\n\nBuild: ${buildLabel}\n`
  );
}

export function jsonLd(): string {
  const org = {
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.company,
    url: canonicalUrl(),
    logo: `${SITE.url}/og.png`,
    image: `${SITE.url}/og.png`,
    email: SITE.contact,
    description: SITE.description,
    address: { "@type": "PostalAddress", addressCountry: "SE" },
    sameAs: [SITE.githubUrl, SITE.appsUrl],
  };
  const site = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: canonicalUrl(),
    name: SITE.company,
    description: SITE.description,
    publisher: { "@id": org["@id"] },
    image: `${SITE.url}/og.png`,
  };
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [org, site],
  });
}

const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({
  tag: "meta",
  attrs,
  injectTo: "head",
});
const link = (attrs: Record<string, string>): HtmlTagDescriptor => ({
  tag: "link",
  attrs,
  injectTo: "head",
});

export function headTags(base: string): HtmlTagDescriptor[] {
  const title = `${SITE.company} — ${SITE.tagline}`;
  const url = canonicalUrl();
  const image = `${SITE.url}/og.png`;
  const asset = (p: string) => `${base}${p}`;
  return [
    { tag: "title", children: title, injectTo: "head" },
    meta({ name: "description", content: SITE.description }),
    meta({
      name: "robots",
      content: isProductionSlot(base) ? "index,follow" : "noindex,nofollow",
    }),
    meta({ name: "referrer", content: "strict-origin-when-cross-origin" }),
    meta({
      name: "theme-color",
      media: "(prefers-color-scheme: light)",
      content: "#f5f4ef",
    }),
    meta({
      name: "theme-color",
      media: "(prefers-color-scheme: dark)",
      content: "#121614",
    }),
    link({ rel: "canonical", href: url }),
    link({ rel: "icon", href: asset("favicon.svg"), type: "image/svg+xml" }),
    link({ rel: "icon", href: asset("favicon-32.png"), sizes: "32x32" }),
    link({
      rel: "apple-touch-icon",
      href: asset("apple-touch-icon.png"),
      sizes: "180x180",
    }),
    meta({ property: "og:type", content: "website" }),
    meta({ property: "og:site_name", content: SITE.company }),
    meta({ property: "og:title", content: title }),
    meta({ property: "og:description", content: SITE.description }),
    meta({ property: "og:url", content: url }),
    meta({ property: "og:image", content: image }),
    meta({ property: "og:image:width", content: "1200" }),
    meta({ property: "og:image:height", content: "630" }),
    meta({ property: "og:image:alt", content: `${SITE.company} logo` }),
    meta({ property: "og:locale", content: "en_GB" }),
    meta({ name: "twitter:card", content: "summary_large_image" }),
    meta({ name: "twitter:title", content: title }),
    meta({ name: "twitter:description", content: SITE.description }),
    meta({ name: "twitter:image", content: image }),
    {
      tag: "script",
      attrs: { type: "application/ld+json" },
      children: jsonLd(),
      injectTo: "head",
    },
  ];
}

export function seo({ base, buildLabel }: SeoOptions): Plugin {
  return {
    name: "agilator-seo",
    transformIndexHtml: {
      order: "pre",
      handler: () => headTags(base),
    },
    generateBundle() {
      const emit = (fileName: string, source: string) =>
        this.emitFile({ type: "asset", fileName, source });
      emit("robots.txt", renderRobots(base));
      emit("llms.txt", renderLlms(buildLabel));
      // Only the indexable slot advertises a sitemap.
      if (isProductionSlot(base))
        emit("sitemap.xml", renderSitemap(lastModified()));
    },
  };
}

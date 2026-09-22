#!/usr/bin/env node
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
//
// Structural SEO assertions (OSS_SPEC §11.3) over the built site in dist/.
// Errors exit 1 and block CI; run with `npm run check:seo` after a build.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { error, header, status } from "../lib/output.mjs";

const dist = join(process.cwd(), "dist");
const failures = [];

function assert(cond, message) {
  if (!cond) failures.push(message);
}

header("check-seo");
assert(existsSync(dist), "dist/ missing — run `npm run build` first");

const indexPath = join(dist, "index.html");
assert(existsSync(indexPath), "dist/index.html missing");
const html = existsSync(indexPath) ? readFileSync(indexPath, "utf8") : "";

// Head signals.
assert(/<html lang="[a-z-]+"/i.test(html), "missing html lang");
assert(/<title>[^<]{5,}<\/title>/.test(html), "missing or empty <title>");
assert(html.includes('name="description"'), "missing meta description");
assert(html.includes('rel="canonical"'), "missing canonical link");
assert(html.includes('name="referrer"'), "missing referrer policy");
assert(
  (html.match(/name="theme-color"/g) ?? []).length >= 2,
  "missing light + dark theme-color",
);
assert(html.includes('property="og:title"'), "missing og:title");
assert(html.includes('property="og:image"'), "missing og:image");
assert(html.includes('name="twitter:card"'), "missing twitter:card");
assert(html.includes("application/ld+json"), "missing JSON-LD block");

// §11.3.1 — the body must carry the page, not an empty shell.
assert(
  /<div id="app">\s*<[^>]+>[\s\S]{200,}<\/div>/.test(html),
  "body is an empty SPA shell — prerendering did not run",
);
// §11.3.5 — exactly one h1.
assert(
  (html.match(/<h1[\s>]/g) ?? []).length === 1,
  "expected exactly one <h1>",
);

// The og:image the meta points at must actually ship.
const og = /property="og:image" content="([^"]+)"/.exec(html)?.[1];
if (og) {
  const file = og.split("/").pop();
  assert(
    existsSync(join(dist, file)),
    `og:image points at ${file}, which is not in dist/`,
  );
}

// JSON-LD must parse and agree with the og:image.
const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(
  html,
)?.[1];
if (ld) {
  try {
    const doc = JSON.parse(ld);
    const images = (doc["@graph"] ?? [doc]).map((n) => n.image).filter(Boolean);
    assert(
      images.length > 0 &&
        og &&
        images.every((i) => i.endsWith(og.split("/").pop())),
      "JSON-LD image drifted from og:image",
    );
  } catch {
    failures.push("JSON-LD does not parse");
  }
}

// Crawler files. The sitemap is only emitted for the indexable slot.
for (const f of ["robots.txt", "llms.txt"]) {
  assert(existsSync(join(dist, f)), `missing dist/${f}`);
}
const robots = existsSync(join(dist, "robots.txt"))
  ? readFileSync(join(dist, "robots.txt"), "utf8")
  : "";
const indexable = html.includes('content="index,follow"');
if (indexable) {
  assert(existsSync(join(dist, "sitemap.xml")), "missing dist/sitemap.xml");
  assert(
    robots.includes("sitemap.xml"),
    "robots.txt does not point at the sitemap",
  );
  if (existsSync(join(dist, "sitemap.xml"))) {
    const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
    assert(
      /<lastmod>\d{4}-\d{2}-\d{2}/.test(sitemap),
      "sitemap.xml has no <lastmod>",
    );
  }
} else {
  assert(
    robots.includes("Disallow: /"),
    "non-production slot must disallow crawling",
  );
}
const llms = existsSync(join(dist, "llms.txt"))
  ? readFileSync(join(dist, "llms.txt"), "utf8")
  : "";
assert(llms.startsWith("# "), "llms.txt must start with a `# Title` line");

if (failures.length) {
  for (const f of failures) error(f);
  error(`check-seo: ${failures.length} failure(s)`);
  process.exit(1);
}
status("check-seo: all structural SEO assertions pass");

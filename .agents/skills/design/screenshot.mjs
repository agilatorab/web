#!/usr/bin/env node
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
//
// Screenshot harness for the design skill: opens the running site in a
// headless Chromium at a few viewports and colour schemes and writes one PNG
// per combination, so an agent can Read the render after every edit.
//
//   node .agents/skills/design/screenshot.mjs [--base-url URL] [--out DIR]
//        [--name PREFIX] [--viewports desktop,mobile,tablet]
//        [--schemes light,dark]
//
// Needs `playwright-core` (installed --no-save by the session-start hook; it
// is deliberately not a project dependency) and a Chromium under
// PLAYWRIGHT_BROWSERS_PATH or one it can find on its own.
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const VIEWPORTS = {
  desktop: { width: 1280, height: 800, fullPage: true },
  tablet: { width: 768, height: 1024, fullPage: true },
  mobile: {
    width: 390,
    height: 844,
    fullPage: true,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  },
};

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((a, i, all) => (a.startsWith("--") ? [a.slice(2), all[i + 1]] : []))
    .filter((e) => e.length),
);
const out = args.out ?? "/tmp";
const name = args.name ?? "design";
const viewports = (args.viewports ?? "desktop,mobile").split(",");
const schemes = (args.schemes ?? "light,dark").split(",");

async function resolveChromium() {
  for (const pkg of ["playwright", "@playwright/test", "playwright-core"]) {
    try {
      return (await import(pkg)).chromium;
    } catch {
      /* try the next */
    }
  }
  throw new Error(
    "no Playwright package found — `npm i --no-save playwright-core`",
  );
}

async function resolveBaseUrl() {
  if (args["base-url"]) return args["base-url"];
  for (const url of ["http://localhost:5173/", "http://localhost:4173/"]) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return url;
    } catch {
      /* not listening */
    }
  }
  throw new Error("no server on 5173 (npm run dev) or 4173 (npm run preview)");
}

// === RECIPE ===
// The one block to edit between iterations: land the page on the state you
// want to see. The default just waits for the hero to hydrate.
async function recipe(page) {
  await page.waitForSelector("h1");
}
// === END RECIPE ===

const chromium = await resolveChromium();
const baseUrl = await resolveBaseUrl();
mkdirSync(out, { recursive: true });
// A web session ships a Chromium at a fixed path that may not match the
// playwright-core version installed; point at it explicitly when present.
const preinstalled = "/opt/pw-browsers/chromium";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ??
    (existsSync(preinstalled) ? preinstalled : undefined),
});
try {
  for (const vp of viewports) {
    const spec = VIEWPORTS[vp];
    if (!spec) throw new Error(`unknown viewport ${vp}`);
    for (const scheme of schemes) {
      const { fullPage, ...ctx } = spec;
      const context = await browser.newContext({
        viewport: { width: ctx.width, height: ctx.height },
        isMobile: ctx.isMobile,
        hasTouch: ctx.hasTouch,
        deviceScaleFactor: ctx.deviceScaleFactor,
        colorScheme: scheme,
      });
      const page = await context.newPage();
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await recipe(page, vp, scheme);
      const file = join(out, `${name}-${vp}-${scheme}.png`);
      await page.screenshot({ path: file, fullPage });
      console.log(file);
      await context.close();
    }
  }
} finally {
  await browser.close();
}

// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { readFileSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";

import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import { seo } from "./seo-plugin.ts";

// The base path is injected by the deploy workflow via VITE_BASE, one per
// release channel on the custom domain (agilator.se): the released site at
// `/`, the rolling main build at `/preview/`, and a parked branch at
// `/branch/`. Defaults to `/` for local dev and preview builds.
const base = process.env.VITE_BASE ?? "/";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// The site's released version, the base of the footer's build label.
const version = (
  JSON.parse(readFileSync(here("./package.json"), "utf8")) as {
    version: string;
  }
).version;

// The build identifier shown in the footer. Shape:
// `<version>[.<run>][-<slot>][+<commit>]` — `<run>` is the CI run number,
// `<slot>` is `pre` for the `/preview/` deploy and `br` for `/branch/`
// (omitted for the production `/` build), and `<commit>` is the short commit
// hash as semver build metadata. A local build collapses to just `<version>`.
const slot = base === "/preview/" ? "pre" : base === "/branch/" ? "br" : "";
const buildLabel =
  version +
  (process.env.GITHUB_RUN_NUMBER ? `.${process.env.GITHUB_RUN_NUMBER}` : "") +
  (slot ? `-${slot}` : "") +
  (process.env.GITHUB_SHA ? `+${process.env.GITHUB_SHA.slice(0, 7)}` : "");

export default defineConfig({
  base,
  build: {
    // The source is published; the minified bundle is what a visitor loads.
    sourcemap: false,
  },
  define: {
    __BUILD_LABEL__: JSON.stringify(buildLabel),
  },
  plugins: [
    // Prerender the page at build time so the HTML a crawler (or a visitor
    // with a slow connection) receives already contains the content — the
    // client then hydrates it instead of painting from an empty shell.
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
        previewMiddlewareEnabled: true,
      },
    }),
    tailwindcss(),
    seo({ base, buildLabel }),
  ],
});

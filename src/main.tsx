// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { hydrate, prerender as ssr } from "preact-iso";

import "@fontsource-variable/inter";
import "./styles.css";
import { App } from "./App.tsx";

// In the browser, take over the HTML the build prerendered rather than
// painting it again: the markup is already on screen before this script
// runs, so the first thing a visitor sees is the finished page.
if (typeof window !== "undefined") {
  const root = document.getElementById("app");
  if (!root) throw new Error("missing #app element");
  hydrate(<App />, root);
}

// Called by `@preact/preset-vite` at build time (the `prerender` attribute on
// the script tag in `index.html` points it here). The <head> is written by
// `seo-plugin.ts` from `src/site.ts`; this only supplies the body.
export async function prerender() {
  return ssr(<App />);
}

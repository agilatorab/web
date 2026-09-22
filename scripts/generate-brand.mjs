#!/usr/bin/env node
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
//
// Regenerates every raster and standalone-SVG brand asset from the one vector
// source, `src/brand/paths.ts`:
//
//   public/logo.svg           the full logo (eyes + wordmark)
//   public/mark.svg           the eyes alone
//   public/favicon.svg        the mark, ink and iris fixed for a tab strip
//   public/favicon-32.png     the same, rasterised
//   public/apple-touch-icon.png   180×180 on paper, for iOS bookmarks
//   public/og.png             the 1200×630 social card
//
// Run with `make brand`. The outputs are committed so a checkout renders
// without sharp installed; regenerate them whenever the paths change.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

import { error, header, status } from "../lib/output.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");

// Read the path constants without a TypeScript loader: each is one
// `export const NAME = "...";` line.
const source = readFileSync(join(ROOT, "src/brand/paths.ts"), "utf8");
const constant = (name) => {
  const m = new RegExp(`export const ${name} = ("[^"]*");`).exec(source);
  if (!m) {
    error(`src/brand/paths.ts: missing export ${name}`);
    process.exit(1);
  }
  return JSON.parse(m[1]);
};
const EYES = constant("EYES");
const IRIS = constant("IRIS");
const SLIT = constant("SLIT");
const WORD = constant("WORD");
const VIEWBOX_FULL = constant("VIEWBOX_FULL");
const VIEWBOX_MARK = constant("VIEWBOX_MARK");

// Colours mirror src/styles.css (light scheme).
const PAPER = "#f5f4ef";
const INK = "#2b332f";
const IRIS_COLOUR = "#2f8a5b";

const layers = ({ word, ink, iris }) =>
  `<path fill="${ink}" fill-rule="evenodd" d="${EYES} ${IRIS}${word ? ` ${WORD}` : ""}"/>` +
  `<path fill="${iris}" d="${IRIS}"/>` +
  `<path fill="${ink}" d="${SLIT}"/>`;

const svg = ({ viewBox, label, word, ink, iris, extra = "" }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${label}">${extra}${layers({ word, ink, iris })}</svg>\n`;

header("Brand assets");

// The standalone SVGs keep `currentColor` so they inherit wherever they're
// inlined (the apps site does this); the iris falls back to a hole.
const inherit = { ink: "currentColor", iris: "var(--logo-iris, transparent)" };
writeFileSync(
  join(PUBLIC, "logo.svg"),
  svg({ viewBox: VIEWBOX_FULL, label: "Agilator AB", word: true, ...inherit }),
);
status("public/logo.svg");
writeFileSync(
  join(PUBLIC, "mark.svg"),
  svg({ viewBox: VIEWBOX_MARK, label: "Agilator", word: false, ...inherit }),
);
status("public/mark.svg");

// A favicon can't inherit a page colour, so it is fixed: ink on transparent
// (dark tab strips still read it thanks to the coloured irises).
const favicon = svg({
  viewBox: VIEWBOX_MARK,
  label: "Agilator",
  word: false,
  ink: INK,
  iris: IRIS_COLOUR,
});
writeFileSync(join(PUBLIC, "favicon.svg"), favicon);
status("public/favicon.svg");

await sharp(Buffer.from(favicon), { density: 300 })
  .resize(32, 32, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(join(PUBLIC, "favicon-32.png"));
status("public/favicon-32.png");

// iOS squares the icon and rounds its corners itself; give it paper to sit on
// and the mark with room to breathe.
const touch = svg({
  viewBox: "398 -102 906 906",
  label: "Agilator",
  word: false,
  ink: INK,
  iris: IRIS_COLOUR,
  extra: `<rect x="398" y="-102" width="906" height="906" fill="${PAPER}"/>`,
});
await sharp(Buffer.from(touch), { density: 300 })
  .resize(180, 180, { fit: "contain", background: PAPER })
  .png()
  .toFile(join(PUBLIC, "apple-touch-icon.png"));
status("public/apple-touch-icon.png");

// The social card: the full logo centred on paper, with the tagline beneath.
const [vx, vy, vw, vh] = VIEWBOX_FULL.split(" ").map(Number);
const card =
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">` +
  `<rect width="1200" height="630" fill="${PAPER}"/>` +
  `<g transform="translate(120 190) scale(${960 / vw}) translate(${-vx} ${-vy})">` +
  layers({ word: true, ink: INK, iris: IRIS_COLOUR }) +
  `</g>` +
  `<text x="600" y="${190 + (960 / vw) * vh + 90}" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="26" font-weight="600" letter-spacing="4" fill="#626b66">APPS AND GAMES · APP STORE · GOOGLE PLAY · STEAM</text>` +
  `</svg>`;
await sharp(Buffer.from(card), { density: 144 })
  .resize(1200, 630)
  .png()
  .toFile(join(PUBLIC, "og.png"));
status("public/og.png");

# Architecture

One prerendered page. There is no server, no router, no client state and no
service worker: the deliverable is a directory of static files.

## What loads when

1. `dist/index.html` — the page's full HTML, written at build time by the
   prerender step, with the `<head>` from `seo-plugin.ts`. A visitor sees the
   finished page before any script runs; a crawler sees content, not an empty
   `<div>`.
2. One CSS file — Tailwind's output for the classes the page uses, plus the
   tokens in `src/styles.css`.
3. One JS bundle — Preact and the page components, which hydrate the existing
   markup. Nothing on the page needs JavaScript to read; it exists so the
   markup and the source stay one thing.
4. The Inter font, self-hosted, loaded by the CSS.

Nothing is fetched from a third party, and the footer says so.

## Source layout

```
index.html            the HTML template — deliberately near-empty
seo-plugin.ts         Vite plugin: <head> tags + robots/sitemap/llms from src/site.ts
vite.config.ts        base path (deploy slot), build label, prerender, Tailwind
src/
├── main.tsx          hydrate in the browser; export prerender() for the build
├── App.tsx           the page: Header, Hero, Platforms, Principles, Contact, Footer
├── site.ts           every fact and every line of copy
├── styles.css        Tailwind + colour tokens, both schemes, the iris behaviour
├── app/              one component per section
└── brand/
    ├── paths.ts      the logo as vector paths (EYES, IRIS, SLIT, WORD)
    └── Logo.tsx      renders them inline, ink from currentColor, iris from CSS
lib/
└── output.mjs        the central output module every script logs through
scripts/
├── generate-brand.mjs  public/ SVGs, favicons and the social card from paths.ts
├── check-seo.mjs     structural assertions over dist/
└── release/          changeset fragments → changelog → bump (shared with contacts)
public/               static files copied as-is: CNAME, the generated brand assets
tests/                vitest, node environment, *_test.ts
```

Dependency direction: components → `site.ts` and `brand/`. The plugin and the
scripts read `site.ts` and `brand/paths.ts`; nothing reads a component.

## The prerender

`@preact/preset-vite` with `prerender.enabled` calls the `prerender()` export
of `src/main.tsx` during `vite build`, renders `<App />` to a string with
`preact-iso`, and inserts it into `#app` in the template. In the browser
`main.tsx` calls `hydrate()` against that markup. Anything that touches
`window` or `document` at module scope must be guarded, because the module also
runs under Node at build time.

## The `<head>`

`index.html` holds only the charset and viewport. `seo-plugin.ts` injects the
rest through Vite's `transformIndexHtml`: title, description, canonical, the
per-slot robots directive, referrer policy, light and dark theme colours, icon
links (rooted at the slot's base), Open Graph, Twitter Card and a JSON-LD graph
with an `Organization` and a `WebSite`. It also emits `robots.txt`, `llms.txt`
and — only for the indexable slot — `sitemap.xml`, whose `<lastmod>` is the
date of the last commit touching the page's sources, not the build time.

`scripts/check-seo.mjs` asserts the shape of all of this over `dist/`, and
`tests/seo_test.ts` pins the renderers.

## The logo

The original artwork is a raster (`brand/agilator-logo.png`). It was traced
once with potrace into a single path, which was split by hand into the parts
that need their own colour: the brows and eye outlines, the two irises, the two
slit pupils, and the wordmark. `src/brand/paths.ts` holds those four path
strings and the two view boxes (whole logo; eyes only).

`Logo.tsx` layers them: the outlines and wordmark in `currentColor` with the
even-odd rule so the iris reads as a hole, then the iris painted over that hole
in `var(--logo-iris, transparent)`, then the pupil in `currentColor`. So the
same markup is the monochrome original (no iris variable), a green-eyed logo on
paper, or a pale logo with lit eyes on dark. `src/styles.css` sets a resting
iris colour on `.logo` and the full accent on hover, focus or `.logo-awake`.

`scripts/generate-brand.mjs` renders the same paths into the standalone
`public/logo.svg` and `public/mark.svg` (still `currentColor`, for inlining in
the sibling apps site), a fixed-colour `favicon.svg` and `favicon-32.png`, the
`apple-touch-icon.png`, and the 1200×630 `og.png`. See [brand.md](brand.md).

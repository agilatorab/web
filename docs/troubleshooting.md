# Troubleshooting

## `make check-seo`: "body is an empty SPA shell — prerendering did not run"

The build produced `dist/index.html` without the page's HTML. Check that the
script tag in `index.html` still carries the `prerender` attribute and that
`src/main.tsx` still exports `prerender()`. If a new component touches `window`
or `document` at module scope, the prerender crashes under Node — guard it with
`typeof window !== "undefined"`.

## `npm ci`: "package.json and package-lock.json are not in sync"

A dependency range changed without the lockfile. Run `npm install` and commit
`package-lock.json`.

## CI's `brand` job fails

The committed files under `public/` are not what `scripts/generate-brand.mjs`
produces — usually because `src/brand/paths.ts` or the colour constants in the
script changed. Run `make brand` and commit the result. Never edit the
generated files directly.

## The eyes are holes, not green

Nothing set `--logo-iris`. On the page, that means the element is missing the
`logo` class; when inlining `public/logo.svg` elsewhere, set the variable on an
ancestor (see [brand.md](brand.md)).

## The page overflows sideways on a phone

Shoot it: `make screenshots` (with `npm run dev` or `npm run preview` running)
and read `/tmp/design-mobile-light.png`. The header is the usual culprit — it
is the only row with several items side by side. The
[design skill](../.agents/skills/design/SKILL.md) has the loop.

## The screenshot harness cannot launch Chromium

It needs `playwright-core` and a browser. In a Claude Code web session the
SessionStart hook installs the package and a Chromium is preinstalled at
`/opt/pw-browsers/chromium`. Elsewhere: `npm i --no-save playwright-core`,
then either `npx playwright-core install chromium` or point `CHROMIUM_PATH`
at an existing binary.

## `/preview/` shows up in a search engine

It must not. Non-production slots ship `<meta name="robots" content="noindex,nofollow">`
and a `robots.txt` that disallows everything; `tests/seo_test.ts` pins both.
If a build lost them, check `VITE_BASE` in `pages.yml` — the plugin keys
indexability off it.

## Lighthouse fails on a pull request

`.github/lighthouse/lighthouserc.json` treats SEO and accessibility scores as
errors and the rest as warnings. The report link is in the job log; the usual
causes are a contrast regression in a new colour token or a link without a
discernible name.

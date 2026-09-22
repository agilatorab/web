# Configuration

There is deliberately little to configure. The page has no runtime settings,
no environment-dependent behaviour and no secrets.

## Build-time environment

| Variable            | Default | Set by                     | Effect                                                                                                                                                                                                    |
| ------------------- | ------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_BASE`         | `/`     | `pages.yml`, `release.yml` | The slot's base path. Assets are rooted under it. Only `/` is indexable: any other base gets `<meta name="robots" content="noindex,nofollow">`, a `robots.txt` that disallows everything, and no sitemap. |
| `GITHUB_RUN_NUMBER` | unset   | GitHub Actions             | Appended to the footer's build label as `.<run>`.                                                                                                                                                         |
| `GITHUB_SHA`        | unset   | GitHub Actions             | Its first seven characters end the build label as `+<commit>`.                                                                                                                                            |

The build label has the shape `<version>[.<run>][-<slot>][+<commit>]`, where
`<slot>` is `pre` for `/preview/` and `br` for `/branch/`; a local build shows
just the version from `package.json`.

## Site facts

`src/site.ts` holds every fact and every line of pitch: the company name, the
tagline and description, the canonical URL, the apps site, the GitHub
organisation, the contact address, the three platforms and the three
principles. The components render it; `seo-plugin.ts` writes the `<head>`,
`robots.txt`, `sitemap.xml` and `llms.txt` from it; and
`scripts/generate-brand.mjs` reads the same values for the social card. Change
a fact there and every surface follows.

## Colours and type

`src/styles.css` defines the tokens under `@theme` — paper, card, ink, dim,
line, accent, accent-soft and the resting iris colour — and overrides them
under `prefers-color-scheme: dark`. The font is Inter (variable), self-hosted
from `@fontsource-variable/inter`.

The favicon, touch icon and social card cannot read CSS, so
`scripts/generate-brand.mjs` carries the light-scheme values of `paper`, `ink`
and `accent` as constants. Change them in both places and run `make brand`.

## Prettier, ESLint, TypeScript

`.prettierrc.json` (semicolons, trailing commas), `eslint.config.js` (the
recommended sets plus the TypeScript-aware unused-variable rule) and
`tsconfig.json` (strict, `jsxImportSource: preact`). None of these are meant to
be tuned per-contributor.

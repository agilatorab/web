# agilator.se

The company website of [Agilator AB](https://agilator.se/) — an independent
studio in Sweden that builds apps for the App Store and Google Play, and games
for Steam. One prerendered page, built with Preact, Vite and Tailwind, deployed
to GitHub Pages in three slots.

[![CI](https://github.com/agilatorab/web/actions/workflows/ci.yml/badge.svg)](https://github.com/agilatorab/web/actions/workflows/ci.yml)
[![SEO](https://github.com/agilatorab/web/actions/workflows/seo.yml/badge.svg)](https://github.com/agilatorab/web/actions/workflows/seo.yml)
[![Pages](https://github.com/agilatorab/web/actions/workflows/pages.yml/badge.svg)](https://github.com/agilatorab/web/actions/workflows/pages.yml)
[![Release](https://github.com/agilatorab/web/actions/workflows/release.yml/badge.svg)](https://github.com/agilatorab/web/actions/workflows/release.yml)
[![License: PolyForm-Noncommercial-1.0.0](https://img.shields.io/badge/license-PolyForm--Noncommercial--1.0.0-blue.svg)](LICENSE)

- Site: https://agilator.se/
- The apps and games, with their privacy and support pages: https://apps.agilator.se/
- Source: https://github.com/agilatorab/web

## Why?

- **One place that says what the company is.** Store listings, privacy
  policies and support pages all name Agilator AB; this is the page they can
  point at, saying what we make and how to reach us — and nothing more.
- **Fast and honest.** The page is prerendered to plain HTML at build time, so
  it reads before any script runs, and it sets no cookies and loads nothing
  from third parties. What the footer promises, the build enforces.
- **Every fact lives once.** The company's facts and pitch are one module,
  `src/site.ts`; the page, the `<head>`, the social card, `robots.txt`,
  `sitemap.xml` and `llms.txt` are all rendered from it, so they cannot
  disagree.
- **The logo is a vector, coloured by the page.** The mark is traced paths that
  take their ink from `currentColor` and their iris colour from CSS, so one
  asset serves light mode, dark mode, the favicon, the social card and the
  sibling apps site.
- **Released like software.** Changeset fragments, a generated changelog, a
  tagged release served at `/`, `main` at `/preview/`, and a parked branch at
  `/branch/` — the same pipeline as the apps themselves.

## Prerequisites

- Node.js ≥ 22 (CI pins 24 — see `.nvmrc`) and npm ≥ 10.

## Install

```sh
git clone https://github.com/agilatorab/web.git
cd web
make install
```

There is nothing to configure: every dependency comes from the public npm
registry.

## Quick start

```sh
npm run dev
```

Open http://localhost:5173/. Edits under `src/` hot-reload. To see exactly what
deploys — prerendered HTML, generated crawler files, the footer's build label:

```sh
make build && npm run preview
```

## Usage

| Command            | What it does                                                      |
| ------------------ | ----------------------------------------------------------------- |
| `make build`       | Production build into `dist/`, prerendered                        |
| `make test`        | The vitest suite in `tests/`                                      |
| `make lint`        | ESLint and `tsc --noEmit`                                         |
| `make fmt`         | Prettier, writing                                                 |
| `make fmt-check`   | Prettier, checking (what CI runs)                                 |
| `make check-seo`   | Build, then the structural SEO assertions over `dist/`            |
| `make brand`       | Regenerate favicons, the social card and the standalone logos     |
| `make screenshots` | PNGs of the running site at desktop and phone width, both schemes |
| `make bump`        | The semver bump the pending changeset fragments imply             |
| `make actionlint`  | Lint the workflow YAML                                            |
| `make shellcheck`  | Lint the shell scripts                                            |

### Deploy slots

One Pages deploy carries up to three builds of the site on the same domain:

| Slot       | URL                          | Built from                         | Indexed |
| ---------- | ---------------------------- | ---------------------------------- | ------- |
| Production | https://agilator.se/         | the highest `v*` tag               | yes     |
| Preview    | https://agilator.se/preview/ | `main`, on every push              | no      |
| Branch     | https://agilator.se/branch/  | a branch parked by manual dispatch | no      |

Until the first release exists, `main` is served at `/`. See
[`docs/deployment.md`](docs/deployment.md) for how a release is cut and how a
branch is parked.

### The logo

`src/brand/Logo.tsx` renders the mark inline; `public/logo.svg` and
`public/mark.svg` are the same paths as standalone files for reuse elsewhere.
Set `--logo-iris` in CSS to colour the eyes. See [`docs/brand.md`](docs/brand.md).

## Configuration

The build reads one environment variable:

| Variable    | Default | Meaning                                                                                 |
| ----------- | ------- | --------------------------------------------------------------------------------------- |
| `VITE_BASE` | `/`     | The slot's base path. Only `/` is indexable; `/preview/` and `/branch/` ship `noindex`. |

Everything the page says comes from `src/site.ts`. Colours and type live in
`src/styles.css`. See [`docs/configuration.md`](docs/configuration.md).

## Examples

[`examples/`](examples/) holds a complete changeset fragment and the logo
inlined in a plain HTML page with the iris coloured from CSS.

## Troubleshooting

- **`make check-seo` fails with "body is an empty SPA shell"** — the prerender
  did not run; make sure the `prerender` attribute is still on the script tag
  in `index.html`.
- **`npm ci` complains the lockfile is out of sync** — run `npm install` and
  commit `package-lock.json`.
- **The `brand` CI job fails** — run `make brand` and commit `public/`; the
  committed assets must be the generated ones.

More in [`docs/troubleshooting.md`](docs/troubleshooting.md).

## Documentation

- [Getting started](docs/getting-started.md)
- [Configuration](docs/configuration.md)
- [Architecture](docs/architecture.md)
- [Deployment and releases](docs/deployment.md)
- [The brand assets](docs/brand.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Changelog](CHANGELOG.md)

This repository follows [`OSS_SPEC.md`](OSS_SPEC.md); [`AGENTS.md`](AGENTS.md)
is the guide for AI coding agents.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Bugs and requests go to
[GitHub Issues](https://github.com/agilatorab/web/issues); security problems to
[SECURITY.md](SECURITY.md), never a public issue.

## License

The source code is licensed under the
[PolyForm Noncommercial License 1.0.0](LICENSE): you may read it, run it,
change it and share it for noncommercial purposes, and you must keep the
notice. It is source-available, not a permissive open-source grant — no
commercial use without a separate agreement with Agilator AB.

**The Agilator name, the logo in `brand/` and `src/brand/`, and the derived
assets in `public/` are trademarks of Agilator AB and are not licensed.** You
may not use them to name or present anything that is not Agilator AB's, and a
fork of this site must replace them.

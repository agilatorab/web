# Agent guidance for agilator.se

This file is the canonical source of truth for AI coding agents working in this
repo. `CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `GEMINI.md`,
`.aider.conf.md` and `.github/copilot-instructions.md` are symlinks to this
file.

## OSS Spec conformance

This repository adheres to [`OSS_SPEC.md`](OSS_SPEC.md), a prescriptive
specification for open source project layout, documentation, automation and
governance. A copy lives at the repository root; its version is in the YAML
front matter at the top of the file.

Run the validator before you finish a task:

```sh
curl -fsSL https://raw.githubusercontent.com/niclaslindstedt/oss-spec/main/scripts/validate.sh | bash -s -- .
```

(or `oss-spec validate .` with the binary installed). When in doubt about a
layout, naming or workflow decision, consult the relevant section of
`OSS_SPEC.md`.

Known, deliberate deviations: the site is a marketing page, not a web app, so
§11.4 (PWA) does not apply and no manifest or service worker is shipped; and
there is no separate `website/` directory with a source extractor (§11.2)
because **the site is the deliverable** — `make website` builds it.
`version-bump.yml` is a dry run; `release.yml` cuts the tag (see below).

## Build and test commands

```sh
make install     # npm install
make build       # vite build (prerendered) into dist/
make test        # vitest — tests/**/*_test.ts
make lint        # eslint + tsc --noEmit
make fmt         # prettier --write
make fmt-check   # verify formatting (CI)
make check-seo   # build, then scripts/check-seo.mjs over dist/
make brand       # regenerate public/ brand assets from src/brand/paths.ts
make screenshots # PNGs of the running site, for the design loop
```

`npm run dev` serves with hot reload (no prerender); `npm run preview` serves
the built, prerendered `dist/` with the prerender middleware.

### Dependency install in web sessions

Claude Code on the web runs `.claude/hooks/session-start.sh` on `SessionStart`
(wired up in `.claude/settings.json`), so dependencies install automatically in
the background — do not run `make install` by hand first. It also installs
`playwright-core` with `--no-save` for the `design` skill. The hook is a no-op
outside the web environment (`CLAUDE_CODE_REMOTE`).

## Commit and PR conventions

- All commits follow [Conventional Commits](https://www.conventionalcommits.org/).
- PRs are squash-merged; the **PR title** becomes the single commit on `main`,
  so it must follow conventional-commit format.
- Breaking changes use `<type>!:` or a `BREAKING CHANGE:` footer.
- Never put a model name or an AI tool's identity in a commit, a PR body or a
  code comment.

### Watching a PR after you open it

Do not babysit a PR with polling. **Do not** schedule `send_later`, cron jobs,
`ScheduleWakeup` or timed self-check-ins to re-check CI or merge state. Open
the PR, confirm the checks you can see are green, then stop. CI failures and
review comments arrive as webhook events; react when they arrive.

## Architecture summary

A single prerendered page. There is no server, no router and no client state.

- `src/site.ts` — **the one source of every fact and every line of pitch**:
  company, tagline, description, URLs, contact, the three platforms, the
  three principles. Page components, the SEO plugin and the brand generator
  all read it. Change copy here, never in a component.
- `src/App.tsx` + `src/app/*.tsx` — the page: `Header`, `Hero`, `Platforms`,
  `Principles`, `Contact`, `Footer`. Preact function components, Tailwind
  classes, no hooks.
- `src/brand/paths.ts` — the logo as traced vector paths, split into the
  parts that colour independently (`EYES`, `IRIS`, `SLIT`, `WORD`).
  `src/brand/Logo.tsx` renders them inline; `scripts/generate-brand.mjs`
  renders the standalone SVGs, favicons and social card in `public/`.
- `src/styles.css` — Tailwind v4 plus the colour tokens for both schemes and
  the iris colour behaviour.
- `src/main.tsx` — hydrates in the browser; exports `prerender()` for the
  build (`@preact/preset-vite` with `prerender.enabled`).
- `seo-plugin.ts` — a Vite plugin that writes the `<head>` (title,
  description, canonical, Open Graph, Twitter Card, JSON-LD, theme colours,
  icons, the per-slot robots meta) and emits `robots.txt`, `sitemap.xml` and
  `llms.txt` — all from `src/site.ts`.
- `vite.config.ts` — `VITE_BASE` → the deploy slot; the footer's build label.
- `lib/output.mjs` — the §19.4 central output module the Node scripts
  log through. No `console.*` elsewhere in `scripts/`.
- `scripts/release/` — changeset fragments → changelog → bump, shared verbatim
  with the sibling `contacts` repository.

### The renderer is Preact

`preact` is the only renderer dependency — never add `react` or `react-dom`.
JSX compiles against `preact/jsx-runtime` (`jsxImportSource` in
`tsconfig.json`). Two things bite in new code: use `e.currentTarget` rather
than `e.target`, and spell string-valued attributes like SVG's `focusable` as
`"false"`, not a JSX boolean.

### Prerendered, not a shell

The build writes the page's HTML into `dist/index.html`; the client hydrates
it. `make check-seo` fails if the body is empty. Anything that only works in a
browser must be guarded (`typeof window !== "undefined"`), because
`prerender()` runs under Node.

### Keep it small

The page's critical path is the HTML, one CSS file and one small JS bundle.
Before adding a dependency, ask whether the first paint needs it. Fonts are
self-hosted (`@fontsource-variable/inter`); nothing loads from a third party,
and the footer says so — keep that true.

## Source protection

The code is source-available under PolyForm Noncommercial 1.0.0, and the name
and logo are trademarks outside that grant (README → License). In code:

- Every source file starts with `// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0`.
- `build.sourcemap` stays `false` — the published bundle is minified with no
  map back to the source layout.
- The brand assets are generated from `src/brand/paths.ts` by `make brand`;
  CI's `brand` job fails if `public/` differs from what the script produces.

## Where new code goes

| Change type              | Goes in                                                                     |
| ------------------------ | --------------------------------------------------------------------------- |
| Copy, facts, links       | `src/site.ts`                                                               |
| A page section           | `src/app/<Section>.tsx`, mounted from `src/App.tsx`                         |
| Colours, type, tokens    | `src/styles.css`                                                            |
| Logo / brand             | `src/brand/`, then `make brand`                                             |
| `<head>` / crawler files | `seo-plugin.ts`                                                             |
| Build / slots            | `vite.config.ts`, `.github/workflows/pages.yml`                             |
| Node tooling             | `scripts/`, logging through `lib/output.mjs`                                |
| Tests                    | `tests/<module>_test.ts`                                                    |
| Docs                     | `docs/`                                                                     |
| Examples                 | `examples/`                                                                 |
| LLM prompts              | `prompts/<name>/<major>_<minor>_<patch>.md` (none today)                    |
| Agent skills             | `.agents/skills/<name>/` (+ a row in `maintenance/SKILL.md` for `update-*`) |

## Test conventions

- **All tests live in separate files** under `tests/` — never inline in source.
- Test files are named with a `_test` suffix (e.g. `seo_test.ts`), per §20 of
  `OSS_SPEC.md`; vitest picks up `tests/**/*_test.ts` (`vitest.config.ts`).
- Tests cover the pure modules — `src/site.ts`, the renderers in
  `seo-plugin.ts`, the release scripts — and run in a node environment, no
  DOM. Run one with `npx vitest run tests/seo_test.ts`.
- Visual changes are verified with the `design` skill's screenshot loop at
  phone width and desktop, light and dark — not with tests.

## Source file size

- Non-test source files stay under **1000 physical lines** (§20.5 of
  `OSS_SPEC.md`). Split by concern rather than relax the cap.
- A file may opt out with `oss-spec:allow-large-file: <reason>` in its first
  20 lines; the reason must be real.

## Documentation sync points

| When you change…                              | Update…                                                                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `src/site.ts` (facts, platforms, contact)     | `README.md` intro, `docs/architecture.md`, the JSON-LD in `seo-plugin.ts` if a field maps to it |
| `Makefile` / npm scripts                      | `README.md` Usage, `docs/getting-started.md`, `CONTRIBUTING.md`                                 |
| `VITE_BASE` handling, the build label         | `docs/configuration.md`, `docs/deployment.md`                                                   |
| `.github/workflows/pages.yml` / `release.yml` | `docs/deployment.md`, `README.md` → Deploy slots                                                |
| `src/brand/**`, `scripts/generate-brand.mjs`  | `docs/brand.md`, `make brand` (commit `public/`)                                                |
| `seo-plugin.ts`, `scripts/check-seo.mjs`      | `docs/architecture.md`, `docs/troubleshooting.md`                                               |
| anything user-visible                         | a `.changes/unreleased/` changeset fragment                                                     |

## Changelog

Every user-visible change needs a **changeset fragment** at
`.changes/unreleased/<unix-ts>-<slug>.md`:

```
---
type: Added         # Added | Changed | Fixed | Removed | Security | Deprecated
title: Short title  # optional — bolded at the head of the bullet
---

One sentence users will read in the changelog.
```

CI's `changeset` check fails a PR that ships user-visible behaviour without
one (skip-list in `scripts/release/check-changeset.mjs`; label `no-changelog`
to opt out). The Release workflow collates fragments into the dated
`CHANGELOG.md` sections — those are **generated; never hand-edit them**. Keep
the bullet to one sentence.

### Cutting a release

Dispatch **Release** (`release.yml`) on `main`. With `bump: auto` it derives
the bump from the fragments (breaking → major, Added/Changed/Removed/
Deprecated → minor, Fixed/Security → patch), writes the changelog, bumps
`package.json`, tags `vX.Y.Z`, creates the GitHub Release and chains into
`pages.yml` so the tag is served at `/` immediately. **Version bump**
(`version-bump.yml`) is the dry run: it reports what a release would be and
pushes nothing.

## Parity / cross-cutting rules

- `src/site.ts` is the only place copy lives. A string that appears in a
  component and in `<head>` must come from there.
- The colour tokens in `src/styles.css` and the hard-coded colours in
  `scripts/generate-brand.mjs` (favicon, touch icon, social card) must agree;
  change them together.
- The sibling repository `agilatorab/apps` inlines `public/logo.svg` /
  `public/mark.svg` and mirrors these tokens; when the brand or palette
  changes here, change it there in the same sitting.
- `scripts/release/*.mjs` is shared verbatim with `niclaslindstedt/contacts`;
  fix bugs upstream there and copy, rather than fork the behaviour.
- Non-production slots must stay `noindex,nofollow` with a disallowing
  `robots.txt` (`seo-plugin.ts` keys this off `VITE_BASE`); `tests/seo_test.ts`
  pins it.

## Website staleness

Per §11.2 of `OSS_SPEC.md`, the site must not drift from its sources. Here the
site is the product and its facts live in `src/site.ts`, so drift is a stale
`README.md` or `docs/` page — run the `update-readme` / `update-docs` skills,
or the `maintenance` sweep, after a change that alters what the page says or
how it is built.

## Maintenance skills

Per §21 of `OSS_SPEC.md`, this repo ships agent skills for keeping drift-prone
artifacts in sync with their sources of truth. Skills live under
`.agents/skills/<name>/`; `.claude/skills` is a symlink to that tree.

| Skill           | When to run                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| `maintenance`   | When several artifacts have likely drifted at once — runs every `update-*` skill in its registry order. |
| `sync-oss-spec` | When the validator reports violations, or after a spec bump.                                            |
| `update-docs`   | After any change to the build, the slots, the SEO plugin or the brand pipeline.                         |
| `update-readme` | After any change that alters commands, slots, configuration or the site's own facts.                    |
| `design`        | Manual playbook — the edit / screenshot / inspect loop for visual work. Not part of the sweep.          |

Each skill has a `SKILL.md` (the playbook) and a `.last-updated` file (the
baseline commit hash). The `maintenance` skill's **Registry** table lists every
`update-*` skill — add a row whenever you create one.

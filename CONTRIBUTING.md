# Contributing to agilator.se

Thanks for your interest. This is a small site with a deliberately small
surface, but fixes, wording improvements and accessibility reports are all
welcome. This document covers the setup, the conventions and how a change gets
merged.

## Prerequisites

- Node.js ≥ 22 (CI pins 24 — see `.nvmrc`) and npm ≥ 10.
- Nothing else: every dependency comes from the public npm registry.

## Getting the source

```sh
git clone https://github.com/agilatorab/web.git
cd web
make install
```

## Build, test, lint

```sh
make build       # vite build, prerendered, into dist/
make test        # vitest
make lint        # eslint + tsc --noEmit
make fmt-check   # prettier
make check-seo   # build, then the structural SEO assertions over dist/
make brand       # regenerate favicons, social card and logo SVGs
```

`npm run dev` serves the site with hot reload; `npm run preview` serves the
prerendered build.

## Development workflow

1. Fork the repo.
2. Create a topic branch: `git checkout -b feat/<slug>` or `fix/<slug>`.
3. Make focused commits using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   <type>(<scope>): <summary>
   ```
   Types: `feat`, `fix`, `perf`, `docs`, `test`, `refactor`, `chore`, `ci`,
   `build`, `style`. Breaking changes: `<type>!:` or a `BREAKING CHANGE:`
   footer.
4. If the change is user-visible, add a changelog fragment under
   `.changes/unreleased/` (CI enforces this via the `changeset` job):

   ```
   .changes/unreleased/$(date +%s)-short-slug.md
   ---
   type: Added        # Added | Changed | Fixed | Removed | Security | Deprecated
   breaking: true     # optional — forces a major release
   ---

   One line users will read in the changelog.
   ```

   Pure refactors, CI/build tweaks and docs-only PRs are exempt (skip-list in
   `scripts/release/check-changeset.mjs`); or label the PR `no-changelog` to
   opt out. The Release workflow collates fragments into `CHANGELOG.md` and
   derives the semver bump — run `make bump` to preview it.

5. Open a PR. The **PR title** must be in conventional-commit format because we
   squash-merge and that title becomes the commit message on `main`.
6. CI must be green and the maintainer must approve.

## Tests

Tests live in `tests/` with a `_test` suffix (OSS_SPEC §20.2) and cover the
pure modules: the site facts in `src/site.ts` and the renderers in
`seo-plugin.ts` (head tags, robots, sitemap, llms.txt, JSON-LD). They run under
Node with no DOM. Run one file with `npx vitest run tests/seo_test.ts`. A
visual change should be checked with the screenshot loop in
`.agents/skills/design/SKILL.md` at phone width as well as desktop.

## Documentation

If your change alters what a visitor sees, how the site is built or how it is
deployed, update the relevant page under `docs/` and, where it matters, the
README. `AGENTS.md` has the full sync table.

## Where to ask

- Bugs and feature requests: [GitHub Issues](https://github.com/agilatorab/web/issues).
- Questions and anything not issue-shaped: `support@agilator.se`.
- Security problems: see [SECURITY.md](SECURITY.md) — never a public issue.

## Governance

Agilator AB owns the site and the repository. The maintainer,
[@niclaslindstedt](https://github.com/niclaslindstedt), merges PRs and makes
final decisions; disagreements are resolved in the PR thread, and sustained,
high-quality contributions are the path to being invited as a maintainer.
Should the project be abandoned, the license permits noncommercial forks — open
an issue first so a successor can be blessed. The Agilator name and logo are
not part of what the license grants; see the README's License section.

## Code of Conduct

By participating you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

## Reporting security issues

See [SECURITY.md](SECURITY.md). Do **not** open public issues for security
problems.

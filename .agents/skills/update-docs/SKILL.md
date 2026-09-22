---
name: update-docs
description: "Use when files under docs/ may be stale. Discovers commits since the last docs update, maps changed source files to affected pages, and brings docs/*.md back into sync."
---

# Updating the docs

**Governing spec sections:** §11.1 (`docs/` — getting-started, configuration, architecture, troubleshooting), §21.5 (this skill is mandated because `docs/` is a drift-prone artifact).

`docs/` explains the site to a contributor: how to run it, what the environment variables do, how it is put together, how it deploys and what to do when something breaks. It drifts whenever the source it describes changes.

## Tracking mechanism

`.agents/skills/update-docs/.last-updated` contains the git commit hash from the last successful run. Empty means "never run" — fall back to the initial commit of the repository (`git rev-list --max-parents=0 HEAD`).

## Discovery process

1. Read the baseline:

   ```sh
   BASELINE=$(cat .agents/skills/update-docs/.last-updated)
   ```

2. List commits and changed files since then:

   ```sh
   git log --oneline "$BASELINE"..HEAD
   git diff --name-only "$BASELINE"..HEAD
   ```

3. Categorize with the mapping table below and read each affected page before editing.

## Mapping table

| Changed files / scope                                        | Doc page(s) to update                         |
| ------------------------------------------------------------ | --------------------------------------------- |
| `Makefile`, `package.json` scripts, `.nvmrc`                 | `docs/getting-started.md`                     |
| `vite.config.ts` (`VITE_BASE`, build label), `seo-plugin.ts` | `docs/configuration.md`, `docs/deployment.md` |
| `src/**`, `index.html`, `seo-plugin.ts` structure            | `docs/architecture.md`                        |
| `.github/workflows/pages.yml`, `release.yml`                 | `docs/deployment.md`                          |
| `src/brand/**`, `scripts/generate-brand.mjs`, `public/*.svg` | `docs/brand.md`                               |
| `scripts/check-seo.mjs`, `.github/lighthouse/`               | `docs/troubleshooting.md`                     |
| `.claude/hooks/`, `.agents/skills/design/`                   | `docs/troubleshooting.md`                     |

Extend this table whenever you find a new source → doc relationship.

## Update checklist

- [ ] Read baseline and diff
- [ ] Walk the mapping table; edit each affected page
- [ ] Check that every command in `docs/` is a real Makefile target or npm script
- [ ] Check that cross-links between docs and from the README resolve
- [ ] Run `make build` (the build reads nothing from docs, but a doc that names a file that no longer exists is the usual drift)
- [ ] Write the new baseline:

      git rev-parse HEAD > .agents/skills/update-docs/.last-updated

## Verification

1. Re-read every edited page against its source of truth.
2. No "TODO" or placeholder text remains.
3. `.last-updated` holds the new `HEAD`.

## Skill self-improvement

1. **Grow the mapping table** with each new source → doc relationship.
2. **Record recurring edits** as patterns here.
3. **Commit the skill edit** with the docs edit.

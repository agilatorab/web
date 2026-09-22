---
name: update-readme
description: "Use when README.md may be stale. Discovers commits since the last README update, identifies what user-facing surfaces changed, and brings README.md back into sync."
---

# Updating the README

**Governing spec sections:** §3 (`README.md` — required sections and content), §21.5 (this skill is mandated because `README.md` is a drift-prone artifact).

`README.md` is the front door of the repository: what the site is, why it exists, how to run it, how it deploys, and the license. It goes stale whenever a command, a deploy slot, a workflow or one of the site's own facts changes without a matching edit.

## Tracking mechanism

`.agents/skills/update-readme/.last-updated` contains the git commit hash from the last successful run. Empty means "never run" — fall back to the initial commit of the repository (`git rev-list --max-parents=0 HEAD`).

## Discovery process

1. Read the baseline:

   ```sh
   BASELINE=$(cat .agents/skills/update-readme/.last-updated)
   ```

2. List commits since the baseline:

   ```sh
   git log --oneline "$BASELINE"..HEAD
   ```

3. List changed files:

   ```sh
   git diff --name-only "$BASELINE"..HEAD
   ```

4. Categorize the changes using the mapping table below.

5. Read the current `README.md` so you preserve voice and unrelated sections while editing.

## Mapping table

| Changed files / scope                               | README section(s) to update |
| --------------------------------------------------- | --------------------------- |
| `Makefile`, `package.json` scripts                  | **Usage**, **Quick start**  |
| `src/site.ts` (facts, platforms, contact)           | intro paragraph, **What**   |
| `.github/workflows/pages.yml`, `docs/deployment.md` | **Usage** → deploy slots    |
| `seo-plugin.ts`, `vite.config.ts` env handling      | **Configuration**           |
| `.nvmrc`, `package.json` engines                    | **Prerequisites**           |
| `LICENSE`, brand/trademark notes                    | **License**, badges         |
| `docs/*.md` added or removed                        | **Documentation** link list |
| `examples/`                                         | **Examples**                |

Extend this table every time you find a new source-of-truth file that feeds the README.

## Update checklist

- [ ] Read baseline from `.last-updated` and run `git log` / `git diff --name-only`
- [ ] Read the current `README.md`
- [ ] Walk the mapping table and update each affected section
- [ ] Verify every shell example is still a real Makefile target or npm script
- [ ] Verify every relative link resolves
- [ ] Run `make test` and `make build`
- [ ] Write the new baseline:

      git rev-parse HEAD > .agents/skills/update-readme/.last-updated

## Verification

1. Re-read every edited section against the corresponding source of truth.
2. `README.md` still has the twelve §3 sections in order.
3. Confirm `.last-updated` was rewritten with the new `HEAD`.

## Skill self-improvement

After a run, improve this file in place:

1. **Grow the mapping table** with any new source → README relationship you discovered.
2. **Record patterns** for recurring edits.
3. **Commit the skill edit** together with the README edit so the knowledge compounds.

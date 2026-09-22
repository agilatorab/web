---
name: maintenance
description: "Use when you want to bring every drift-prone artifact in the repo back into sync. Dispatches to all individual update-* skills in the correct order, aggregates their results, and leaves a single combined PR ready to review."
---

# Maintenance

The umbrella skill for agilator.se, mandated by §21.6 of `OSS_SPEC.md`. It does no rewriting itself — it decides which sync skills are stale, runs each one, and reports a combined summary. Use it when you do not know which specific artifact is out of date, or when several have likely drifted at once.

## When to run

- After a big merge when you are not sure which surfaces moved.
- Before a release, as a drift sweep.
- When `oss-spec validate .` (or `scripts/validate.sh` from the oss-spec repo) reports violations and it is unclear which skill owns them.

Do **not** use this skill for a targeted fix — if you know which artifact is stale, call the corresponding `update-*` skill directly.

## Registry

The registry is the single source of truth for which sync skills exist in this repo. Every `update-*` directory under `.agents/skills/` must appear here exactly once; add a row whenever you create a new sync skill.

| Skill           | Fixes                                                            | Spec sections             | Run order                                                       |
| --------------- | ---------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------- |
| `sync-oss-spec` | Repo contents vs. the latest `OSS_SPEC.md` fetched from GitHub   | all structural §§ + §21.5 | 1 — run first so every downstream skill reads the freshest spec |
| `update-docs`   | `docs/*.md` vs. `src/site.ts`, `seo-plugin.ts`, the workflows    | §11.1                     | 2                                                               |
| `update-readme` | `README.md` vs. the commands, the slots and the site's own facts | §3                        | 3                                                               |

`design` is a manual playbook (the screenshot loop) and not part of the sweep.

## Tracking mechanism

`.agents/skills/maintenance/.last-updated` holds the commit hash of the last successful sweep. Empty means "never run" — use the repository's initial commit (`git rev-list --max-parents=0 HEAD`) as the baseline.

## Discovery process

For each skill in the registry, decide whether it needs to run:

1. Read the skill's `.last-updated` file:

   ```sh
   BASELINE=$(cat .agents/skills/<skill>/.last-updated)
   ```

   An empty or missing file means "never run" — schedule it.

2. Diff the watched paths for that skill against the baseline:

   ```sh
   git diff --name-only "$BASELINE"..HEAD
   ```

   If any file in the skill's mapping table appears in the diff, schedule the skill.

3. Build the list of skills to run, preserving the run order from the registry.

## Mapping table

| Changed files / scope                                        | Skill to schedule |
| ------------------------------------------------------------ | ----------------- |
| `OSS_SPEC.md`, `.github/`, root governance files, `.agents/` | `sync-oss-spec`   |
| `src/`, `seo-plugin.ts`, `vite.config.ts`, `scripts/`        | `update-docs`     |
| `docs/`, `Makefile`, `package.json`, `.github/workflows/`    | `update-readme`   |

## Update checklist

- [ ] Read every skill's `.last-updated` and build the schedule
- [ ] Run each scheduled skill in registry order, following its own checklist
- [ ] After all skills finish, run `make fmt`, `make lint`, `make test`, `make build`
- [ ] Stage every touched file (including each updated `.last-updated`)
- [ ] Commit with a conventional-commit message describing the sweep
- [ ] Update this skill's baseline:

      git rev-parse HEAD > .agents/skills/maintenance/.last-updated

## Verification

1. Every scheduled skill's verification section passes.
2. `make lint`, `make test` and `make build` pass.
3. The final diff touches only documentation, skill `.last-updated` files, and (rarely) small code adjustments the skills flagged.
4. Every skill that ran has its `.last-updated` rewritten with the same commit hash.

## Skill self-improvement

After every run, update this file:

1. **Add new sync skills to the registry** with a clear run-order slot.
2. **Adjust run order** if you discovered a hidden dependency.
3. **Record drift signals.** If a change should have triggered a skill but did not appear in any mapping table, extend that skill's table — not this one.
4. **Commit the skill edits** together with the sweep.

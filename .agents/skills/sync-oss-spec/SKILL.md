---
name: sync-oss-spec
description: "Use when the repository may have drifted out of conformance with OSS_SPEC.md. Runs the oss-spec validator, walks the violations, and fixes each one until the repo is back in sync."
---

# Syncing the repo with OSS_SPEC.md

`OSS_SPEC.md` is the specification this repo claims to conform to. This skill runs the validator, inspects each violation, and brings the repository back into conformance — the repo-side counterpart to a spec bump.

## Tracking mechanism

`.agents/skills/sync-oss-spec/.last-updated` contains the git commit hash of the last successful run. Empty means "never run" — use the repo's initial commit (`git rev-list --max-parents=0 HEAD`) as the baseline.

## Discovery process

1. Read the baseline:

   ```sh
   BASELINE=$(cat .agents/skills/sync-oss-spec/.last-updated)
   git diff --name-only "$BASELINE"..HEAD
   ```

2. Run the validator. With the `oss-spec` binary installed:

   ```sh
   oss-spec validate .
   ```

   Without it (sandboxed sessions, CI without cargo), the bash mirror needs no install:

   ```sh
   curl -fsSL https://raw.githubusercontent.com/niclaslindstedt/oss-spec/main/scripts/validate.sh | bash -s -- .
   ```

   The script overwrites `OSS_SPEC.md` with the upstream copy; `git diff -- OSS_SPEC.md` is then the list of mandates that changed since the last pass.

3. Read the whole output — the structural violations and the qualitative checklist — and read the cited section of `OSS_SPEC.md` for each before fixing it.

## Mapping table

| Violation spec section            | Where to fix it                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| §2 / §4 / §5 / §6 root files      | Create or fix `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`         |
| §3 README sections                | Run `update-readme`                                                                     |
| §7.1 tool file is not a symlink   | `ln -sf AGENTS.md <file>` (or `ln -sf ../AGENTS.md .github/copilot-instructions.md`)    |
| §9 Makefile target missing        | Add it to `Makefile` and make sure it runs                                              |
| §10 / §11.3.10 workflow missing   | Add it under `.github/workflows/`, modelled on the sibling `contacts` repo              |
| §11.3 SEO scaffolding             | `seo-plugin.ts`, `scripts/check-seo.mjs`, `.github/lighthouse/lighthouserc.json`        |
| §13.5 prompts                     | `prompts/README.md` (this project makes no LLM calls)                                   |
| §15 templates                     | `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/dependabot.yml` |
| §20 tests inline / misnamed       | Move to `tests/<name>_test.ts`                                                          |
| §20.5 source file over 1000 lines | Split by concern                                                                        |
| §21 skills                        | `.agents/skills/<name>/SKILL.md` + `.last-updated`; `.claude/skills` symlink            |

## Update checklist

- [ ] Run the validator and capture the full output to a file
- [ ] Fix every structural violation
- [ ] Walk the qualitative checklist section by section
- [ ] Re-run until "Structural violations: none"
- [ ] `make fmt && make lint && make test && make build`
- [ ] Write the new baseline:

      git rev-parse HEAD > .agents/skills/sync-oss-spec/.last-updated

## Verification

1. The validator reports no structural violations.
2. Every qualitative item you could check is either satisfied or recorded as a known exception in `AGENTS.md`.
3. `.last-updated` holds the new `HEAD`.

## Skill self-improvement

1. **Grow the mapping table** with each new violation → fix location you discover.
2. **Record exceptions** (mandates this project deliberately does not meet, and why) in `AGENTS.md`, not here.
3. **Commit the skill edit** with the conformance fixes.

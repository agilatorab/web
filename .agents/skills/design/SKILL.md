---
name: design
description: "Use whenever you are iterating on the look or layout of the site — spacing, colour, a section's composition, a mobile-only regression. Walks an edit / build / screenshot / inspect loop that renders PNGs at desktop and phone width in both colour schemes."
---

# Iterating on visual design

The site is one prerendered page (`src/App.tsx` and the sections under `src/app/`), styled with Tailwind v4 over the tokens in `src/styles.css`. It is read on phones as much as desktops and in both colour schemes, so a change is not done until it has been seen at 390px wide, light and dark. Looking at the rendered pixels every iteration is what makes tuning fast.

This skill ships a harness at `.agents/skills/design/screenshot.mjs` that connects to a running server (`npm run dev` on 5173 preferred, `npm run preview` on 4173 as the fallback), opens a headless Chromium per viewport and scheme, runs a small editable **recipe**, and writes one PNG per combination to `/tmp/design-<viewport>-<scheme>.png`. The Read tool renders PNGs inline, so the loop never leaves the session.

> **Prerequisite:** `playwright-core`, deliberately not a project dependency. A Claude Code web session installs it via the SessionStart hook and has a Chromium at `/opt/pw-browsers/chromium`, which the harness finds on its own. Locally: `npm i --no-save playwright-core && npx playwright-core install chromium` (or set `CHROMIUM_PATH`).

## When to invoke

- Tuning padding, type size, colour or radius on any section.
- Reworking a section's layout or adding one.
- Chasing a phone-only bug (a nav that overflows, text that wraps badly).
- Verifying a Tailwind class actually applies.

Do **not** invoke for changes with no visible surface (the SEO plugin, the release scripts, the workflows) — `make test` and `make check-seo` are the loop there.

## Tracking mechanism

`.agents/skills/design/.last-updated` holds the commit the harness was last verified against. This is a manual playbook, not a sync skill: it is not in the `maintenance` registry, and the baseline is only rewritten after a run confirmed the harness still works.

## Discovery process

1. Start a server once and leave it running:

   ```sh
   npm run dev &            # hot reload, unprerendered
   # or, to see exactly what deploys:
   npm run build && npm run preview &
   ```

2. Edit the recipe at the bottom of `screenshot.mjs` if the state you need is not the default (the page as loaded).

3. Edit the code under `src/`. One targeted change per iteration.

4. Shoot:

   ```sh
   node .agents/skills/design/screenshot.mjs --viewports desktop,mobile --schemes light,dark
   ```

5. Read `/tmp/design-desktop-light.png`, `/tmp/design-mobile-light.png` and the dark pair. Adjust and repeat.

## Mapping table

| Surface                     | Source                                   | Shoot at                        |
| --------------------------- | ---------------------------------------- | ------------------------------- |
| Header / navigation         | `src/app/Header.tsx`                     | `mobile` first — it is tightest |
| Hero and logo               | `src/app/Hero.tsx`, `src/brand/Logo.tsx` | both, both schemes              |
| Platform cards              | `src/app/Platforms.tsx`                  | `mobile` (stacked), `desktop`   |
| Principles band             | `src/app/Principles.tsx`                 | both                            |
| Contact and footer          | `src/app/Contact.tsx`, `Footer.tsx`      | both                            |
| Tokens, fonts, iris colours | `src/styles.css`                         | both schemes                    |

## Update checklist

- [ ] Server running, harness shoots without error
- [ ] Every edit checked at `mobile` and `desktop`, light and dark
- [ ] No horizontal overflow at 390px (`document.documentElement.scrollWidth === 390`)
- [ ] `make lint`, `make test`, `make build`, `make check-seo` pass
- [ ] A user-visible change has a `.changes/unreleased/` fragment
- [ ] Recipe reverted to the default; any reusable step promoted into the harness

## Verification

1. The mobile PNGs match the intended design — this is a hard gate.
2. The desktop PNGs match, and neither scheme regressed.
3. If the harness itself changed, it was run once through the change, and `.last-updated` was rewritten:

   git rev-parse HEAD > .agents/skills/design/.last-updated

## Skill self-improvement

- Promote any step a recipe needed into a named helper in the harness, with a comment recording the gotcha, and keep it when you revert the recipe.
- If a new viewport mattered (a narrow band where a breakpoint flips), add it to `VIEWPORTS` and note why here.
- Commit the skill edit with the design edit.

#!/bin/bash
# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
#
# SessionStart hook for Claude Code on the web. Installs the npm dependencies
# in the background so `make lint` / `make test` / `make build` work the moment
# a web session opens — no waiting for a manual `npm install` first.
set -euo pipefail

# Announce async mode: this line must be the first thing on stdout. The
# install then runs in the background while the session starts.
echo '{"async": true, "asyncTimeout": 600000}'

# Only the remote (web) environment needs this; locally you run `make install`
# when you want it.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-"$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"}"

# Prefer `npm install` over `npm ci`: it reuses whatever is already in
# node_modules, so a re-run after the container cache warms is cheap, and it
# never wipes a partially-populated tree.
npm install --no-audit --no-fund

# The `design` skill drives a headless Chromium through Playwright to
# screenshot the site while iterating on it. Playwright is deliberately NOT a
# project dependency — no build/test/lint step uses it — but a web session has
# the Chromium binary preinstalled, so the only missing piece is the small,
# browserless `playwright-core` package. `--no-save` keeps package.json and the
# lockfile untouched. Non-fatal: only the design skill needs it.
npm install --no-save --no-audit --no-fund playwright-core@1 \
  || echo "session-start: playwright-core install failed — the design skill" \
          "won't run until it's installed; nothing else needs it." >&2

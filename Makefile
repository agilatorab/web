.PHONY: build test lint fmt fmt-check release clean install brand check-seo screenshots changelog bump actionlint shellcheck docs website website-dev

build:
	npm run build

test:
	npm test

lint:
	npm run lint

fmt:
	npm run fmt

fmt-check:
	npm run fmt:check

release:
	npm run build

clean:
	rm -rf dist node_modules

install:
	npm install

# Regenerate the favicons, the social card and the standalone logo SVGs from
# src/brand/paths.ts. CI checks the committed copies match.
brand:
	npm run brand

# Structural SEO assertions over dist/ (OSS_SPEC §11.3). Builds first.
check-seo:
	npm run build && npm run check:seo

# One PNG per viewport and colour scheme of the running site, for the design
# loop (see .agents/skills/design/SKILL.md). Needs `npm run dev` or
# `npm run preview` up, and playwright-core installed.
screenshots:
	node .agents/skills/design/screenshot.mjs

# Shell scripts and workflow YAML get the same zero-warning treatment as the
# TypeScript (OSS_SPEC §16.1).
actionlint:
	actionlint -color

shellcheck:
	shellcheck .claude/hooks/*.sh

docs:
	@echo "see docs/"

# The site IS the website: pages.yml builds it once per deploy slot and
# deploys dist/. These targets mirror that for local inspection.
website:
	VITE_BASE=/preview/ npm run build

website-dev:
	npm run dev

# Local preview of what the Release workflow will write to CHANGELOG.md.
# Pass the planned version: `make changelog VERSION=0.2.0`. Consumes the
# fragments in .changes/unreleased/ — run inside a scratch branch or
# revert afterwards if you only wanted a preview.
changelog:
	@test -n "$(VERSION)" || { \
		echo "usage: make changelog VERSION=X.Y.Z"; exit 2; \
	}
	node scripts/release/collate-changelog.mjs $(VERSION)

# Print the semver bump (patch/minor/major) the Release workflow will
# auto-derive from the current .changes/unreleased/ fragments. Read-only
# — touches nothing.
bump:
	@node scripts/release/compute-bump.mjs

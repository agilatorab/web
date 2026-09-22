// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
//
// The release scripts are shared verbatim with the sibling contacts repo; these
// tests pin that the fragments this repo ships (and the example contributors
// copy) parse the way the Release workflow will parse them.
import { readdirSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  computeBump,
  fragmentLevel,
} from "../scripts/release/compute-bump.mjs";
import {
  parseFragment,
  readFragments,
  TYPES,
} from "../scripts/release/fragments.mjs";

describe("changeset fragments", () => {
  it("the example fragment parses and bumps minor", () => {
    const fragment = parseFragment("changeset-fragment.md", "examples");
    expect(TYPES).toContain(fragment.type);
    expect((fragment.front as Record<string, string>).title).toBe(
      "Sharper hero copy",
    );
    expect(fragment.body.split("\n")).toHaveLength(1);
    expect(fragmentLevel(fragment)).toBe("minor");
  });

  it("every pending fragment parses and keeps its bullet to one sentence", () => {
    const fragments = readFragments();
    for (const fragment of fragments) {
      expect(TYPES).toContain(fragment.type);
      expect(fragment.body).not.toContain("\n");
    }
    // A release with fragments always has a bump; an empty set means none.
    if (fragments.length) {
      expect(["patch", "minor", "major"]).toContain(computeBump(fragments));
    }
  });

  it("fragment filenames follow <unix-ts>-<slug>.md", () => {
    for (const name of readdirSync(".changes/unreleased")) {
      if (name.startsWith(".")) continue;
      expect(name).toMatch(/^\d{10}-[a-z0-9-]+\.md$/);
    }
  });
});

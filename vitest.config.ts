// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Tests cover the pure modules (site config, the SEO plugin's renderers,
    // the release scripts) and run in a node environment — no DOM.
    include: ["tests/**/*_test.ts"],
    environment: "node",
  },
});

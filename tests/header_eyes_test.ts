// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { describe, expect, it } from "vitest";

import {
  ease,
  lead,
  markInset,
  progress,
  wordOpacity,
} from "../src/app/header-eyes.ts";
import { VIEWBOX_FULL, VIEWBOX_MARK } from "../src/brand/paths.ts";

describe("markInset", () => {
  it("places the mark's viewBox inside the full logo's", () => {
    const inset = markInset("0 0 100 50", "20 10 60 25");
    expect(inset).toEqual({ x: 0.2, y: 0.2, w: 0.6, h: 0.5 });
  });

  it("keeps the real eyes inside the real logo", () => {
    const { x, y, w, h } = markInset(VIEWBOX_FULL, VIEWBOX_MARK);
    expect(x).toBeGreaterThanOrEqual(0);
    expect(y).toBeGreaterThanOrEqual(0);
    expect(x + w).toBeLessThanOrEqual(1);
    expect(y + h).toBeLessThanOrEqual(1);
    // The eyes sit across the top of the wordmark, not beside it.
    expect(y).toBe(0);
    expect(h).toBeLessThan(1);
  });
});

describe("progress", () => {
  it("runs from 0 at the pick-up to 1 at the settle", () => {
    expect(progress(100, 100, 150)).toBe(0);
    expect(progress(175, 100, 150)).toBe(0.5);
    expect(progress(250, 100, 150)).toBe(1);
  });

  it("clamps on both sides", () => {
    expect(progress(0, 100, 150)).toBe(0);
    expect(progress(9000, 100, 150)).toBe(1);
  });

  it("survives a zero-length band", () => {
    expect(progress(99, 100, 0)).toBe(0);
    expect(progress(100, 100, 0)).toBe(1);
  });
});

describe("ease", () => {
  it("pins both ends and halves the middle", () => {
    expect(ease(0)).toBe(0);
    expect(ease(0.5)).toBe(0.5);
    expect(ease(1)).toBe(1);
  });

  it("is flat at both ends, so the eyes neither jump nor snap", () => {
    const step = 1e-4;
    expect(ease(step) / step).toBeLessThan(0.01);
    expect((1 - ease(1 - step)) / step).toBeLessThan(0.01);
  });

  it("never doubles back", () => {
    let last = -1;
    for (let p = 0; p <= 1; p += 0.05) {
      const e = ease(p);
      expect(e).toBeGreaterThan(last);
      last = e;
    }
  });
});

describe("lead", () => {
  it("runs ahead of the settle but lands first, not late", () => {
    expect(lead(0)).toBe(0);
    expect(lead(0.2)).toBeGreaterThan(0.2);
    expect(lead(1)).toBe(1);
  });

  it("never overshoots its own end", () => {
    for (let p = 0; p <= 1; p += 0.05) expect(lead(p)).toBeLessThanOrEqual(1);
  });
});

describe("wordOpacity", () => {
  it("holds the wordmark back until the eyes have stopped moving", () => {
    expect(wordOpacity(0)).toBe(0);
    expect(wordOpacity(0.85)).toBe(0);
    expect(wordOpacity(0.925)).toBeCloseTo(0.5);
    expect(wordOpacity(1)).toBe(1);
  });
});

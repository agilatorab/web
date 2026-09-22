// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0

/**
 * Hands the eyes from the hero logo up to the header as the page scrolls.
 *
 * The header's mark is not a second pair of eyes that appears once the first
 * pair has gone: it is the same pair, continuing. The moment the hero logo's
 * eyes reach the bar the header's mark takes over in exactly their place and
 * at exactly their size, and over the next stretch of scrolling it slows out
 * of the page's motion, shrinks and settles into its slot on the left. The
 * hero logo's own eyes are hidden for as long as the header is wearing them.
 *
 * Everything below `watchHeroLogo` is pure arithmetic — the geometry and the
 * easing — so it can be read and tested without a browser.
 */

import { VIEWBOX_FULL, VIEWBOX_MARK } from "../brand/paths.ts";

/** How far the page scrolls, in px, between the handover and the settle. */
const BAND = 150;

/**
 * How much of a head start the sideways travel and the shrink get over the
 * settle. The eyes are then small and already over their slot before they
 * drop into the bar's row, so they never cross the nav at hero size, and
 * they have finished shrinking well before the wordmark fades up beside
 * them — nothing of theirs can reach across it.
 */
const LEAD = 1.5;

/** How late in the settle the header's wordmark fades up beside the eyes. */
const WORD_FROM = 0.85;

/** A viewBox as its four numbers. */
function box(viewBox: string): [number, number, number, number] {
  const [x, y, w, h] = viewBox.split(/\s+/).map(Number);
  return [x, y, w, h];
}

/**
 * Where the mark's viewBox sits inside the full logo's, as fractions of the
 * full logo's rendered box — so a hero logo of any width can say where its
 * eyes are without measuring the artwork.
 */
export function markInset(full: string, mark: string) {
  const [fx, fy, fw, fh] = box(full);
  const [mx, my, mw, mh] = box(mark);
  return { x: (mx - fx) / fw, y: (my - fy) / fh, w: mw / fw, h: mh / fh };
}

/** How far through the handover a given scroll offset is, from 0 to 1. */
export function progress(scrollY: number, start: number, band: number): number {
  if (band <= 0) return scrollY < start ? 0 : 1;
  return Math.min(1, Math.max(0, (scrollY - start) / band));
}

/**
 * Ease in and out, so the eyes leave the page's motion as gently as they
 * come to rest: flat at both ends, which is what stops the settle reading as
 * a snap.
 */
export function ease(p: number): number {
  return p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p);
}

/** The head-started clock the sideways travel, the shrink and the word run on. */
export function lead(p: number): number {
  return Math.min(1, p * LEAD);
}

/** The header wordmark's opacity at a given point on that clock. */
export function wordOpacity(eased: number): number {
  return Math.min(1, Math.max(0, (eased - WORD_FROM) / (1 - WORD_FROM)));
}

const INSET = markInset(VIEWBOX_FULL, VIEWBOX_MARK);

export function watchHeroLogo(): void {
  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>(".site-header");
  const hero = document.getElementById("hero-logo");
  const mark = document.getElementById("header-eyes");

  // Nothing to hand over from: leave the eyes in the bar, which is the useful
  // half of the behaviour — the way back to the top is always there.
  if (!header || !hero || !mark) {
    root.classList.add("past-logo");
    return;
  }

  // Past the guard these are known to exist; bind them so the closures
  // below can see that too.
  const bar = header;
  const heroLogo = hero;
  const eyes = mark;

  // Someone who has asked for less motion gets the destination, not the
  // journey: the eyes simply are in the bar once the hero logo reaches it.
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  // The flight, measured once per layout: where the eyes start (in document
  // coordinates, since they scroll with the page), where they come to rest
  // (in viewport coordinates, since the bar does not), and the size between.
  let startY = 0;
  let eyesTop = 0;
  let eyesLeft = 0;
  let restTop = 0;
  let restLeft = 0;
  let growth = 1;

  function measure(): void {
    // Read the mark where it rests, not wherever this frame left it.
    eyes.style.transform = "";
    const rest = eyes.getBoundingClientRect();
    const full = heroLogo.getBoundingClientRect();
    const barBox = bar.getBoundingClientRect();

    restTop = rest.top;
    restLeft = rest.left;
    eyesTop = full.top + INSET.y * full.height + window.scrollY;
    eyesLeft = full.left + INSET.x * full.width;
    growth = rest.width > 0 ? (INSET.w * full.width) / rest.width : 1;
    // The handover begins as the eyes meet the bar's lower edge — the moment
    // the page would otherwise start swallowing them.
    startY = eyesTop - barBox.bottom;
  }

  function paint(): void {
    const p = progress(window.scrollY, startY, BAND);
    root.classList.toggle("past-logo", p > 0);
    if (p <= 0) {
      eyes.style.transform = "";
      root.style.setProperty("--eyes-t", "0");
      root.style.setProperty("--eyes-q", "0");
      return;
    }
    const t = still.matches ? 1 : ease(p);
    const q = still.matches ? 1 : ease(lead(p));
    root.style.setProperty("--eyes-t", String(t));
    root.style.setProperty("--eyes-q", String(q));
    // What is left of the gap between where the eyes are and where they land.
    // Sideways and size are already most of the way there while the drop into
    // the bar is still riding the page up.
    const dx = (1 - q) * (eyesLeft - restLeft);
    const dy = (1 - t) * (eyesTop - window.scrollY - restTop);
    const scale = 1 + (1 - q) * (growth - 1);
    eyes.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
  }

  let frame = 0;
  function schedule(): void {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      paint();
    });
  }

  function relayout(): void {
    measure();
    paint();
  }

  relayout();
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", relayout);
  still.addEventListener("change", relayout);
  // Inter arrives after first paint and can nudge the hero's box.
  document.fonts?.ready.then(relayout).catch(() => relayout());
}

// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0

/**
 * Tells the page when the hero logo has left the screen, so the header can
 * show its own pair of eyes instead. A class on <html> carries the answer;
 * `.header-home` in `styles.css` reads it. Browser-only — `prerender()` runs
 * under Node, where there is nothing to observe.
 */

/** Set on <html> while the hero logo is out of sight above the fold. */
const PAST_LOGO = "past-logo";

/** Roughly the sticky bar's height: the logo counts as gone once under it. */
const HEADER_HEIGHT = "72px";

export function watchHeroLogo(): void {
  const root = document.documentElement;
  const logo = document.getElementById("hero-logo");
  if (!logo) return;

  // Without an observer the eyes simply stay put, which is the useful half of
  // the behaviour: the way back to the top is always there.
  if (!("IntersectionObserver" in window)) {
    root.classList.add(PAST_LOGO);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        root.classList.toggle(PAST_LOGO, !entry.isIntersecting);
      }
    },
    { rootMargin: `-${HEADER_HEIGHT} 0px 0px 0px` },
  );
  observer.observe(logo);
}

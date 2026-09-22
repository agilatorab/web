// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { JSX } from "preact";

import { Logo } from "../brand/Logo.tsx";
import { SITE } from "../site.ts";

const link =
  "rounded-md px-2 py-2 text-sm sm:px-3 font-medium text-dim transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * The bar rides along at the top of the window. Its eyes are the hero logo's
 * own: when that logo reaches the bar, `header-eyes.ts` picks its eyes up
 * where they are and flies them into the slot on the left over the next
 * stretch of scrolling, leaving them there as the way back to the top.
 */
export function Header(): JSX.Element {
  return (
    <header class="site-header sticky top-0 z-50 bg-paper/85 backdrop-blur">
      <div class="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <a
          href="#top"
          class="header-home flex items-center gap-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          aria-label={`${SITE.company} — back to top`}
        >
          <Logo
            id="header-eyes"
            variant="mark"
            label=""
            class="logo logo-awake header-eyes h-5 w-auto sm:h-6"
          />
          <span class="kicker header-word hidden text-ink sm:inline">
            {SITE.company}
          </span>
        </a>
        <nav
          aria-label="Primary"
          class="-mr-2 flex shrink-0 items-center gap-0 sm:-mr-3 sm:gap-1"
        >
          <a href={SITE.appsUrl} class={link}>
            Apps
          </a>
          <a href="#contact" class={link}>
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

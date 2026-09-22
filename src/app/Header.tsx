// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { JSX } from "preact";

import { Logo } from "../brand/Logo.tsx";
import { SITE } from "../site.ts";

const link =
  "rounded-md px-2 py-2 text-sm sm:px-3 font-medium text-dim transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Header(): JSX.Element {
  return (
    <header class="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
      <a
        href="#top"
        class="flex items-center gap-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        aria-label={`${SITE.company} — home`}
      >
        <Logo variant="mark" label="" class="logo h-5 w-auto sm:h-6" />
        <span class="kicker hidden text-ink sm:inline">{SITE.company}</span>
      </a>
      <nav
        aria-label="Primary"
        class="-mr-2 flex shrink-0 items-center gap-0 sm:-mr-3 sm:gap-1"
      >
        <a href={SITE.appsUrl} class={link}>
          Apps
        </a>
        <a href={SITE.githubUrl} class={link} rel="me">
          GitHub
        </a>
        <a href="#contact" class={link}>
          Contact
        </a>
      </nav>
    </header>
  );
}

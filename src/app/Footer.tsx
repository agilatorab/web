// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { JSX } from "preact";

import { Logo } from "../brand/Logo.tsx";
import { SITE } from "../site.ts";

const link =
  "underline-offset-2 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Footer(): JSX.Element {
  const year = new Date().getFullYear();
  return (
    <footer class="border-t border-line">
      <div class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 text-sm text-dim sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div class="space-y-3">
          <Logo variant="mark" label="" class="logo h-5 w-auto text-ink" />
          <p>
            © {year} {SITE.company} · {SITE.country}
          </p>
          <p class="max-w-md text-pretty">
            This site sets no cookies and loads nothing from third parties.
          </p>
        </div>
        <ul class="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <a href={SITE.appsUrl} class={link}>
              Apps
            </a>
          </li>
          <li>
            <a href={SITE.githubUrl} class={link} rel="me">
              GitHub
            </a>
          </li>
          <li>
            <a href={`mailto:${SITE.contact}`} class={link}>
              {SITE.contact}
            </a>
          </li>
          <li class="font-mono text-xs opacity-70" title="Build">
            {__BUILD_LABEL__}
          </li>
        </ul>
      </div>
    </footer>
  );
}

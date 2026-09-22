// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { JSX } from "preact";

import { Logo } from "../brand/Logo.tsx";
import { SITE } from "../site.ts";

export function Footer(): JSX.Element {
  const year = new Date().getFullYear();
  return (
    <footer class="border-t border-line">
      <div class="mx-auto w-full max-w-5xl space-y-3 px-4 py-10 text-sm text-dim sm:px-6">
        <div class="flex items-center justify-between gap-4">
          <Logo variant="mark" label="" class="logo h-5 w-auto text-ink" />
          <span class="font-mono text-xs opacity-70" title="Build">
            {__BUILD_LABEL__}
          </span>
        </div>
        <p>
          © {year} {SITE.company} · {SITE.country}
        </p>
        <p class="max-w-md text-pretty">
          This site sets no cookies and loads nothing from third parties.
        </p>
      </div>
    </footer>
  );
}

// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { JSX } from "preact";

import { SITE, type Platform } from "../site.ts";

/** Plain line icons — a phone, a phone, a monitor — one per storefront. */
function Icon({ id }: { id: Platform["id"] }): JSX.Element {
  const common = {
    class: "h-7 w-7 shrink-0 text-accent",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.6",
    "stroke-linecap": "round" as const,
    "stroke-linejoin": "round" as const,
    "aria-hidden": true,
    focusable: "false",
  };
  switch (id) {
    case "app-store":
      return (
        <svg {...common}>
          <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
          <path d="M10.5 5.5h3" />
        </svg>
      );
    case "google-play":
      return (
        <svg {...common}>
          <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
          <path d="M10.8 9.5v5l4-2.5z" />
        </svg>
      );
    case "steam":
      return (
        <svg {...common}>
          <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
          <path d="M8.5 20h7M12 16.5V20" />
        </svg>
      );
  }
}

export function Platforms(): JSX.Element {
  return (
    <section
      aria-labelledby="platforms-heading"
      class="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6 sm:pb-24"
    >
      <h2 id="platforms-heading" class="kicker">
        Where you find us
      </h2>
      <ul class="mt-6 grid gap-4 sm:grid-cols-3">
        {SITE.platforms.map((p) => (
          <li
            key={p.id}
            class="rounded-2xl border border-line bg-card p-6 transition-colors hover:border-accent"
          >
            <div class="flex items-center gap-3">
              <Icon id={p.id} />
              <h3 class="text-lg font-semibold">{p.name}</h3>
            </div>
            <p class="mt-2 text-sm font-medium text-accent">{p.what}</p>
            <p class="mt-3 text-sm leading-relaxed text-dim">{p.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

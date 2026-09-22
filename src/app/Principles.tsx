// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { JSX } from "preact";

import { SITE } from "../site.ts";

export function Principles(): JSX.Element {
  return (
    <section
      aria-labelledby="principles-heading"
      class="border-y border-line bg-card"
    >
      <div class="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 id="principles-heading" class="kicker">
          How we build
        </h2>
        <dl class="mt-8 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {SITE.principles.map((p) => (
            <div key={p.title}>
              <dt class="text-xl font-semibold tracking-tight">{p.title}</dt>
              <dd class="mt-3 leading-relaxed text-dim text-pretty">
                {p.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

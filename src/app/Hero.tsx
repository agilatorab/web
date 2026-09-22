// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { JSX } from "preact";

import { Logo } from "../brand/Logo.tsx";
import { SITE } from "../site.ts";

const primary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const secondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Hero(): JSX.Element {
  return (
    <section
      id="top"
      class="mx-auto w-full max-w-5xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24"
    >
      <Logo class="logo logo-awake mx-auto w-full max-w-3xl" />
      <p class="kicker mt-10 text-center sm:mt-14">
        Independent studio · {SITE.country}
      </p>
      <h1 class="mx-auto mt-4 max-w-3xl text-center text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        Apps and games, made with care.
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-dim text-pretty sm:text-xl">
        {SITE.company} builds apps for the{" "}
        <strong class="font-medium text-ink">App Store</strong> and{" "}
        <strong class="font-medium text-ink">Google Play</strong>, and games for{" "}
        <strong class="font-medium text-ink">Steam</strong>.
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href={SITE.appsUrl} class={primary}>
          See our apps
          <span aria-hidden="true">↗</span>
        </a>
        <a href="#contact" class={secondary}>
          Get in touch
        </a>
      </div>
    </section>
  );
}

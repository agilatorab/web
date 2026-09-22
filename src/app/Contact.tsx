// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { JSX } from "preact";

import { SITE } from "../site.ts";

export function Contact(): JSX.Element {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      class="mx-auto w-full max-w-5xl scroll-mt-8 px-4 py-16 sm:px-6 sm:py-24"
    >
      <h2 id="contact-heading" class="kicker">
        Contact
      </h2>
      <p class="mt-6 max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
        A question, a bug, a press enquiry, an idea — one address reads them
        all.
      </p>
      <a
        href={`mailto:${SITE.contact}`}
        class="mt-6 inline-block text-xl font-medium text-accent underline decoration-accent-soft decoration-2 underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-2xl"
      >
        {SITE.contact}
      </a>
      <p class="mt-4 max-w-2xl text-sm leading-relaxed text-dim">
        We read every message and aim to reply within a few working days. For
        help with a specific app, the app's own support page on{" "}
        <a
          href={SITE.appsUrl}
          class="underline underline-offset-2 hover:text-ink"
        >
          apps.agilator.se
        </a>{" "}
        is the quickest route.
      </p>
    </section>
  );
}

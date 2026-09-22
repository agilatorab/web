// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { JSX } from "preact";

import { Contact } from "./app/Contact.tsx";
import { Footer } from "./app/Footer.tsx";
import { Header } from "./app/Header.tsx";
import { Hero } from "./app/Hero.tsx";
import { Platforms } from "./app/Platforms.tsx";
import { Principles } from "./app/Principles.tsx";

export function App(): JSX.Element {
  return (
    <div class="flex min-h-screen flex-col">
      <Header />
      <main class="flex-1">
        <Hero />
        <Platforms />
        <Principles />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
//
// The one place the site's facts and pitch live. The page components render
// from it at runtime, the SEO plugin (`seo-plugin.ts`) writes the <head>,
// robots.txt, sitemap.xml and llms.txt from it at build time, and the brand
// generator reads it for the social card — so the copy cannot drift between
// what a visitor reads and what a crawler is told.

export const SITE = {
  /** The company, as it appears in the register and on the logo. */
  company: "Agilator AB",
  /** Short name for titles and the mark. */
  name: "Agilator",
  /** Canonical production origin. Every slot's canonical URL points here. */
  url: "https://agilator.se",
  /** One sentence — the <title> suffix, the og:description, the hero. */
  tagline: "Apps and games for the App Store, Google Play and Steam.",
  description:
    "Agilator AB is an independent studio in Sweden that builds apps for " +
    "the App Store and Google Play, and games for Steam.",
  /** Where the apps themselves are showcased. */
  appsUrl: "https://apps.agilator.se/",
  /** Where the source of this site (and the apps) lives. */
  githubUrl: "https://github.com/agilatorab",
  /** The one address for questions, support and press. */
  contact: "support@agilator.se",
  country: "Sweden",
  /** The stores and platforms the company ships to, in the order shown. */
  platforms: [
    {
      id: "app-store",
      name: "App Store",
      what: "Apps for iPhone and iPad",
      note: "Built for the devices people already carry, and kept small.",
    },
    {
      id: "google-play",
      name: "Google Play",
      what: "Apps for Android",
      note: "The same apps, the same care, for the other half of the world.",
    },
    {
      id: "steam",
      name: "Steam",
      what: "Games for PC",
      note: "Small games with a clear idea — made to be finished, not farmed.",
    },
  ],
  /** How the company builds — the three things every product shares. */
  principles: [
    {
      title: "Local-first",
      body: "What you enter stays on your device. Sync, when it exists, goes to an account you own — never through us.",
    },
    {
      title: "No tracking",
      body: "No accounts to create, no analytics, no advertising, no third-party code watching what you do.",
    },
    {
      title: "Small and quiet",
      body: "Each app does one thing well and gets out of the way. Each game respects your time.",
    },
  ],
} as const;

export type Platform = (typeof SITE.platforms)[number];

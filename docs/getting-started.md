# Getting started

The site is one page, built with [Vite](https://vite.dev/),
[Preact](https://preactjs.com/) and [Tailwind CSS](https://tailwindcss.com/),
and prerendered to static HTML. You need Node.js 22 or newer (CI uses the
version in `.nvmrc`) and npm.

## Run it

```sh
git clone https://github.com/agilatorab/web.git
cd web
make install
npm run dev
```

The dev server is at http://localhost:5173/ with hot reload. It does not
prerender — the page mounts client-side — which is fine for iterating on
layout. To see the real thing:

```sh
make build
npm run preview
```

`make build` writes `dist/`: the prerendered `index.html`, one CSS file, one JS
bundle, the self-hosted Inter font, the brand assets and the crawler files
(`robots.txt`, `sitemap.xml`, `llms.txt`). `npm run preview` serves it at
http://localhost:4173/ with the prerender middleware, so what you see is what
deploys.

## Check it

```sh
make test        # tests/**/*_test.ts
make lint        # eslint + tsc
make fmt-check   # prettier
make check-seo   # build, then assert the SEO shape of dist/
```

CI runs exactly these, plus a check that the committed brand assets match what
`make brand` generates, `actionlint` and `shellcheck`, and — on pull requests —
the changeset-fragment check.

## Change it

Everything the page says lives in `src/site.ts`. Sections are the components
under `src/app/`. Colours and type are in `src/styles.css`. The
[architecture](architecture.md) page walks through how they fit; the
[design skill](../.agents/skills/design/SKILL.md) is the screenshot loop for
visual changes.

A user-visible change needs a changeset fragment under `.changes/unreleased/`
— see `CONTRIBUTING.md` for the shape, and `examples/changeset-fragment.md`
for a complete one.

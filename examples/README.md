# Examples

Worked examples of the two things a contributor most often needs to do.

- [`changeset-fragment.md`](changeset-fragment.md) — a complete changeset
  fragment, the file every user-visible change drops into
  `.changes/unreleased/`. Copy it, rename it to `<unix-ts>-<slug>.md`, and
  edit the front matter and the sentence.
- [`inline-logo.html`](inline-logo.html) — the logo inlined in a plain HTML
  page with the iris colour set from CSS, the way a sibling site reuses the
  brand without depending on this repository's build.

Both are checked by CI: the fragment is parsed by the release scripts' own
parser in `tests/`, and the HTML is linked from nowhere the build touches, so
it can never affect the deployed site.

# The brand assets

The Agilator AB logo is two watchful eyes above the wordmark. In this
repository it is a vector, and the page colours it.

## The files

| File                          | What it is                                                            | Made by      |
| ----------------------------- | --------------------------------------------------------------------- | ------------ |
| `brand/agilator-logo.png`     | The original artwork. Kept for reference; nothing reads it.           | the designer |
| `src/brand/paths.ts`          | The traced paths: `EYES`, `IRIS`, `SLIT`, `WORD`, and two view boxes. | traced once  |
| `src/brand/Logo.tsx`          | The inline component the page uses (`variant="full"` or `"mark"`).    | hand-written |
| `public/logo.svg`             | The full logo as a standalone SVG, ink from `currentColor`.           | `make brand` |
| `public/mark.svg`             | The eyes alone, the same way.                                         | `make brand` |
| `public/favicon.svg`          | The mark with fixed colours, for tab strips.                          | `make brand` |
| `public/favicon-32.png`       | The same, rasterised.                                                 | `make brand` |
| `public/apple-touch-icon.png` | 180×180 on paper, for iOS bookmarks.                                  | `make brand` |
| `public/og.png`               | The 1200×630 social card.                                             | `make brand` |

Only `paths.ts` is edited by hand. Everything under `public/` is regenerated
with `make brand`, and CI's `brand` job fails if the committed files differ
from what the script produces.

## Colouring the eyes

The logo's ink is `currentColor`, so it takes the surrounding text colour. The
irises are painted in `var(--logo-iris, transparent)`: with the variable unset
they are holes, like the original artwork; set it and the eyes take that
colour. On the page, `.logo` in `src/styles.css` gives them a resting green
that brightens to the accent on hover, focus, or with the `logo-awake` class
(the hero uses it).

To reuse the logo elsewhere, inline `public/logo.svg` or `public/mark.svg` and
set the two colours from CSS:

```css
.brand {
  color: #2b332f; /* ink */
  --logo-iris: #2f8a5b; /* eyes */
}
```

`examples/inline-logo.html` is a complete page doing exactly that.

## How the trace was made

The PNG was thresholded at 150 and traced with potrace (turd size 20, curve
tolerance 0.4), giving one path of twenty-one subpaths. Their bounding boxes
identify them: the two brows and two eye outlines (`EYES`), the two almond
irises (`IRIS`), the two slits (`SLIT`), and the thirteen letter shapes
(`WORD`). Coordinates were rounded to one decimal. If the artwork ever changes,
repeat that and replace the four constants; nothing else needs to know.

## Trademark

The Agilator name and logo are trademarks of Agilator AB and are not covered
by the repository's license. A fork of this site must replace them.

// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { JSX } from "preact";

import { EYES, IRIS, SLIT, VIEWBOX_FULL, VIEWBOX_MARK, WORD } from "./paths.ts";

type LogoProps = {
  /** `full` is eyes + wordmark; `mark` is the eyes alone. */
  variant?: "full" | "mark";
  /**
   * The iris colour. Defaults to the `--logo-iris` custom property, so a
   * stylesheet can light the eyes up (or on hover) without touching the
   * component; with neither set the iris is a hole, like the source artwork.
   */
  iris?: string;
  /** Decorative logos (next to a text label) pass an empty string. */
  label?: string;
  /** Set when something on the page needs to find this particular logo. */
  id?: string;
  class?: string;
};

/**
 * The Agilator AB logo, inline so it paints with the first byte of CSS and
 * takes its ink colour from `currentColor` — one asset for light and dark.
 * The eyes are their own group: the header borrows the hero logo's pair on
 * the way past, and needs to hide the originals while it wears them.
 */
export function Logo({
  variant = "full",
  iris,
  label = "Agilator AB",
  id,
  class: className,
}: LogoProps): JSX.Element {
  const mark = variant === "mark";
  const style = iris ? { "--logo-iris": iris } : undefined;
  return (
    <svg
      viewBox={mark ? VIEWBOX_MARK : VIEWBOX_FULL}
      id={id}
      class={className}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : "true"}
      focusable="false"
    >
      <g class="logo-eyes">
        <path fill="currentColor" fill-rule="evenodd" d={`${EYES} ${IRIS}`} />
        <path fill="var(--logo-iris, transparent)" d={IRIS} />
        <path fill="currentColor" d={SLIT} />
      </g>
      {!mark && <path fill="currentColor" fill-rule="evenodd" d={WORD} />}
    </svg>
  );
}

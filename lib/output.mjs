// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
//
// The central output module (OSS_SPEC §19.4) for the Node tooling in
// `scripts/`, at the §19.4 path `lib/output.mjs`. Every user-facing line goes through one of the semantic helpers
// below, which style it for the terminal and append it, unstyled, to an
// always-on debug log — so a failed CI step and a local run leave the same
// trail. Nothing else in `scripts/` calls `console.*` directly.
import { appendFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import process from "node:process";

const styled = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code, s) => (styled ? `\x1b[${code}m${s}\x1b[0m` : s);

// Platform-appropriate state directory, per §19.2: XDG on Linux, Library on
// macOS, LOCALAPPDATA on Windows. Created on first write; a failure to log
// never fails the script.
function logPath() {
  const home = homedir();
  const dir =
    process.platform === "win32"
      ? join(
          process.env.LOCALAPPDATA ?? join(home, "AppData", "Local"),
          "agilator-web",
        )
      : process.platform === "darwin"
        ? join(home, "Library", "Logs", "agilator-web")
        : join(
            process.env.XDG_STATE_HOME ?? join(home, ".local", "state"),
            "agilator-web",
          );
  return join(dir, "debug.log");
}

function record(level, message) {
  try {
    const file = logPath();
    mkdirSync(join(file, ".."), { recursive: true });
    appendFileSync(
      file,
      `${new Date().toISOString()} ${level.padEnd(6)} ${message}\n`,
    );
  } catch {
    // The log is a convenience; never let it break the run.
  }
}

/** A step that succeeded. */
export function status(message) {
  record("status", message);
  console.log(`${paint("32", "✓")} ${message}`);
}

/** Something a human should look at, but the run continues. */
export function warn(message) {
  record("warn", message);
  console.error(`${paint("33", "!")} ${message}`);
}

/** Plain progress. */
export function info(message) {
  record("info", message);
  console.log(`${paint("36", "·")} ${message}`);
}

/** A bold section heading. */
export function header(message) {
  record("header", message);
  console.log(`\n${paint("1", message)}`);
}

/** A failure. The caller decides whether to exit. */
export function error(message) {
  record("error", message);
  console.error(`${paint("31", "✗")} ${message}`);
}

/** Verbose diagnostics: written to the log file; on the terminal only with DEBUG. */
export function debug(message) {
  record("debug", message);
  if (process.env.DEBUG) console.error(`${paint("2", "…")} ${message}`);
}

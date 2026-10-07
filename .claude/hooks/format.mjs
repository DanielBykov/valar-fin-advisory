/**
 * PostToolUse hook — formats whatever Claude just edited.
 *
 * Why a hook and not a line in CLAUDE.md: "run prettier before committing" is
 * the kind of rule that holds until the session gets long, and then quietly
 * stops holding. The cost of it not holding is merge conflicts between
 * branches that are formatted differently — which is exactly what happened
 * merging dev/lena into dev/refactor on 2026-10-08. Two files conflicted, both
 * because prettier had run on one side and not the other.
 *
 * Claude Code pipes the tool call in as JSON on stdin. Failure here must never
 * block the edit, so everything is wrapped and exits 0 regardless.
 */

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const FORMATTABLE = /\.(ts|tsx|mjs|cjs|js|jsx|json|css|md)$/;

/*
 * content/ is a data source, not documentation: src/lib/faqs.ts parses it
 * positionally and a blank line after `### question` empties every answer's
 * metadata. .prettierignore already excludes it — this is belt and braces,
 * because the failure is silent and only shows up as empty FAQ blocks on
 * seven service pages.
 */
const NEVER = [/(^|\/)content\//, /(^|\/)public\//, /(^|\/)\.local\//, /node_modules/];

let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const file = JSON.parse(raw)?.tool_input?.file_path;
    if (!file || !FORMATTABLE.test(file)) return;
    if (NEVER.some((pattern) => pattern.test(file))) return;
    if (!existsSync(file)) return;

    const prettier = "./node_modules/.bin/prettier";
    if (!existsSync(prettier)) return;

    execFileSync(prettier, ["--write", "--log-level", "silent", file], { stdio: "ignore" });
  } catch {
    // A formatter that breaks the session is worse than an unformatted file.
  }
});

/**
 * Stop hook — refuses to let a turn finish on code that does not typecheck or
 * lint.
 *
 * Why: `pnpm lint` exits 0 on warnings only until someone sets
 * --max-warnings 0, and until 2026-10-08 nobody had. Two warnings rode into
 * the dev/lena merge unnoticed because the branch they were written on never
 * failed on them. A rule in CLAUDE.md would have been read and then forgotten
 * halfway through a long task; this runs whether or not it is remembered.
 *
 * It is deliberately NOT a full `next build`. That is a minute per turn, which
 * would make the hook something to disable rather than something to rely on.
 * Build belongs before a push and in CI.
 *
 * Exit codes Claude Code acts on:
 *   0  fine, finish the turn
 *   2  blocked — stderr is handed back to Claude to fix
 */

import { execSync } from "node:child_process";

const read = () =>
  new Promise((resolve) => {
    let raw = "";
    process.stdin.on("data", (chunk) => (raw += chunk));
    process.stdin.on("end", () => resolve(raw));
  });

const input = JSON.parse((await read()) || "{}");

// Set when this hook already blocked once this turn. Without the guard a
// failing check would loop: block → Claude stops again → block again.
if (input.stop_hook_active) process.exit(0);

const CODE = /\.(ts|tsx|mjs|cjs|js|jsx)$/;

function changedCode() {
  try {
    const tracked = execSync("git diff --name-only HEAD", { encoding: "utf8" });
    const untracked = execSync("git ls-files --others --exclude-standard", { encoding: "utf8" });
    return (tracked + untracked)
      .split("\n")
      .filter(Boolean)
      .some((file) => CODE.test(file) && !file.startsWith(".local/"));
  } catch {
    // Not a git worktree, or git is unhappy. Check anyway rather than skip.
    return true;
  }
}

// Nothing was written this turn — a question, a plan, a read-only pass. There
// is nothing to check, and a ten-second pause on a conversational turn is how
// hooks get switched off.
if (!changedCode()) process.exit(0);

const STEPS = [
  { label: "pnpm typecheck", command: "./node_modules/.bin/tsc --noEmit" },
  { label: "pnpm lint", command: "./node_modules/.bin/eslint --max-warnings 0" },
];

for (const step of STEPS) {
  try {
    execSync(step.command, { encoding: "utf8", stdio: "pipe" });
  } catch (error) {
    const output = `${error.stdout ?? ""}${error.stderr ?? ""}`.trim();
    process.stderr.write(
      `${step.label} failed. Fix this before finishing — it is a merge blocker, ` +
        `not a style preference.\n\n${output}\n`,
    );
    process.exit(2);
  }
}

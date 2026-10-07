# Working rules

Next.js 16 (App Router), React 19, Tailwind v4, pnpm. This repository is the
live site at **valar.co.nz** — every merged change reaches real visitors and
real search results. There is no staging environment.

## Current state — read this first

The repo is mid-refactor on `dev/refactor` (step 0 of 6: test safety net).
Two things follow from that.

**There is no design system yet.** No `Container`, no `Button`, no `Section`.
They arrive in steps 1–3. Do not import primitives that do not exist, and do
not invent a parallel set. Match the markup of the page you are editing.

**There are no tests yet.** Visual regression snapshots are being built; until
they exist, nothing catches an accidental layout change except a human looking
at the page. Keep changes narrow for that reason alone.

## Enforced automatically

Two hooks run whether or not anyone remembers them (`.claude/settings.json`):

- **After every edit** — prettier formats the file. Do not hand-align code; it
  will be reformatted anyway.
- **Before a turn ends** — `tsc --noEmit` and `eslint --max-warnings 0` run if
  any code changed. A failure blocks the turn. Warnings are errors here: the
  flag exists because warnings accumulated silently for months.

`next build` is not in the hooks — it costs a minute. Run `pnpm build` yourself
before pushing.

## Never

- **Never reformat `content/`.** `src/lib/faqs.ts` parses those files
  positionally: a blank line after `### question` silently empties the
  metadata of every answer, and FAQ blocks vanish from seven service pages.
  Nothing fails loudly. `.prettierignore` and the format hook both exclude it.
- **Never delete `data-cmp` attributes.** They look like leftover debug markup.
  They are the anchor selectors for the Playwright suite being built, chosen
  because they survive markup refactoring in a way CSS classes do not.
- **Never rewrite published copy** unless asked to. The English on the site is
  the client's own writing, not a draft.
- **Never change `metadata`, canonical URLs, JSON-LD or the `h1`/`h2`
  hierarchy** as a side effect of something else. If a change needs them
  touched, say so explicitly.
- **Never add a dependency without asking.** Every one needs a reason recorded
  before it lands.

## Architecture

**Server by default.** `page.tsx` and `page-content.tsx` must not carry
`"use client"`. If something needs state or an event handler, put that piece in
its own component under `src/components/` and import it. Roughly 40 files are
client components today and most of them should not be — do not add to the
pile.

**The `page.tsx` / `page-content.tsx` split.** `page.tsx` holds metadata,
feature-flag gates and JSON-LD; `page-content.tsx` holds markup. Keep it.

**Design tokens live in `@theme` in `src/app/globals.css`.** Colours and fonts
are named there. Prefer a named token to a hex value.

**Motion.** `fadeIn` / `staggerContainer` are already declared in 14 files.
Do not write a fifteenth copy — import from a neighbour, or ask.

**Feature flags.** New sections and calculators ship switched off:
`src/lib/calculators.ts` gates calculators one at a time, `src/lib/insights.ts`
gates the insights section. Preview and debug routes must 404 outside
development — see `src/app/api/preview/` for the pattern.

**Calculator maths.** Every calculation module has a companion check script in
`scripts/` that verifies the arithmetic against an independent source
(`pnpm check:split-loan`, `check:repayments`, `check:affordability`). A new
calculation module needs one too — a screenshot cannot tell you that an
interest rate is now computed 0.3% differently. Run the relevant check after
touching any of them.

(`check:affordability` is currently broken — it looks for a reference file
outside the repository. Fix pending; the other two run.)

**Replacing a component?** Say so, and either delete what it replaced or flag
it in the commit message. Swapping the calculator on `/calculators/what-can-i-buy`
left 1189 lines of unreferenced code behind, and nothing in the toolchain
reports that.

## Working alongside the refactor

`dev/refactor` is rewriting markup across the whole of `src/`. To keep merges
small:

- Merge `dev/refactor` into your branch **before starting a feature and before
  every push**. Daily small conflicts beat one enormous one.
- Stay inside your feature. Do not tidy, rename or restructure files you are
  not changing — that work is already scheduled and your version will conflict
  with it.
- One feature per branch.

## Style

Comments in this codebase explain **why**, not what — why a value is 7%, why a
rule is suppressed, why a file is excluded from a tool. That standard is
unusually high here and worth keeping. A comment restating the code is worse
than no comment.

Commit messages: English, `type(scope): imperative summary`, with a body
explaining the reasoning when it is not obvious from the diff.

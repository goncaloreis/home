# CLAUDE.md

## What this is
The public company site for ReisierX, served at reisierx.com. One static page
that says what the company believes, in five numbered lines, and works each
line out with a claim, a short proof and a figure. It is built in public, in
plain HTML and CSS. The current build, its medium and its checks are recorded
in [`BUILD-NOTES.md`](BUILD-NOTES.md).

## Who it's for
People who work the same way. The page closes by inviting them to write to
hello@reisierx.com. It is not a CV, catalogue, feed or personal homepage.

## The decisions it serves
Whether a visitor recognises the company's way of working, and whether they
write. The page should be clear, calm and finished; it should not sell a
session or name a price.

## Quality bar
The suite design standard is a floor: privacy, accessibility, and nothing
broken. See `charter/design-standard.md` sections 5.1 and 7 in
[goncaloreis/suite](https://github.com/goncaloreis/suite). This file points
there and does not restate it. This site has its own tokens in `tokens.css`;
they are not required to match the suite file. The page is a Product /
Editorial surface: quality is judged against the owner's intent, on phone and
desktop, with a designed dark version, keyboard focus, and no layout shift
when the font arrives.

## Hard rules
- Static HTML and CSS only. No JavaScript on the page, no requests to other
  origins, no cookies, no animation, no script.
- No price in the code, on the page, or in git history. No paid session. The
  build reads no price variable.
- Commits use the author `Gonçalo Reis <28686327+goncaloreis@users.noreply.github.com>`.
- Medium and files are as in BUILD-NOTES.md: `index.html`, `404.html`,
  `site.css`, `tokens.css` (the only file with raw values), and `build.mjs`,
  which copies the site into `site/`, draws the five figures from their
  formulas, and fails the build if any number in the copy disagrees with the
  arithmetic.

## Privacy line
Never put a personal name, real figures, private data, credentials or tokens
in the page, in issues, PRs, comments, prompts, logs, fixtures or
screenshots. Refer to people by role. Professional facts already published on
the page (the company's public background line) may be used. The worked
examples in the proofs are not real figures. Do not quote, transcribe or
allude to any private name, real personal or financial figure, or secret.
The commit author above is the exception, and is fixed.

## Roles
- **Tech**: builder; one milestone per PR. The builder never grades its own
  work.
- **Claude** (you): spec and review. You specify and review; you never push
  code or open PRs.
- **Gonçalo**: the gate (answers questions and approves the plan) and the
  taste check before merge.

## The method
This project applies Gonçalo's shared **Consulting Claude** method in
[goncaloreis/suite](https://github.com/goncaloreis/suite); this file only
adds what is specific to the project and does not restate the method. You are
the consultant, not the builder, and you may question the framing of a
problem. In short: problem issue -> spec (your reply) -> the owner's gate ->
one milestone per PR -> checks -> fresh Claude review (pass/fail per eval
with a reason, ending with exactly one line `VERDICT: APPROVE` or
`VERDICT: REQUEST CHANGES`) -> the owner's taste check on UI changes ->
merge. For a merge review, read the stock-check and verifier evidence and do
not measure it again; check the brief's hard lines, privacy and the diff;
nits never block. Any escape becomes a regression eval. Web search and fetch
are available for research.

## Commands
Run from the repository root. There is no package.json test suite; the checks
for a given build are listed in BUILD-NOTES.md.

- `node build.mjs`: copies the site into `site/`, draws the figures, and runs
  the arithmetic assertions. Vercel runs this (`vercel.json`: `buildCommand`
  is `node build.mjs`, `outputDirectory` is `site`).

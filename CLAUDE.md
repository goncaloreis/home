# CLAUDE.md

## What this is
The public company site for ReisierX, served at reisierx.com. One static page:
a line that says what the company does and why to book it, then the reasoning
behind it in the open (three facts no one chooses, three answers that each
follow from two of them, and what all three say about a business that stalls),
and the call. It is plain HTML and CSS. The current build, its medium and its
checks are recorded in [`BUILD-NOTES.md`](BUILD-NOTES.md).

## Who it's for
People with a hard problem in building a business who want it worked through
from the facts up, and who will pay for a call to do it. It is not a CV, a
project list, a feed or a personal homepage. Hiring is only implied.

## The decisions it serves
Whether a visitor trusts the reasoning quickly enough to book a call. The main
action is booking a paid call. The page should be clear, calm and finished.

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
- Static HTML and CSS only. No JavaScript on the page (the structured data
  block is data and does not run), no requests to other origins, no cookies,
  no animation.
- The main action is booking a paid call, through exactly one link: the
  element marked `data-book` in `index.html`. For now it is a `mailto:`;
  moving to a booking page means changing that one `href`. The words around
  it do not depend on how the call is booked, and the build prints the email
  address under the link only while it is a `mailto:`. The booking service is
  the owner's call. The build fails unless there is exactly one booking link
  and its words say the call is paid.
- The call's length is the owner's to set, and the owner has set it. Each
  place that offers the call states it, plainly and once, before the action:
  the search and share descriptions, the masthead's way to the call, and the
  call itself before its booking link. It agrees everywhere and appears
  nowhere else. The build holds no figure of its own: it reads the length from
  the pages and fails if a place misses it, states it twice, or disagrees with
  another.
- No page states the call's price (the owner's decision, 27 Nov 2026: the fee
  may change, and the pages should not have to change with it). The booking
  link still says the call is paid. The build fails if any page gives a price,
  in figures, with a currency, or as a bare number beside a word for it. Any
  payment setup and any spend need the owner's yes first.
- No personal name anywhere on the site, and no named clients or firms.
- Commits use the author `Gonçalo Reis <28686327+goncaloreis@users.noreply.github.com>`.
- Medium and files are as in BUILD-NOTES.md: `index.html`, `404.html`,
  `site.css`, `tokens.css` (the only file with raw values), and `build.mjs`,
  which copies the site into `site/`, draws the mark into the pages and the
  images, stamps each served page with the commit it was built from (a
  `build-sha` meta tag nothing shows), and fails the build if the page breaks
  one of its own rules.

## Privacy line
Never put a personal name, real figures, private data, credentials or tokens
in the page, in issues, PRs, comments, prompts, logs, fixtures or
screenshots. Refer to people by role. Do not quote, transcribe or allude to
any private name, real personal or financial figure, or secret.
The commit author above is one exception, and is fixed. The call's length is
the other: the owner set it to be public, and it is written on the pages
only, in the places the hard rules name, not in notes or commits. The call's
price is not written anywhere in the repository.

## Roles
- **Tech**: builder; one milestone per PR. The builder never grades its own
  work.
- **Claude** (you): builds on a branch. You commit, push that branch and open
  pull requests when asked. You never merge, never push to `main` and never
  deploy to production.
- **The owner**: the gate (answers questions and approves the plan) and the
  taste check before merge.

## The method
This project applies the owner's shared **Consulting Claude** method in
[goncaloreis/suite](https://github.com/goncaloreis/suite); this file only
adds what is specific to the project and does not restate the method. You
build here as well as advise, and you may question the framing of a problem.
In short: problem issue -> spec (your reply) -> the owner's gate ->
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

- `node build.mjs`: copies the site into `site/`, draws the mark into the
  pages and into `og.png`, `favicon.png` and `apple-touch-icon.png` (written
  to the repository root, where they are committed, and to `site/`), and runs
  the checks. Vercel runs this (`vercel.json`: `buildCommand` is
  `node build.mjs`, `outputDirectory` is `site`).

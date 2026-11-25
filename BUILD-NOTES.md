# Build notes: ReisierX company page (standard rebuild)

Branch `company-page-standard`, cut from `company-page` at `2bc36df`. Built to `charter/design-standard.md` (goncaloreis/suite).

- **Mode:** Product / Editorial, one surface (charter 3.1: the company's page). `data-mode="editorial"` on `<html>`.
- **Medium:** static HTML (charter 6.1). No JavaScript on the page. `build.mjs` runs only at build time.
- **Design start:** phone first (390 x 844), checked at 1440 x 900.
- **Tokens:** `tokens.css` is a byte-for-byte copy of `design/tokens/tokens.css` from goncaloreis/suite `main` at `1b5f7cd0725cfe0558e37dd88dee779d5f993fa7` (M1a, merged 25 Nov 2026, 20:55 Europe/Lisbon). Confirmed with `cmp` against that file. No overrides. `styles.css` holds no raw values.
- **Fonts:** Inter and Source Serif 4 variable (latin, latin-ext), self-hosted from `@fontsource-variable` 5.3.x, OFL licences in `fonts/`. Weights used: 400 and 500.
- **Copy:** Growth's `copy-v2.md` (25 Nov 2026), recommended first screen. Alternatives A and B are kept as inert `<template>` blocks; `HERO_VARIANT=a|b` at build time swaps one in.
- **Values kept out of the repository:** the session price. `{{OFFER_PRICE}}` is filled by `build.mjs` from the Vercel environment variable `OFFER_PRICE`. Without it the page shows "[price set at deploy]".
- **Booking:** not set up. The session section shows "Booking is not open yet." with no button. The first screen's "Book a working session" link jumps to that section.

## One job per screen (viewport)

| Screen | Job | Primary action |
|---|---|---|
| First screen | Say what the firm is | "Book a working session" (text link to the session) |
| Companies | Proof: companies founded, built and run | None |
| How we work | How the firm works and who it is for | None |
| In the lab | Secondary depth: current technical work | Text links to GitHub |
| A working session | The offer, the price, the brief, the terms | Booking state (no button until paid booking exists) |

## State matrix

The page shows no data, so S2's data states do not apply. Control and content states:

| Element | Default | Hover | Focus-visible | Active | Other |
|---|---|---|---|---|---|
| Text links | Underlined | Underline dims | Token ring, 2px, 2px offset | Browser default | Visited same as default |
| Skip link | Off screen | n/a | On screen, token ring | n/a | Lands on the main content |
| Booking | "Booking is not open yet." (status) | n/a | n/a | n/a | Live state: one primary button, markup in the comment |
| Price | Filled from env | n/a | n/a | n/a | Missing env: "[price set at deploy]" |
| Hero | Recommended | n/a | n/a | n/a | Variants A and B via build env |

## Kit limits

None. Static HTML has full control.

## Evidence

Kept on Tech's machine, not in GitHub. The independent audit and the taste gate are separate; this build is not self-graded.

## Header and footer vs PR #3 (`design-standard`)

Visual treatment is aligned so G4 can compare like with like: the same skip-link pattern, the same muted 14px sans footer lines with muted links, the motto in Source Serif 4 at `text-base`, and the footer stacked in one column with `--mode-section-gap` above and `--space-16` below.

What still differs, and is left for his look at G4 (the IA, company as home, was not restructured):

- **Header.** This page has a ReisierX wordmark in a quiet top bar, linking to `/`. PR #3 has no site header; the person's name is the `h1`.
- **Footer copy** (Growth's, unchanged). This page has three lines (Questions, built in public, no cookies) and the seal "Nullius in verba" with "Check the work" under it. PR #3 has one machine line ("ReisierX is the company I build and invest through…") and "Nullius in verba." with no small line.
- **Horizontal padding.** Shared content `.wrap` here is `--space-6` on phones and `--space-12` from 768px. PR #3's `.frame` is `--space-6` then `--space-10` from 768px, with a label column from 1024px.
- **Body type.** This page's body is Inter (`--font-sans`); PR #3's body is Source Serif 4. The motto matches PR #3; running footer text is the same sans size and colour.


# Build notes: ReisierX company page

Branch `company-page-clean`. The single reisierx.com site: ReisierX, a hands-on business builder, presented as a company. Built to the suite design standard.

- **Mode:** Product / Editorial, one surface (standard 3.1: the company's page). `data-mode="editorial"` on `<html>`.
- **Medium:** static HTML (standard 6.1). No JavaScript on the page and no requests to other hosts at runtime. `build.mjs` runs only at build time.
- **Design start:** phone first (390 x 844), checked at 1440 x 900.
- **Tokens:** `tokens.css` is a byte-for-byte copy of the design-standard token file at `1b5f7cd0725cfe0558e37dd88dee779d5f993fa7`. No overrides. `styles.css` holds no raw values; layout fixes use tokens only.
- **Fonts:** Inter and Source Serif 4 variable (latin, latin-ext), self-hosted from `@fontsource-variable` 5.3.x, OFL licences in `fonts/`. Weights used: 400 and 500.
- **Copy:** copy v4, verbatim and in its order: first screen, track record, how we work, built in the open, working sessions, contact. The headline is "We build businesses, hands on." It fits on three lines at 390 px, in the web font and in the fallbacks, so the phone fallback headline is not used. The page names the company only: no personal name, no named clients or firms, no personal profile links.
- **open-matter:** described with no link. Its site does not answer and the public repository URL carries a personal handle, so "Read the spec" is left out until a neutral ReisierX location exists.
- **Price:** never in the repository. `{{OFFER_PRICE}}` is filled by `build.mjs` from the Vercel environment variable `OFFER_PRICE`. A preview or local build without it shows "[price set at deploy]". A production build fails if it is missing.
- **Currency:** the session is priced in US dollars because it is offered to founders and operators across markets, not only in the euro area. This is an exception to the standard's euro default.
- **Booking:** not set up. Working sessions shows "Booking is not open yet. Write to hello@reisierx.com." with no button. The first screen's "Get in touch" link jumps to Contact.

## One job per screen (viewport)

| Screen | Job | Primary action |
|---|---|---|
| First screen | Say what the company does | "Get in touch" (text link to Contact) |
| Track record | Proof: what the people behind ReisierX have done | None |
| How we work | How the company works and who it is for | None |
| Built in the open | Proof: finished experiments | None |
| Working sessions | The offer, the price, the brief, the terms | Booking state (no button until paid booking exists) |
| Contact | How to write, and a hint that people who build are welcome | Email link |

## State matrix

The page shows no data, so S2's data states do not apply. Control and content states:

| Element | Default | Hover | Focus-visible | Active | Other |
|---|---|---|---|---|---|
| Text links | Underlined | Underline dims | Token ring, 2px, 2px offset | Browser default | Visited same as default |
| Skip link | Off screen | n/a | On screen, token ring | n/a | Lands on the main content |
| Contact jump | n/a | n/a | Label ring when Contact is the target | n/a | "Get in touch" lands here; the next Tab is the email link |
| Booking | "Booking is not open yet. Write to hello@reisierx.com." (status) | Email link underline dims | Email link, token ring | n/a | Live state: one primary button (`.button`) |
| Price | Filled from env | n/a | n/a | n/a | Missing env (preview or local): "[price set at deploy]". Missing env in production: the build fails. |

## Layout stability with late fonts

Both fallback faces come from `tokens.css`: Georgia for the serif and Arial for the sans, both metric-adjusted. A late web font must not move the first screen:

- **Headline:** capped at `--container-xs` below 768 px, so it sets as three lines on every phone in either font. From 768 to 1023 px `min-height` reserves two lines of `--leading-6xl`, because the fallback serif wraps to two lines at some of those widths where Source Serif 4 needs one.
- **Lead:** `min-height` reserves the fallback's line count. That is 6 lines of `--leading-lg` below 640 px, 5 lines from 640 to 767 px, and 4 lines of `--leading-xl` from 768 px. Inter needs one line fewer in places, which leaves one blank line above "Get in touch".
- **Line length:** body measures use `--container-lg` and `--container-md`, which are pixel widths. They do not use `ch`, which grows with the font.

## Self-audit evidence (this revision)

Taken from a local build with the price unset, served from `site/` and checked with headless Chromium (Playwright) on macOS. The fallbacks were the real Georgia and Arial.

| Check | Result |
|---|---|
| axe (WCAG 2.0 to 2.2 A and AA, best practice) | 0 violations at 390 x 844 and 1440 x 900, in light and dark |
| Links | Every link resolves: two in-page anchors, `/`, and two mailto links. No external links. |
| Late fonts (held 2.5 s), Georgia and Arial fallbacks | CLS 0 at 360, 375, 390, 393, 402, 412, 430, 600, 768, 1024 and 1440 px. CLS 0.0024 at 320 px, from a list edge at the fold. |
| Late fonts, unadjusted generic fallbacks (Android-like stand-ins: Georgia unadjusted at 95 to 110%, and Times) | CLS 0.0003 to 0.0025, except 0.0098 to 0.0102 at 402 to 430 px with the narrow Times stand-in. The remaining shift is a 3 to 9 px glyph offset from unadjusted ascent, which only `tokens.css` can fix (see the open item below). |
| Longest line, every 16 px from 320 to 1920 px | 71 characters with the web fonts (lab text, 544 to 767 px); 66 from 768 px up. With blocked fonts: 71 (Georgia and Arial), 75 (Times stand-in). No sideways scroll at any width. |
| Headline at 390 px | 3 lines, no word broken, 320 px wide inside a 342 px container |
| Keyboard | 5 stops in screen order (skip link, wordmark, "Get in touch", two email links), each with the 2 px token ring, in light and dark |
| First viewport | Headline, lead and "Get in touch" in view at 390 x 844 (action bottom 536 px), at 320 x 568 (564 px) and at 1440 x 900 (460 px). No price. |
| Privacy scan | 0 hits |

## Open item for Tech

`tokens.css` gives the serif fallback a single `size-adjust` (103.5%) for both Georgia and Liberation Serif, and has no matched fallback for Android. A separate Georgia face and an Android face would remove the residual glyph offset. That change belongs in the token file, so it needs the standard's owner.

## Header and footer

- **Header.** A ReisierX wordmark in a quiet top bar, linking to `/`.
- **Footer.** Two muted lines ("ReisierX." and "No cookies, no tracking.") and the seal "Nullius in verba" with "Check the work" under it.
- **Horizontal padding.** Shared content `.wrap` is `--space-6` on phones and `--space-12` from 768px.

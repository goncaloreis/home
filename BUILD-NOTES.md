# Build notes: ReisierX company page (standard rebuild)

Branch `company-page-clean`, cut from `main`. Built to the public design standard. This is the single reisierx.com site: ReisierX, presented as a company.

- **Mode:** Product / Editorial, one surface (charter 3.1: the company's page). `data-mode="editorial"` on `<html>`.
- **Medium:** static HTML (charter 6.1). No JavaScript on the page. `build.mjs` runs only at build time.
- **Design start:** phone first (390 x 844), checked at 1440 x 900.
- **Tokens:** `tokens.css` is a byte-for-byte copy of the design-standard token file at `1b5f7cd0725cfe0558e37dd88dee779d5f993fa7` (merged 25 Nov 2026, 20:55 Europe/Lisbon). Confirmed with `cmp` against that file. No overrides. `styles.css` holds no raw values.
- **Fonts:** Inter and Source Serif 4 variable (latin, latin-ext), self-hosted from `@fontsource-variable` 5.3.x, OFL licences in `fonts/`. Weights used: 400 and 500.
- **Copy:** approved words for this revision, recommended first screen. No unused hero variants ship in the page. The page names the company, not a person. No personal profile links.
- **Values kept out of the repository:** the session price. `{{OFFER_PRICE}}` is filled by `build.mjs` from the Vercel environment variable `OFFER_PRICE`. A preview or local build without it shows "[price set at deploy]". A production build fails if it is missing.
- **Currency:** the session is priced in US dollars because it is offered to founders and operators across markets, many of them entering Europe or the US, not only to people in the euro area. This is an exception to the standard's euro default.
- **Booking:** not set up. The working-sessions section shows "Booking is not open yet. Write to hello@reisierx.com." with no button. The first screen's "Get in touch" link jumps to Contact.

## One job per screen (viewport)

| Screen | Job | Primary action |
|---|---|---|
| First screen | Say what the firm is | "Get in touch" (text link to Contact) |
| Track record | Proof: companies founded, built and run | None |
| How we work | How the firm works and who it is for | None |
| Built in the open | Proof: finished public technical work | Text link to the open-matter spec |
| Working sessions | The offer, the price, the brief, the terms | Booking state (no button until paid booking exists) |
| Contact | How to write, and a hint that people who build are welcome | Email link |

## State matrix

The page shows no data, so S2's data states do not apply. Control and content states:

| Element | Default | Hover | Focus-visible | Active | Other |
|---|---|---|---|---|---|
| Text links | Underlined | Underline dims | Token ring, 2px, 2px offset | Browser default | Visited same as default |
| Skip link | Off screen | n/a | On screen, token ring | n/a | Lands on the main content |
| Contact jump | n/a | n/a | Label ring when the contact section is the target | n/a | First-screen "Get in touch" lands here |
| Booking | "Booking is not open yet. Write to hello@reisierx.com." (status) | Email link underline dims | Email link, token ring | n/a | Live state: one primary button, markup in the comment |
| Price | Filled from env | n/a | n/a | n/a | Missing env (preview or local): "[price set at deploy]". Missing env in production: the build fails. |

## Kit limits

None. Static HTML has full control.

## Evidence

Screenshots and check summaries are on the evidence-only branch `company-page-evidence` at `e88c39ee437b1529206181527ba3a32face235ab`. That branch holds screenshots and a short README only. It is not a site, and it is not for merge.

Screenshots were taken from a local build with the offer price unset, so the session line shows "[price set at deploy]". They cover phone 390×844 and laptop 1440×900, first screen and full page, in light, dark and grayscale, plus scanner and axe summaries in `SUMMARY.md` on that branch.

## Header, footer and type

The skip-link pattern, the muted sans footer lines, the motto in Source Serif 4 at `text-base`, and the footer stacked in one column with `--mode-section-gap` above and `--space-16` below follow the same chrome treatment as the other public branch on this repository.

- **Header.** A ReisierX wordmark in a quiet top bar, linking to `/`.
- **Footer.** Two muted lines ("ReisierX." and "No cookies, no tracking.") and the seal "Nullius in verba" with "Check the work" under it.
- **Horizontal padding.** Shared content `.wrap` is `--space-6` on phones and `--space-12` from 768px.
- **Body type.** Inter (`--font-sans`). The motto is Source Serif 4.

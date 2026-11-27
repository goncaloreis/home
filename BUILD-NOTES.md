# Build notes: reisierx.com

One page for ReisierX. It opens on what the company does and why to book it; says, in plain
words, what building businesses has shown that no one can change, and what the company
wants; shows the habits that follow, each met in a case from a business; and ends on the
call.

## This round
The owner's read of the last build: still abstract and forced; it should become concrete and
natural without turning into a CV or a list. The reasoning stays, and the apparatus around it
goes.

- The facts were three aphorisms under the label "Given", then "What follows" and a line of
  philosophy ("facts set no aim"). They are now one paragraph under the opening line, told
  from experience rather than stated as axioms: every business we've built has run into the
  same things; some of what went well was luck, and so was some of what went wrong; no one
  knew enough; every month spent finding out was a month gone. Then: none of that can be
  changed, what to do about it depends on what you want, and we want businesses that last.
  The page no longer counts its own parts.
- The three answers are habits now, set a step smaller, under the label "What we do about
  it", which picks up the paragraph's last turn. Each opens on a case a founder will
  recognise (a launch that sold out or flopped, a decision that keeps slipping to next
  month, bets sized against runway), says in its own words which of those things it
  answers, and ends on what the company does. They no longer all turn on "so we". The words
  use contractions where a person would.
- The dot marks beside each fact and answer are gone. They encoded which facts each answer
  rests on, but only for a reader who had decoded the system, and at their size they read as
  ornaments. The words now say what each habit rests on. The mark keeps one job: the
  company's sign, beside the name on every page, as it is on the favicon and the share card.
- The conclusion ("a stalled business is usually breaking one of these") is gone. It was
  framed as a proof and claimed more than the page's own admission that no one knows enough
  allows. The call now connects to the habits by doing them: it works through a problem the
  way the company works through its own, from what the results so far do and don't show to
  what can be afforded to lose.

## The opening line
"We build businesses, and will tell you what we would do in yours." Kept. The first half is
what the company does; the second is why anyone would book it. A design review called its
second clause slightly stiff; the owner approved this line's intent and has not ruled on the
wording, so it stays until he does. It is the page's h1, its largest line, the search and
share descriptions' first sentence, and the 404 page's note. The call no longer repeats its
promise word for word; it ends on "you'll know what we'd do, and why".

## The habits
- Trust no single result (luck, and no one knowing enough). A launch that sold out may have
  been lucky; one that flopped may only have been early; from the result alone there's no
  telling which. So a new price or hire is run as a test, with what is expected and what
  would change our mind written down before it starts.
- Check what you can, and act on the rest (no one knowing enough, and time). A decision that
  keeps slipping to next month is usually waiting for a fact. Facts that can be had within a
  week are got first; the rest won't arrive in time, and waiting for them costs more than
  they're worth, so the decision is made without them, with a date to look again.
- Keep every loss survivable (luck, and time). Any attempt can fail on chance alone, so the
  outcome turns on how many good attempts a business gets before the money or the patience
  runs out. Runway is counted in attempts rather than months, and every bet is sized so that
  losing it leaves enough for the next.

Nothing on the page is a CV, a client, a firm, a quotation or a price. The only figure on it
is the call's length.

## The mark
Three red points on an equilateral triangle: ∴, the sign for "therefore". It stands beside
the name at the head of both pages, hidden from screen readers since it adds nothing to the
name, and it is the favicon, the touch icon and the card a shared link shows (`og.png`), which
carries no words.

## Booking
There is one booking link: the element marked `data-book` in `index.html`, a `mailto:`
with the subject "Booking a paid call" and a short form in the body (the business, the
problem in a few lines, what has been tried). It is drawn as a filled button in red, the
only filled block on the page, and its words are "Book a paid call". Before it, in this
order, the call section says what the call is and that it is paid ("One paid call, on one
problem that won't move"), what happens in it and what comes of it, how long it lasts, and
what to tell us. While the link is a `mailto:`, the build prints a line under it that says
pressing it opens an email, and to which address, for anyone whose mail program does not
open; a static page cannot confirm the email was sent, so it says what will happen before
the press instead.

The owner set the call's length. Each place that offers the call states it, plainly and
once, before the action: the search description and the share description, the masthead's
way to the call on both pages, and the call section above its button. The masthead's link
now starts with a verb, is underlined in red, and leads to the call section rather than
opening an email, so the page keeps a single booking link and the visitor reads what the
call is before writing. It names the call rather than an hour, so it does not read as
hourly billing. The words around the booking link do not depend on how the call is booked,
so moving to a booking page is a change to that one `href`; the line under it then
disappears by itself. The length lives in the pages alone, not in these notes or the build.

No page states a price. The owner decided (27 Nov 2026) to keep the fee off the site, so
that changing it never means changing the pages. The page still says, in the call section,
the descriptions and the booking link's own words, that the call is paid; the fee is given
in reply to the email.

The footer gives the address "for anything else". It no longer asks anyone to join: an
explicit ask beside the booking button read as a second offer, and the brief keeps hiring
implied. Hiring now rests on "we" and an open address; the owner has not ruled on the
earlier line. The address stays in the footer because it is the company's general contact
and must remain when booking moves off email.

## Medium and files
- Static HTML, no JavaScript, no requests to other origins, no cookies, no motion beyond
  colour changes on hover.
- `index.html`, `404.html`: the pages. `site.css`: the rules. `tokens.css`: this site's
  tokens (colour, type, space) and font faces; the only file with raw values. The mark's
  geometry (points, radius) lives in `build.mjs`, which draws it.
- `build.mjs` (run by Vercel) copies the site into `site/`; draws the mark where each page
  has `<!--mark-->`, beside the name; adds the line under an email booking link; strips
  source comments; fills the theme colours from `tokens.css`; and draws `og.png`,
  `favicon.png` and `apple-touch-icon.png` from the same points and the palette with its own
  PNG encoder (zlib and a checksum). The images are written to the repository root, where
  they are committed, and to `site/`; every build rewrites them, byte for byte the same.
- Every page it writes ends its head with `<meta name="build-sha" content="...">`, the
  commit the build came from, added after the source comments are stripped, so it is never
  taken for one. Nothing on the page shows it. On Vercel the commit comes from
  `VERCEL_GIT_COMMIT_SHA` (or `GITHUB_SHA` in a workflow); elsewhere it is read from the
  repository's own files, worktrees included. A local build carries the commit checked out,
  not uncommitted edits. If no commit can be found the tag says `unknown` and the build
  goes on, so a deploy never stops for want of it.
- The build writes nothing unless all of these hold: each page shows the mark once, beside
  the name, and no mark comment is malformed; there is exactly one booking link, it is a
  `mailto:` or `https:` address, and its visible words say the call is paid; the masthead
  leads to the call; each place that offers the call (above) states its length once; every
  place states the same length, compared as minutes, so different spellings of one length
  agree; no length appears anywhere else on a page, in its text or its attributes, even
  spelt with entities or in words; no page names a currency, as a sign, a code or a word,
  anywhere in it or in its links read decoded, or gives a fee as a bare number beside a word
  for one; nothing a visitor reads (the text, the words in attributes, the links, the
  descriptions) holds a figure, in digits or as hundreds or thousands, other than the
  call's length; each page's first link skips to its main element; nothing is loaded from
  another origin (link elements, `src`, `srcset`, `poster`, `data`, inline styles, CSS
  `url()` and `@import`); no script runs, there are no inline handlers and no `javascript:`
  links; every comment is closed; each source page has one head and no build-sha of its
  own; and, in both colour schemes, ink keeps 7:1 on the paper, soft ink and red 4.5:1, the
  booking button's words 4.5:1 on its fill and on its pressed fill, and both fills 3:1 on
  the paper. The build holds no figure of its own: it reads the call's length from the
  pages.

## Type, colour and grid
- Two faces. Source Serif 4 (SIL Open Font License, `fonts/`), variable weight and optical
  size, sets everything the page says. Metric-matched fallbacks (Georgia, Liberation Serif,
  Noto Serif), separate for display and text sizes, take the same room as the web font
  before it arrives. The device's own sans (San Francisco, Segoe UI, Roboto) sets what is
  used to find the way and to act: the section labels, the masthead's link, the booking
  button and the line under it. It is never downloaded, so it costs no request and cannot
  shift the layout.
- Sizes, from 1280 px: the opening line 56 px; the habits and the line that opens the call
  30 px; the paragraph under the opening line 24 px; reading text 18 px. Phones keep the
  same order at smaller steps (32, 24, 20, 18), with the opening line at 30 px below 360 px
  so its first words keep to one line on the narrowest phones. The habits were 40 px and
  are now well below the opening line, so the page reads as prose with headings rather
  than as a row of posters.
- Grid. The margins are the same on both sides at every width: 24 px on phones, 64 px from
  640 px, 80 px from 1024 px. Phones had a wider left margin to hold the dot marks, which
  pushed everything, the full-width button included, visibly to the right; with the marks
  gone the margins are even. Below 1024 px there is one column and each part's label stands
  above it on a hairline. From 1024 px each part is two columns: its label in a rail on the
  left, set on the baseline of the part's first line, and the text beside it. The masthead,
  the opening line and the paragraph under it span both. From 1280 px the page is 57rem wide
  (a 12rem rail, a 3rem gutter, a 42rem column). Reading text keeps a measure of about 70
  characters.
- The call section has a least height, worked out in `tokens.css`, so that when the
  masthead's link brings it up and the page runs out first, the screen stops in the blank
  gap above the call, at least 1rem below the last line of the habits. Before, the screen
  stopped with the heading above cut in half. The height is no more than that needs, so the
  blank under the button stays modest.
- Paper, ink, soft ink, one red, and a faint tone for hairlines. Red is kept for the mark,
  the booking button, the underline of the masthead's link, focus and selection, and link
  underlines on hover. The booking button underlines its words when pointed at or pressed,
  and on light paper deepens its red too, rather than turning to ink; on dark paper its red
  has no room to deepen without losing its edge against the paper, so the underline alone
  shows it, and it also shows in forced colours. Its focus ring is drawn in ink, since a red
  ring vanishes against its red fill; every other control keeps the red ring. A designed
  dark version follows the device on screen, with lighter soft ink and slightly heavier
  labels; print always uses the light one, and drops the call section's least height.
- Contrast, as computed by the build. Light: ink 17.2:1, soft ink 6.7:1, red 6.0:1 on the
  paper; the button's words 6.0:1 on its fill and 8.2:1 on its pressed fill; the fills
  6.0:1 and 8.2:1 on the paper. Dark: ink 15.6:1, soft ink 8.7:1, red 6.6:1; the button's
  words 4.9:1 and its fill 3.2:1, pressed or not.
- Keyboard: a skip link is the first stop on each page. It appears only while focused,
  and then in the flow above the masthead, so it covers nothing. Focus is a ring standing
  off the element, drawn at once, and every control has room around it, so no ring touches
  a letter. The footer's address, a link inside a line of text, gets the same ring drawn
  closer, and the footer's lines are spaced so the ring clears the lines above and below.
- In forced colours the mark is drawn in the text colour, the button keeps a border, and
  large lines get more leading.

## Checks on this build
- Build: every check above passes (two pages, three images; the call's length stated in
  five places, the same in each; no price, no other figure). The images came out byte for
  byte as before. The price rules were seen to fail on pages broken on purpose (a price
  spelt with an entity in the call section; a bare number in the 404 masthead; a price in
  words with no currency and no digits; a euro sign percent-encoded in a link), and the
  pages were then restored. The build-sha tag was read in both built pages, last in the
  head.
- An independent read of the change, from the code (no browser), found the mobile shift,
  the fact-title wraps, the overclaiming conclusion, the dot notation and the passive
  masthead link resolved. Acted on: the paragraph under the opening line was the most
  abstract text and counted the page's parts; every habit turned on "so we"; the page had
  no contractions and some stiff turns; "what we would do in your place" came three times;
  "How we work" was a stock label; the masthead's link read as hourly billing; on a 320 px
  phone the opening line would likely break after "we"; the call's least height left about
  440 px of blank paper on a desktop; the dark button's hover fill fell under 3:1 on the
  paper; the price check missed prices in words, with no currency, or percent-encoded in a
  link; a length of "a quarter of an hour" read as a full hour; CLAUDE.md still described
  the old page. Left as they are: the three habits keep their short headings, because they
  are the principles the brief asks for, distilled and few; the address appears under the
  button and in the footer, because each has its own job and the first goes when booking
  moves to a booking page; a deploy with no commit to read says `unknown` rather than
  failing; and the risk that, with the proof's apparatus gone, the design reads as less
  original. That last one is for the next design read and the owner to judge.
- Not run in this environment, which has no browser: axe, html-validate, Lighthouse, a link
  check, a keyboard walk-through, the late-font layout-shift sweep, forced colours, print,
  and screenshots on phone and desktop. The layout above is worked out from the CSS, not
  seen. It should be looked at on a phone and a desktop before merge.

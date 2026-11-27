# Build notes: reisierx.com

One page for ReisierX. It opens on what the company does and why to book it, reasons from
three facts no one chooses to how the company works, says what that means for a business
that stalls, and ends on the call.

## The opening line
"We build businesses, and will tell you what we would do in yours." The first half is what
the company does; the second is why anyone would book it: an answer on their own business,
from people who build them. It is the page's h1, its largest line and the first thing read,
so the company's identity is no longer set smaller than what follows from it. It replaces
the earlier line wherever that stood: the masthead of both pages, the search description and
the structured data. The share description now carries it too; the page title stays the
name alone. The call at the end keeps the promise in other words: what we would do in your
place, and why.

## The idea
The page is a derivation, laid out as a page. It starts from what is given, not from what
the company concludes, and every answer shows what it rests on.

Given, three facts, each run on into what it means:
- Every result is partly luck. Effort and talent shift the odds; they do not decide the
  outcome.
- No one knows enough. Knowledge is partial, scattered and provisional, ours included.
- Time runs out. Every choice is paid for in it, and none of it comes back.

The facts are meant to be beyond dispute; that is what makes them premises. What the company
knows from building businesses shows in what follows from them.

Facts set no aim, so the page states one: to build businesses that last. Held to that aim,
each pair of facts leaves one answer. The mark beside each answer names its two facts, so
the paragraph does not restate them: it meets them in a case from a business, and ends on
what the company does about it.
- Luck, and no one knowing enough: trust no single result. A launch that worked may have
  been lucky and one that failed may only have been early, and the result alone cannot
  tell which. A new price or hire is run as a test, with what is expected and what would
  change our mind written down before it starts.
- No one knowing enough, and time running out: check what you can, and act on the rest. A
  decision that keeps being put off is usually waiting for a fact. Facts that can be had
  within a week are got first; the rest will not arrive in time, so the decision is made
  without them, with a date to look again.
- Luck, and time running out: keep every loss survivable. Any one attempt can fail on
  chance, so the outcome turns on how many good attempts a business gets, and the clock
  limits them. Runway is counted in attempts rather than months, and every bet is sized so
  that losing it leaves enough for the next. No single bet has to win.

The conclusion is the only line with all three points filled: a stalled business is usually
breaking one of these. From inside the business it is hard to see which, and more effort
fixes none of them; naming it is most of the work. That is what the call is for.

Nothing on the page is a CV, a client, a firm or a quotation. The only figures on it are the
call's length and fee.

## The mark
Three points on an equilateral triangle, one for each fact (top: every result is partly
luck; bottom left: no one knows enough; bottom right: time runs out). A filled red point
is a fact the entry beside it rests on; an open ring is a fact it does not use. Each fact
fills its own point, each answer the two it rests on, and the conclusion all three, which
makes ∴, the sign for "therefore": the only full one on the page.

On every size each mark hangs in the margin, centred on the first line of its entry, so all
the text runs down one edge, and the margin read alone shows single facts becoming pairs
and then all three. On phones the margin before the text is the wider one, to hold the
marks; from 1024 px they hang in the gutter between the rail and the text. In the source an
answer's mark follows its heading, so someone moving by headings hears the heading first
and then what it rests on. The full mark is also the favicon, the touch icon and the card a
shared link shows (`og.png`), which carries no words.

## Booking
There is one booking link: the element marked `data-book` in `index.html`, a `mailto:`
with the subject "Booking a paid call" and a short form in the body (the business, the
problem in a few lines, what has been tried). It is drawn as a filled button in red, the
only filled block on the page, and its words are "Book a paid call". Before it, in this
order, the call section says what the call is and that it is paid ("One paid call, on one
problem that will not move"), what it is for and what comes of it, how long it lasts and
what it costs, and what to tell us. While the link is a `mailto:`, the build prints the
address under it for anyone whose mail program does not open.

The owner set the call's length and fee. Each place that offers the call states both,
plainly and once, before the action: the search description and the share description,
the masthead's way to the call on both pages, and the call section above its button. The
masthead's link names the call with its length and fee and leads to the call section
rather than opening an email, so the page keeps a single booking link, the visitor reads
what the call is before writing, and the two links no longer share a label while doing
different things. The words around the booking link do not depend on how the call is
booked, so moving to a booking page is a change to that one `href`; the address line then
disappears by itself. The figures live in the pages alone, not in these notes or the build.

The footer invites anyone who would rather join us on such problems, and is worded so it
does not read as a second, unpaid way to get the call; hiring stays implied.

## Medium and files
- Static HTML, no JavaScript, no requests to other origins, no cookies, no motion beyond
  colour changes on hover.
- `index.html`, `404.html`: the pages. `site.css`: the rules. `tokens.css`: this site's
  tokens (colour, type, space) and font faces; the only file with raw values. The mark's
  geometry (points, radius, ring width) lives in `build.mjs`, which draws it.
- `build.mjs` (run by Vercel) copies the site into `site/`; expands each `<!--mark:NN-->`
  into an inline SVG (marks with two or three filled points are named for screen readers
  from the page's own facts); adds the address under an email booking link; strips source
  comments; fills the theme colours from `tokens.css`; and draws `og.png`, `favicon.png` and
  `apple-touch-icon.png` from the same points and the palette with its own PNG encoder
  (zlib and a checksum). The images are written to the repository root, where they are
  committed, and to `site/`; every build rewrites them, byte for byte the same.
- The build writes nothing unless all of these hold: the marks cover each fact once, each
  pair of facts once and all three once, and no mark is malformed; there is exactly one
  booking link, it is a `mailto:` or `https:` address, and its visible words say the call
  is paid; the masthead leads to the call; each place that offers the call (above) states
  its fee once and its length once; every place states the same fee and the same length,
  compared as a currency and amount and as minutes, so different spellings of one fee or
  one length agree; no fee or length appears anywhere else on a page, in its text or its
  attributes, even spelt with entities or in words, and no fee is given as a bare number;
  each page's first link skips to its main element; nothing is loaded from another origin
  (link elements, `src`, `srcset`, `poster`, `data`, inline styles, CSS `url()` and
  `@import`); no script runs, there are no inline handlers and no `javascript:` links;
  every comment is closed; and, in both colour schemes, ink keeps 7:1 on the paper, soft
  ink and red 4.5:1, the rings of the mark 4:1, the booking button's words 4.5:1 on its
  fill, and the fill 3:1 on the paper. The build holds no figure of its own: it reads the
  call's terms from the pages.

## Type, colour and grid
- Two faces. Source Serif 4 (SIL Open Font License, `fonts/`), variable weight and optical
  size, sets everything the page says. Metric-matched fallbacks (Georgia, Liberation Serif,
  Noto Serif), separate for display and text sizes, take the same room as the web font
  before it arrives. The device's own sans (San Francisco, Segoe UI, Roboto) sets what is
  used to find the way and to act: the section labels, the masthead's link, the booking
  button and the note under it. It is never downloaded, so it costs no request and cannot
  shift the layout.
- Sizes, from 1280 px: the opening line 56 px, the conclusion 48 px, the answers and the
  line that opens the call 40 px, the aim 26 px, the facts 20 px, reading text 18 px. Phones
  keep the same order at smaller steps (32, 30, 26, 26, 20, 18). The opening line keeps
  "will tell you" together, so on wide screens it breaks after those words. Worked out from
  these sizes and the widths measured on the previous build's screenshots: on a 1440 by 900
  screen the opening line, the three facts, the aim, the first answer and most of its reason
  are in view; on a 390 by 844 phone, the opening line, the facts, the aim and the first
  answer's title.
- Grid. Below 1024 px there is one column, each part's label stands above it on a hairline,
  and the marks hang in the margin. From 1024 px each part is two columns: its label in a
  rail on the left, set on the baseline of the part's first line, and the text beside it,
  with the marks in the gutter between; the masthead and the opening line span both. From
  1280 px the page is 57rem wide (a 12rem rail, a 3rem gutter, a 42rem column), so the
  hairlines end close to where the text does. In that column a fact and its meaning would
  overrun by a few words, so from 1024 px each takes a line of its own. Reading text keeps
  a measure of about 70 characters; the large lines may run wider.
- Paper, ink, soft ink, one red, a faint tone for hairlines, and a mid tone for the rings
  of the mark. Red is kept for filled points, the booking button, focus and selection, and
  link underlines on hover. A designed dark version follows the device on screen, with
  lighter soft ink and rings and slightly heavier labels; print always uses the light one.
  On the dark paper the points and the focus ring need a light red, but a light fill under
  dark words reads as peach, so the booking button keeps a deep red with light words there,
  as it has on the light paper.
- Contrast, as computed by the build. Light: ink 17.2:1, soft ink 6.7:1, red 6.0:1, rings
  4.3:1 on the paper; the button's words 6.0:1 on its fill, the fill 6.0:1 on the paper.
  Dark: ink 15.6:1, soft ink 8.7:1, red 6.6:1, rings 5.2:1; the button's words 4.9:1, the
  fill 3.2:1.
- Keyboard: a skip link is the first stop on each page. It appears only while focused,
  and then in the flow above the masthead, so it covers nothing. Focus is a red ring
  standing off the element, drawn at once, and every control has room around it, so no ring
  touches a letter. The footer's address, a link inside a line of text, gets the same ring
  drawn closer, ends its line, and the footer's lines are spaced so the ring clears the
  lines above and below; before, it was marked by a fill that faded in and could be missed.
- In forced colours the mark is redrawn in system colours as filled and open points, the
  buttons keep a border, and large lines get more leading.

## Checks on this build
- Build: every check above passes (seven marks, three images; the call's length and fee
  stated in five places, the same in each). The images came out byte for byte as before.
  The new checks were seen to fail on pages broken on purpose (the masthead's link without
  the fee; a different fee spelt with an entity; a length in the conclusion; a fee given as
  a bare number; a length of an hour and a half in the masthead), to pass when the same fee
  was written with the currency after the amount, and the page was then restored.
- An independent read of the change found no blocker and no major. It confirmed the grid
  placement, a visible ring on every control in both schemes, the contrast, and one fee and
  one length in each place. Acted on: the descriptions could be misread as a problem that
  "will not move to" the call; the privacy rule in CLAUDE.md now names the call's public
  terms as an exception; the conclusion's second line had a stock turn and a third play on
  "follows"; two answers ended on the same kind of punchline; the footer read as an unpaid
  way to the same help; the facts left short stubs in the desktop column; the footer ring
  touched a full stop; the build missed a bare fee and some ways of writing a length, and
  compared fees by spelling. Left as they are: the wider margin before the text on phones,
  which holds the marks; and the opening line at five lines on a 320 px screen.
- Not run in this environment, which has no browser: axe, html-validate, Lighthouse, a link
  check, a keyboard walk-through, the late-font layout-shift sweep, forced colours, print,
  and screenshots on phone and desktop. The first-screen contents above are worked out, not
  seen. They should run before merge.

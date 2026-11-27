# Build notes: reisierx.com

One page for ReisierX, a company that builds businesses, hands on. It reasons from three
facts no one chooses to how the company works, and ends on the call.

## The idea
The page is a derivation, laid out as a page. It starts from what is given, not from what
the company concludes, and every answer shows what it rests on. The sizes follow the
weight of the argument: the facts are premises and sit at reading size, so what the
company believes, and where it works, is what the eye meets first.

Given, three facts, each run on into what it means:
- Every result is partly luck. Effort and talent shift the odds; they do not decide the
  outcome.
- No one knows enough. Knowledge is partial, scattered and provisional, ours included.
- Time runs out. Every choice is paid for in it, and none of it comes back.

Facts set no aim, so the page states one: to build businesses that last. Held to that
aim, each pair of facts leaves one answer, and its paragraph names both facts:
- Luck, and no one knowing enough: trust no single result. Every piece of work is a test,
  so each is run cleanly (a careless test teaches nothing either way) and the approach
  changes when the evidence says so.
- No one knowing enough, and time running out: check what you can, and act on the rest.
- Luck, and time running out: keep every loss survivable.

Where all three bite at once, problems stall, and there the answers count for most; that
is where the company works. The page says so and no more: it does not walk each fact into
the conclusion again, and it does not explain the mark. It ends on the call: one paid call
on one problem that will not move.

Nothing on the page is a CV, a client, a firm, a quotation or a figure.

## The mark
Three points on an equilateral triangle, one for each fact (top: every result is partly
luck; bottom left: no one knows enough; bottom right: time runs out). A filled red point
is a fact the entry beside it rests on; an open ring is a fact it does not use. Each fact
fills its own point, each answer the two it rests on, and the conclusion all three, which
makes ∴, the sign for "therefore": the only full one on the page.

From 640 px every mark hangs in the left margin, centred on the first line of its entry,
and all the text runs down one edge. Read down the margin alone and it shows single facts
becoming pairs and then all three; nothing on the page has to say so. On phones the marks
of the facts sit in a narrow column beside them, and the marks of the answers and the
conclusion above them. The rings are drawn thicker than before so they hold their colour
on a dark ground. The full mark is also the favicon, the touch icon and the card a shared
link shows (`og.png`), which carries no words.

## Booking
There is one booking link: the element marked `data-book` in `index.html`, a `mailto:`
with the subject "Booking a paid call" and a short form in the body (the business, the
problem in a few lines, what has been tried). It is drawn as a filled button in red, the
only filled block on the page, and its words are "Book a paid call". Before it, in this
order, the call section says what the call is and that it is paid ("One paid call, on one
problem that will not move"), what it is for and what comes of it, that the fee is known
before booking, and what to tell us. While the link is a `mailto:`, the build prints the
address under it for anyone whose mail program does not open.

The masthead's "Book a paid call" is framed as a button and leads to the call section
(its name for screen readers adds ": the details"), so the page keeps a single booking
link and the visitor reads what the call is before writing. The words around the link do
not depend on how the call is booked, so moving to a booking page is a change to that one
`href`; the address line then disappears by itself. The build fails unless there is
exactly one booking link and its words say the call is paid.

The line for anyone who would rather work on such problems with us is in the footer, not
in the call section; hiring stays implied.

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
  is paid; the masthead leads to the call; each page's first link skips to its main
  element; no page shows a price, even one spelt with entities or words, nor a fee as a
  bare number, nor a length for the call in figures or words; nothing is loaded from
  another origin (link elements, `src`, `srcset`, `poster`, `data`, inline styles, CSS
  `url()` and `@import`); no script runs, there are no inline handlers and no
  `javascript:` links; every comment is closed; and on the paper, in both colour schemes,
  ink keeps 7:1, soft ink and red 4.5:1, and the rings of the mark 4:1.

## Type, colour and grid
- One typeface, Source Serif 4 (SIL Open Font License, `fonts/`), variable weight and
  optical size. Metric-matched fallbacks (Georgia, Liberation Serif, Noto Serif), separate
  for display and text sizes, take the same room as the web font before it arrives.
- Sizes, from 1280 px: the facts 20 px, the aim 26 px, the answers 44 px, the conclusion
  54 px, the line that opens the call 44 px, reading text 18 px. Phones keep the same
  order at smaller steps (18, 20, 28, 32, 28). Worked out from these sizes: on a 1440 by
  900 screen the facts, the aim and the first two answers are in view; on a 390 by 844
  phone, the facts, the aim, and the first answer's title and most of its reason.
- One text edge down the whole page, with the marks hanging in the margin from 640 px, so
  there is no gutter between columns and no pair of columns whose lines could drift apart.
  Reading text keeps a measure of about 70 characters; the large lines may run wider.
- Paper, ink, soft ink, one red, a faint tone for hairlines, and a mid tone for the rings
  of the mark. Red is kept for filled points, the booking button, focus and selection, and
  link underlines on hover. A designed dark version follows the device on screen, with
  lighter soft ink and rings and slightly heavier labels; print always uses the light one.
- Contrast on paper, as computed by the build. Light: ink 17.2:1, soft ink 6.7:1, red
  6.0:1, rings 4.3:1. Dark: ink 15.6:1, soft ink 8.7:1, red 6.6:1, rings 5.2:1.
- Keyboard: a skip link is the first stop on each page. It appears only while focused,
  and then in the flow above the masthead, so it covers nothing. Focus is a red ring
  standing off the element, and every control has room around it, so no ring touches a
  letter; links inside a line of text (the address in the footer, the name on the 404
  page) are filled red instead, as selected text is, with a transparent outline for
  forced colours. The booking button is set in the text face, whose stand-in fonts are
  matched for its size, so it does not change width when the web font arrives.
- In forced colours the mark is redrawn in system colours as filled and open points, the
  buttons keep a border, and large lines get more leading.

## Checks on this build
- Build: every check above passes (seven marks, three images). The new checks were seen
  to fail on pages broken on purpose for them (a booking link that said paid only to
  screen readers, no skip link, and a length for the call in figures and in words), and
  the page was then restored. The images came out byte for byte as before, since they
  draw only filled points.
- An independent read of the change found defects that are fixed here: a focused skip
  link that covered the masthead, a focus ring on the 404 page's name that touched the
  next word, a paid check that counted words only screen readers hear, no guard against a
  bare fee or a length, and a button set in stand-in fonts matched for large type. It
  also judged the first screen from the sizes: the first two answers in view on desktop,
  the first on a phone.
- Not run in this environment, which has no browser: axe, html-validate, Lighthouse, a link
  check, a keyboard walk-through, the late-font layout-shift sweep, forced colours, print,
  and screenshots on phone and desktop. The first-screen contents above are worked out from
  the sizes, not seen. They should run before merge.

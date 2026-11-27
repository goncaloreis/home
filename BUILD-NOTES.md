# Build notes: reisierx.com

One page for ReisierX, a company that builds businesses, hands on. It reasons from three
facts no one chooses to how the company works, and ends on the call.

## The idea
The page is a derivation, laid out as a page. It starts from what is given, not from what
the company concludes, and every answer shows what it rests on.

Given, three facts:
- Nothing is owed. Effort and talent give no claim on a result; chance has a hand in every
  outcome.
- No one knows enough. Knowledge is partial, scattered and provisional.
- Time runs out. Every choice is paid for in it.

None of them is chosen; what to do about them is. Each pair of facts gives one answer, and
each answer's paragraph opens on its two facts by name:
- Nothing is owed, and no one knows enough: read every result as evidence, never as a
  verdict, and do the work properly, since a careless test cannot be read.
- No one knows enough, and time runs out: borrow no conclusions, and act before you are
  sure.
- Nothing is owed, and time runs out: never stake the means to go again.

Where all three bite at once (outcome least certain, answer least known, road longest) is
where the company works. The page ends on the call: one problem, taken back to the facts,
and what we would do and why. The call is paid; no price is shown.

Nothing on the page is a CV, a client, a firm, a quotation or a figure.

## The mark
∴, the sign for "therefore": three points on an equilateral triangle, one for each fact
(top: nothing is owed; bottom left: no one knows enough; bottom right: time runs out).
Each fact carries its own point in red, each answer the two points it rests on, and the
conclusion all three, so the marks show the facts becoming the answers. The mark is also
the favicon, the touch icon and the card a shared link shows (`og.png`), which carries no
words.

## Booking
There is one booking link: the element marked `data-book` in `index.html`, a `mailto:`
with a subject and a short prompt in the body. The masthead's "Book a call" leads to the
call section rather than straight to email, so the page keeps a single booking link and the
visitor reads that the call is paid before writing. The words around the link do not depend
on how the call is booked, so moving to a booking page is a change to that one `href`. The
build fails unless there is exactly one.

## Medium and files
- Static HTML, no JavaScript, no requests to other origins, no cookies, no motion beyond
  colour changes on hover.
- `index.html`, `404.html`: the pages. `site.css`: the rules. `tokens.css`: this site's
  tokens (colour, type, space) and font faces; the only file with raw values.
- `build.mjs` (run by Vercel) copies the site into `site/`; expands each `<!--mark:NN-->`
  into an inline SVG (marks with two or three lit points are named for screen readers from
  the page's own facts); strips source comments; fills the theme colours from `tokens.css`;
  and draws `og.png`, `favicon.png` and `apple-touch-icon.png` from the same points and the
  palette with its own PNG encoder (zlib and a checksum). The images are written to the
  repository root, where they are committed, and to `site/`; every build rewrites them, so
  they always match the mark and the palette.
- The build writes nothing unless all of these hold: the marks cover each fact once, each
  pair of facts once and all three once; there is exactly one booking link, and it is a
  `mailto:` or `https:` address; the masthead leads to the call; no page shows a price;
  nothing is loaded from another origin (link elements, `src`, CSS `url()`); no script runs
  and there are no inline handlers; ink keeps 7:1, and soft ink and red 4.5:1, on the paper
  in both colour schemes.

## Type, colour and grid
- One typeface, Source Serif 4 (SIL Open Font License, `fonts/`), variable weight and
  optical size. Metric-matched fallbacks (Georgia, Liberation Serif, Noto Serif), separate
  for display and text sizes, take the same room as the web font before it arrives.
- Paper, ink, soft ink, one red, and a faint tone for hairlines and unlit points. Red is
  kept for the lit points, focus, selection, the underlines of the two links to the call,
  and links on hover. A designed dark version follows the device.
- Contrast on paper, as computed by the build. Light: ink 17.2:1, soft ink 6.7:1, red
  6.0:1. Dark: ink 15.6:1, soft ink 7.4:1, red 6.6:1.
- Phones: one column, and a two-line masthead. From 640 px the masthead is one line. From
  1024 px the three facts sit side by side with the three answers under them, each row
  aligned across its columns with subgrid; one bar in ink closes the argument, and the
  conclusion runs across the page under it.
- In forced colours the mark is redrawn as filled and open points in system colours, and
  large lines get more leading.

## Checks on this build
- Build: every check above passes (seven marks, three images). Three of the checks (the
  shape of the marks, the single booking link, no price) were also seen to fail on a page
  broken on purpose for each, and the page was then restored.
- The three images were opened and looked at after drawing.
- Not run in this environment, which has no browser: axe, html-validate, Lighthouse, a link
  check, a keyboard walk-through, the late-font layout-shift sweep, forced colours, print,
  and screenshots on phone and desktop. They should run before merge.

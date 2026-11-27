# Build notes: reisierx.com

One page for ReisierX, a company that builds businesses, hands on. It reasons from three
facts no one chooses to how the company works, and ends on the call.

## The idea
The page is a derivation, laid out as a page. It starts from what is given, not from what
the company concludes, and every answer shows what it rests on.

Given, three facts:
- Nothing is owed. Effort and talent give no claim on a result; chance enters every
  outcome and ignores what went into it.
- No one knows enough. Knowledge is partial, scattered and provisional, ours included.
- Time runs out. Every choice is paid for in it.

Facts tell no one what to do; they rule things out. Each answer is what is left once two of
them are taken seriously, and its paragraph names both:
- Nothing is owed, and no one knows enough: read every result as evidence, never as a
  verdict. Every piece of work is a test, so each is run cleanly (a careless test proves
  nothing either way) and the approach changes when the evidence says so.
- No one knows enough, and time runs out: check what you can, and act on the rest.
- Nothing is owed, and time runs out: never stake what you need to continue.

A problem is hard where all three bite at once: outcome least certain, answer least known,
road longest. The answers count for most there and most people stop early, so such
problems tend to stay open; the company chooses them. The page ends on the call: one
problem, taken back to the facts, and what we would do and why. The call is paid, and its
fee is confirmed before it is booked; no price is shown.

Nothing on the page is a CV, a client, a firm, a quotation or a figure.

## The mark
Three points on an equilateral triangle, one for each fact (top: nothing is owed; bottom
left: no one knows enough; bottom right: time runs out). A filled red point is a fact the
line beside it rests on; an open ring is a fact it does not use. Each fact fills its own
point, each answer the two it rests on, and the conclusion all three, which makes ∴, the
sign for "therefore": the only full one on the page. So the marks show the facts becoming
the answers. The full mark is also the favicon, the touch icon and the card a shared link
shows (`og.png`), which carries no words.

## Booking
There is one booking link: the element marked `data-book` in `index.html`, a `mailto:`
with a subject and a short prompt in the body. While it is a `mailto:`, the build prints
the address under it for anyone whose mail program does not open. The masthead's "Book a
call" leads to the call section (its name for screen readers adds ": the details"), so the
page keeps a single booking link and the visitor reads that the call is paid before
writing. The words around the link do not depend on how the call is booked, so moving to a
booking page is a change to that one `href`; the address line then disappears by itself.
The build fails unless there is exactly one booking link.

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
  booking link, and it is a `mailto:` or `https:` address; the masthead leads to the call;
  no page shows a price, even one spelt with entities or words; nothing is loaded from
  another origin (link elements, `src`, `srcset`, `poster`, `data`, inline styles, CSS
  `url()` and `@import`); no script runs, there are no inline handlers and no
  `javascript:` links; every comment is closed; and on the paper, in both colour schemes,
  ink keeps 7:1, soft ink and red 4.5:1, and the rings of the mark 3:1.

## Type, colour and grid
- One typeface, Source Serif 4 (SIL Open Font License, `fonts/`), variable weight and
  optical size. Metric-matched fallbacks (Georgia, Liberation Serif, Noto Serif), separate
  for display and text sizes, take the same room as the web font before it arrives.
- Paper, ink, soft ink, one red, a faint tone for hairlines, and a mid tone for the rings
  of the mark. Red is kept for filled points, focus, selection, the underlines of the two
  links to the call (whose words also turn red on hover), and other links' underlines on
  hover. A designed dark version follows the device on screen; print always uses the light
  one.
- Contrast on paper, as computed by the build. Light: ink 17.2:1, soft ink 6.7:1, red
  6.0:1, rings 3.3:1. Dark: ink 15.6:1, soft ink 7.4:1, red 6.6:1, rings 4.0:1.
- Phones: one column, and a two-line masthead. From 640 px the masthead is one line. From
  1024 px every statement sits on the left and its reason on the right, first lines on one
  baseline, so the left column read alone is the whole argument: the facts, why facts lead
  anywhere, the answers, the conclusion, and the link to book. One bar in ink closes the
  argument above the conclusion.
- In forced colours the mark is redrawn in system colours as filled and open points, and
  large lines get more leading.

## Checks on this build
- Build: every check above passes (seven marks, three images). The checks were also seen
  to fail on pages broken on purpose for them (a malformed mark, a second booking link, a
  price written with entities, an image from another origin, a `javascript:` link, a broken
  set of marks), and the page was then restored.
- The three images were opened and looked at after drawing.
- An independent read of the HTML, CSS and build code found defects that are fixed here:
  unlit points too faint, smooth scrolling against the no-motion rule, two links with the
  same name, a comment stripper that could over-reach, checks that could pass vacuously,
  a viewport fallback that never applied, and dark colours reaching print.
- Not run in this environment, which has no browser: axe, html-validate, Lighthouse, a link
  check, a keyboard walk-through, the late-font layout-shift sweep, forced colours, print,
  and screenshots on phone and desktop. They should run before merge.

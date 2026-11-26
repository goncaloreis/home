# Build notes: reisierx.com

One page for ReisierX, a company that builds businesses, hands on. It says what the
company believes, in five lines, and works each line out.

## The idea
The first screen is the owner's own sentence, set as five numbered lines:

1. The world is a war of attrition.
2. The job is to get up, once and again;
3. to think from first principles;
4. to cut no corners;
5. to go for the difficult.

Under it, one sentence says where the lines come from: co-founding a venture-backed fashion
company in Singapore, leading European go-to-market for a Silicon Valley software company,
and running a Lisbon venture firm's investments for five years.

Then each line is worked out with a claim, two or three sentences and its own figure, all
five in one vocabulary: a stroke is one attempt, its height the chance that one has worked
by then.
1. Staying beats being better: twice as able but stopping after three attempts gets there
   49% of the time; half as able but going on for thirty, 96%.
2. Every attempt moves the odds: at one in ten, 7 attempts are better than even, 44 are 99%.
3. A copied attempt moves nothing: worked out again each time, 22 attempts reach 90%;
   repeated, they stay at 10%.
4. A cut corner doubles the work: one in twenty needs 90 attempts where one in ten needs 44.
5. Hard ground empties first: after five attempts two in three arrive on easy ground, one in
   six on hard; whoever keeps going for ninety arrives 95% of the time.

One witness per author stands with the line it fits: Kipling's 'If—' (1910) with line 1,
Roosevelt's Sorbonne speech (1910) with line 2, Henley's 'Invictus' (1875) with line 5.
The page closes on line 6, the reader's, at the size of the creed: "If that is how you work,
write to hello@reisierx.com".

## Medium and files
- Static HTML, no JavaScript, no requests to other origins, no cookies.
- `index.html`, `404.html`: the pages. `site.css`: the rules. `tokens.css`: this site's own
  tokens (colour, type, space) and font faces; the only file with raw values.
- `build.mjs` (run by Vercel) copies the site into `site/`, draws the five figures from their
  formulas, places their labels, and fails the build if any number in the copy disagrees with
  the arithmetic (eight assertions).
- `og.png`, `favicon.png`, `apple-touch-icon.png` were rendered once from the page's own
  type and colours, and are committed.
- No price and no paid session on the page; the build reads no price variable.

## Type, colour and grid
- One typeface, Source Serif 4 (SIL Open Font License, `fonts/`), variable weight and
  optical size.
- Paper, ink and one red, used only for the numbers, the marked attempts, focus, selection
  and the final address. A designed dark version follows the device.
- Contrast, light: ink 15.6:1, soft ink 7.2:1, red 6.4:1, figure strokes 3.4:1.
  Dark: ink 15.0:1, soft ink 7.3:1, red 6.4:1, figure strokes 4.1:1.
- The creed sets the measure. From 640 px its optical size is pinned at 60, where line 2 is
  14.051 em wide, and the page's right edge is placed where line 2 ends: the masthead
  address, the figures and the cue all end on it. The creed's size is the smaller of what
  the width and the height allow, so the creed, the provenance and the address fit the first
  screen down to a 390x664 phone and a 1366x668 laptop window.
- Proofs sit in two columns from 1280 px, reasoning left and figure right. On phones the
  creed breaks into stanzas, flush left, and quoted verse runs on with slashes.

## Nothing moves when the font arrives
- Each creed line is one text node; below 640 px its newline is the designed break, above it
  a space. Fallback faces may run past line 2's edge into the margin instead of wrapping.
- The first screen's spacing is computed from reserved sizes (masthead, creed in em,
  provenance lines, cue), not measured ones, so text that wraps differently in a fallback
  font only changes empty space below it.
- Fallback faces are matched per platform (Georgia, Liberation Serif, Noto Serif), separately
  for display and text sizes: `size-adjust` matches average width, and the ascent and descent
  overrides put every baseline where Source Serif 4 puts it.
- In forced colours the display leading opens up, so the plates the system paints behind each
  line never cover the descenders above.

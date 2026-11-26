# Build notes: reisierx.com

One page for ReisierX, a company that builds businesses, hands on. It says what the
company believes, in five lines, and then argues them.

## The idea
The creed is the owner's own sentence, set as five numbered lines:

1. The world is a war of attrition.
2. The job is to get up, once and again;
3. to think from first principles;
4. to cut no corners;
5. to go for the difficult.

Each line is then argued in a note, and the notes form one chain held together by
arithmetic: if one attempt in ten works, 7 attempts are better than even, 22 are nine in
ten and 44 are all but certain (line 2). That holds only if each attempt is new (line 3)
and done properly: halve the odds by cutting corners and 44 attempts become 90 (line 4).
Difficult ground is where attrition can be won, because that is where others stop first
(line 5, back to line 1). Beside each note stands a short, exact passage from Kipling's
'If—' (1910), Roosevelt's Sorbonne speech (1910) or Henley's 'Invictus' (1875).

## Medium and files
- Static HTML, no JavaScript, no requests to other origins, no cookies.
- `index.html`, `404.html`: the pages. `site.css`: the rules. `tokens.css`: this site's own
  tokens (colour, type, space) and font faces; the only file with raw values.
- `build.mjs` (run by Vercel) copies the site into `site/`, draws the figure's 44 strokes
  from the formula, fills the three percentages, and fails the build if any number in the
  copy disagrees with the arithmetic.
- `og.png`, `favicon.png`, `apple-touch-icon.png` were rendered once from the page's own
  type and colours, and are committed.
- No price and no paid session on the page; the build reads no price variable.

## Type and colour
- One typeface, Source Serif 4 (SIL Open Font License, `fonts/`), variable weight and
  optical size. The creed uses the display optical size; notes use text sizes.
- Paper, ink and one red, used only for the line numbers, the three marked attempts, focus,
  selection and the final address. A designed dark version follows the device.
- Contrast, light: ink 15.6:1, soft ink 7.2:1, red 6.4:1, figure strokes 3.4:1.
  Dark: ink 15.0:1, soft ink 7.3:1, red 6.4:1, figure strokes 4.1:1.

## Nothing moves when the font arrives
- The masthead has a fixed height and the creed fills the rest of the first screen, so the
  first screen is the same height in any font.
- Each creed line is one text node. Below 1024 px a newline in it is the designed break
  (`white-space: pre-line`); from 1024 px it is a space. The size comes from the widest piece
  with 5% slack over the widest fallback, so no font can rewrap it.
- Fallback faces are matched per platform (Georgia, Liberation Serif, Noto Serif), separately
  for display and text sizes: `size-adjust` matches average width, and the ascent and
  descent overrides put every baseline where Source Serif 4 puts it.
- In forced colours the display leading opens up, so the plates the system paints behind
  each line never cover the descenders above.

## Checks on this build
- Build: the four arithmetic assertions pass (7, 22, 44 and 90 attempts).
- axe: 0 violations at 390x844 and 1440x900, light and dark. html-validate: 0 errors.
- Links: 14 of 14 resolve. Console errors: 0. Keyboard: every stop in screen order, each
  with a visible ring; targets at least 24 px.
- Lighthouse, mobile and desktop: 100 in all four categories; LCP 0.9 s on mobile; CLS 0;
  152 KiB in total.
- Late-font layout shift (web font held 2.5 s): 0 in every band, in a sweep of 160 widths
  from 320 to 1920 px at up to five window heights each, with three fallback sets (Georgia
  and Arial; Noto Serif and Roboto; Liberation). Longest line 66 characters, 71 with the
  web font blocked. No sideways scroll anywhere, at 200% zoom, or with WCAG text spacing.
- Forced colours, print (four A4 pages) and older browsers without container units checked.
- Privacy scan: 0 hits. Suite scanner (informational): pass.

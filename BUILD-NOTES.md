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

// Builds reisierx.com into ./site for Vercel (vercel.json runs `node build.mjs`).
//
// It copies the pages, styles and fonts; draws the mark into the pages and into the
// images (og.png, favicon.png, apple-touch-icon.png); and refuses to build if the site
// breaks one of its own rules: the shape of the argument, one booking link, no price,
// nothing loaded from another origin, no script, and text that keeps its contrast on the
// paper in both colour schemes. Nothing is written unless every check passes.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const OUT = "site";
const failures = [];
const check = (holds, rule) => {
  if (!holds) failures.push(rule);
};

// The mark is ∴, the sign for "therefore". Each point stands for one fact: nothing is
// owed (top), no one knows enough (bottom left), time runs out (bottom right). A point in
// red is a fact the line beside it rests on, so the whole sign, all three lit, marks the
// conclusion. The points sit on an equilateral triangle.
const MARK = { width: 24, height: 22, r: 3.25, points: [[12, 4.5], [4.5, 17.5], [19.5, 17.5]] };

// ---- Colour, read from tokens.css ----------------------------------------------------

const tokens = readFileSync("tokens.css", "utf8");
const darkAt = tokens.indexOf("@media (prefers-color-scheme: dark)");
check(darkAt > 0, "tokens.css has a dark palette");
const colours = (css) =>
  Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [m[1], m[2]]));
const light = colours(tokens.slice(0, darkAt));
const dark = colours(tokens.slice(darkAt, tokens.indexOf("@media", darkAt + 1)));

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toLinear = (v) => {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const toByte = (l) => {
  const s = l <= 0.0031308 ? 12.92 * l : 1.055 * l ** (1 / 2.4) - 0.055;
  return Math.round(255 * Math.min(1, Math.max(0, s)));
};
const luminance = (hex) => {
  const [r, g, b] = rgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Ink is held to 7:1. Soft ink and red also set text, so they are held to 4.5:1.
const NEEDS = { ink: 7, "ink-soft": 4.5, red: 4.5 };
const ratios = { light: [], dark: [] };
for (const [scheme, palette] of [["light", light], ["dark", dark]]) {
  for (const [name, least] of Object.entries(NEEDS)) {
    const ratio = palette[name] && palette.paper ? contrast(palette[name], palette.paper) : 0;
    check(ratio >= least, `in the ${scheme} scheme, ${name} on paper is at least ${least}:1 (it is ${ratio.toFixed(2)}:1)`);
    ratios[scheme].push(`${name} ${ratio.toFixed(1)}:1`);
  }
}

// ---- The pages -----------------------------------------------------------------------

const source = readFileSync("index.html", "utf8");

// The facts, in the order of the points of the mark, as the page states them.
const facts = [...source.matchAll(/<h3 class="fact-title">([\s\S]*?)<\/h3>/g)].map((m) =>
  m[1]
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim()
    .replace(/\.$/, "")
    .replace(/^./, (c) => c.toLowerCase()),
);
check(facts.length === MARK.points.length, "index.html states one fact for each point of the mark");

// The shape of the argument: each fact marked once, each pair of facts giving one answer,
// and all three together giving the conclusion.
const marks = [...source.matchAll(/<!--mark:([1-3]+)-->/g)].map((m) => [...m[1]].sort().join(""));
check(
  marks.slice().sort().join(" ") === ["1", "2", "3", "12", "13", "23", "123"].sort().join(" "),
  "the marks cover each fact once, each pair of facts once, and all three once",
);

function mark(lit) {
  const dots = MARK.points
    .map(([cx, cy], i) => `<circle class="${lit.includes(i + 1) ? "on" : "off"}" cx="${cx}" cy="${cy}" r="${MARK.r}"/>`)
    .join("");
  // A single lit point stands beside its own fact and adds nothing to the words. Two or
  // three say what a line rests on, so screen readers are told which.
  let a11y = 'aria-hidden="true"';
  if (lit.length === MARK.points.length) a11y = 'role="img" aria-label="Rests on all three facts."';
  else if (lit.length > 1) a11y = `role="img" aria-label="Rests on two facts: ${lit.map((n) => facts[n - 1]).join("; ")}."`;
  return `<svg class="mark" viewBox="0 0 ${MARK.width} ${MARK.height}" width="${MARK.width}" height="${MARK.height}" ${a11y} focusable="false">${dots}</svg>`;
}

function page(file) {
  let html = readFileSync(file, "utf8");
  html = html.replace(/<!--mark:([1-3]+)-->/g, (_, digits) => mark([...digits].map(Number)));
  // Notes in the source are for whoever edits it; they are not shipped.
  html = html.replace(/^[ \t]*<!--[\s\S]*?-->[ \t]*\r?\n/gm, "").replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/\{\{paper\}\}/g, light.paper ?? "").replace(/\{\{paper-dark\}\}/g, dark.paper ?? "");
  check(!/\{\{|<!--/.test(html), `${file} has every placeholder filled`);
  return html;
}

const pages = { "index.html": page("index.html"), "404.html": page("404.html") };
const index = pages["index.html"];

// The main action is booking a paid call, through exactly one link, so that moving from
// email to a booking page is a change to one href.
const booking = [...index.matchAll(/<a\b[^>]*\bdata-book\b[^>]*>/g)].map((m) => m[0]);
check(booking.length === 1, "index.html has exactly one booking link (data-book)");
const bookingHref = booking[0]?.match(/\bhref="([^"]*)"/)?.[1] ?? "";
check(/^(mailto:|https:\/\/)/.test(bookingHref), "the booking link is a mailto: or https: address");
check(index.includes('href="#call"'), "the masthead leads to the call");

for (const [name, html] of Object.entries(pages)) {
  // No price anywhere until the owner sets one.
  check(!/[$€£¥]\s?\d|\d\s?[$€£¥]|\b(?:EUR|USD|GBP|CHF)\b/i.test(html), `${name} shows no price`);
  // Nothing loaded from another origin: stylesheets, fonts, icons and any src are the
  // site's own. (The canonical link names the site's address and loads nothing.)
  const loads = [
    ...[...html.matchAll(/<link\b[^>]*>/g)]
      .map((m) => m[0])
      .filter((tag) => !/\brel="canonical"/.test(tag))
      .map((tag) => tag.match(/\bhref="([^"]*)"/)?.[1] ?? ""),
    ...[...html.matchAll(/\bsrc(?:set)?="([^"]*)"/g)].map((m) => m[1]),
  ];
  check(loads.every((url) => /^\/(?!\/)/.test(url)), `${name} loads nothing from another origin`);
  // No script runs: the only script element is the structured data, which is not run.
  const scripts = [...html.matchAll(/<script\b[^>]*>/g)].map((m) => m[0]);
  check(scripts.every((tag) => /\btype="application\/ld\+json"/.test(tag)), `${name} runs no script`);
  check(!/<[^>]*\son[a-z]+\s*=/i.test(html), `${name} has no inline event handlers`);
}
for (const name of ["tokens.css", "site.css"]) {
  const urls = [...readFileSync(name, "utf8").matchAll(/url\(\s*["']?([^"')\s]+)/g)].map((m) => m[1]);
  check(urls.every((url) => /^\.?\/(?!\/)/.test(url)), `${name} loads nothing from another origin`);
}

if (failures.length) {
  for (const rule of failures) console.error(`Not built, because this does not hold: ${rule}.`);
  process.exit(1);
}

// ---- The images ----------------------------------------------------------------------
// The mark again, at pixel level: sixteen samples per pixel, blended in linear light, on
// the paper or on nothing. A PNG needs only zlib and a checksum.

function draw({ width, height, scale, background }) {
  const left = (width - MARK.width * scale) / 2;
  const top = (height - MARK.height * scale) / 2;
  const centres = MARK.points.map(([x, y]) => [left + x * scale, top + y * scale]);
  const r = MARK.r * scale;
  const channels = background ? 3 : 4;
  const stride = 1 + width * channels; // each row opens with its filter byte, 0 (none)
  const raw = Buffer.alloc(stride * height);
  const red = rgb(light.red);
  const fg = red.map(toLinear);
  const bg = background ? rgb(background).map(toLinear) : null;
  const S = 4;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let inside = 0;
      for (const [cx, cy] of centres) {
        if (Math.abs(x + 0.5 - cx) > r + 1 || Math.abs(y + 0.5 - cy) > r + 1) continue;
        for (let sy = 0; sy < S; sy += 1) {
          for (let sx = 0; sx < S; sx += 1) {
            const dx = x + (sx + 0.5) / S - cx;
            const dy = y + (sy + 0.5) / S - cy;
            if (dx * dx + dy * dy <= r * r) inside += 1;
          }
        }
      }
      const cover = inside / (S * S); // the points never overlap
      const at = y * stride + 1 + x * channels;
      for (let c = 0; c < 3; c += 1) raw[at + c] = bg ? toByte(bg[c] + (fg[c] - bg[c]) * cover) : red[c];
      if (!bg) raw[at + 3] = Math.round(255 * cover);
    }
  }
  return png(width, height, channels, raw);
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes) {
  let c = 0xffffffff;
  for (const byte of bytes) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const out = Buffer.alloc(8 + body.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), 4 + body.length);
  return out;
}

function png(width, height, channels, raw) {
  const header = Buffer.alloc(13); // compression, filter and interlace methods stay 0
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bits per channel
  header[9] = channels === 4 ? 6 : 2; // RGBA or RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("sRGB", Buffer.from([0])),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// og.png is the card a shared link shows. favicon.png has nothing behind the points, so it
// sits on any colour of tab. apple-touch-icon.png keeps the paper, as iOS fills
// transparency with black.
const images = {
  "og.png": draw({ width: 1200, height: 630, scale: 8, background: light.paper }),
  "favicon.png": draw({ width: 64, height: 64, scale: 64 / MARK.width }),
  "apple-touch-icon.png": draw({ width: 180, height: 180, scale: 5, background: light.paper }),
};

// ---- Write ---------------------------------------------------------------------------

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const file of ["tokens.css", "site.css", "robots.txt", "sitemap.xml"]) cpSync(file, `${OUT}/${file}`);
cpSync("fonts", `${OUT}/fonts`, { recursive: true });
for (const [name, html] of Object.entries(pages)) writeFileSync(`${OUT}/${name}`, html);
// The images are also kept at the repository root, where they are committed. Every build
// rewrites them, so the committed files are always the ones the site serves.
for (const [name, image] of Object.entries(images)) {
  writeFileSync(name, image);
  writeFileSync(`${OUT}/${name}`, image);
}

console.log(
  `built ${OUT}/: ${Object.keys(pages).length} pages, ${marks.length} marks, ${Object.keys(images).length} images; ` +
    `booking by ${bookingHref.split(":")[0]}; ` +
    `contrast on paper, light: ${ratios.light.join(", ")}; dark: ${ratios.dark.join(", ")}`,
);

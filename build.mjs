// Builds reisierx.com into ./site for Vercel (vercel.json runs `node build.mjs`).
//
// It copies the pages, styles and fonts; draws the mark into the pages and into the
// images (og.png, favicon.png, apple-touch-icon.png); and refuses to build if the site
// breaks one of its own rules: the shape of the argument, one booking link that says the
// call is paid, the call's length and fee stated once wherever the call is offered and the
// same in every place, a way past the masthead for keyboards, nothing loaded from another
// origin, no script, and colours that keep their contrast in both colour schemes. Every page
// is also stamped with the commit it was built from. Nothing is written unless every check
// passes.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { deflateSync } from "node:zlib";

const OUT = "site";
const failures = [];
const check = (holds, rule) => {
  if (!holds) failures.push(rule);
};

// The mark: three points on an equilateral triangle, one for each fact. Every result is
// partly luck is the top point, no one knows enough the bottom left, time runs out the
// bottom right.
// A filled red point is a fact the entry beside it rests on; an open ring is a fact it does
// not use. A ring's radius is cut by half its width, so its outer edge matches a filled
// point, and the ring is drawn thick enough to hold its colour on a dark ground. All three
// filled is ∴, the sign for "therefore", and marks the conclusion.
const MARK = { width: 24, height: 22, r: 3.25, ring: 1.6, points: [[12, 4.5], [4.5, 17.5], [19.5, 17.5]] };

// ---- Colour, read from tokens.css ----------------------------------------------------

const tokens = readFileSync("tokens.css", "utf8");
const DARK = "@media screen and (prefers-color-scheme: dark)";
const darkAt = tokens.indexOf(DARK);
check(darkAt > 0, "tokens.css has a dark palette");
const colours = (css) =>
  Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [m[1], m[2]]));
const light = colours(tokens.slice(0, darkAt));
const dark = colours(tokens.slice(darkAt, tokens.indexOf("@media", darkAt + DARK.length)));

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

// Ink is held to 7:1. Soft ink and red also set text, so they are held to 4.5:1. Unlit
// draws the open rings of the mark, a graphic that carries meaning; 3:1 is the floor for
// that, but a thin ring reads fainter than its colour, so it is held to 4:1. The booking
// button sets on-act on act: its words are held to 4.5:1 on the fill, and the fill, the
// shape of a control, to 3:1 on the paper.
const NEEDS = { ink: 7, "ink-soft": 4.5, red: 4.5, unlit: 4 };
const PAIRS = [
  ["on-act", "act", 4.5],
  ["act", "paper", 3],
];
const ratios = { light: [], dark: [] };
for (const [scheme, palette] of [["light", light], ["dark", dark]]) {
  for (const [name, least] of Object.entries(NEEDS)) {
    const ratio = palette[name] && palette.paper ? contrast(palette[name], palette.paper) : 0;
    check(ratio >= least, `in the ${scheme} scheme, ${name} on paper is at least ${least}:1 (it is ${ratio.toFixed(2)}:1)`);
    ratios[scheme].push(`${name} ${ratio.toFixed(1)}:1`);
  }
  for (const [fore, back, least] of PAIRS) {
    const ratio = palette[fore] && palette[back] ? contrast(palette[fore], palette[back]) : 0;
    check(ratio >= least, `in the ${scheme} scheme, ${fore} on ${back} is at least ${least}:1 (it is ${ratio.toFixed(2)}:1)`);
    ratios[scheme].push(`${fore} on ${back} ${ratio.toFixed(1)}:1`);
  }
}

// ---- The commit ----------------------------------------------------------------------
// Every page carries the commit it was built from, in a meta tag in its head that nothing
// shows, so a served page can be traced to its source. Vercel gives the build the commit;
// anywhere else it is read from the repository, a worktree included. A build that can find
// neither says "unknown" rather than fail, so a deploy never stops for want of it.

function commitSha() {
  const given = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "").trim();
  if (given) return given;
  try {
    let git = ".git";
    if (statSync(git).isFile()) git = resolve(readFileSync(git, "utf8").match(/^gitdir:\s*(.+)$/m)[1].trim());
    const common = existsSync(`${git}/commondir`) ? resolve(git, readFileSync(`${git}/commondir`, "utf8").trim()) : git;
    const head = readFileSync(`${git}/HEAD`, "utf8").trim();
    const ref = head.match(/^ref:\s*(\S+)$/)?.[1];
    if (!ref) return head;
    for (const dir of [git, common]) {
      if (existsSync(`${dir}/${ref}`)) return readFileSync(`${dir}/${ref}`, "utf8").trim();
    }
    const packed = existsSync(`${common}/packed-refs`) ? readFileSync(`${common}/packed-refs`, "utf8") : "";
    return packed.split("\n").find((line) => line.endsWith(` ${ref}`))?.split(" ")[0] ?? "";
  } catch {
    return "";
  }
}
const commit = commitSha();
const SHA = /^[0-9a-f]{7,64}$/i.test(commit) ? commit.toLowerCase() : "unknown";

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

// The one booking link, read from the source so the page can say how it is booked.
const bookingTags = [...source.matchAll(/<a\b[^>]*\bdata-book\b[^>]*>/g)].map((m) => m[0]);
const bookingHref = (bookingTags[0]?.match(/\bhref="([^"]*)"/)?.[1] ?? "").replace(/&amp;/g, "&");
const bookingAddress = bookingHref.startsWith("mailto:") ? bookingHref.slice(7).split("?")[0] : "";

function mark(lit) {
  const dots = MARK.points
    .map(([cx, cy], i) =>
      lit.includes(i + 1)
        ? `<circle class="on" cx="${cx}" cy="${cy}" r="${MARK.r}"/>`
        : `<circle class="off" cx="${cx}" cy="${cy}" r="${MARK.r - MARK.ring / 2}" stroke-width="${MARK.ring}"/>`,
    )
    .join("");
  // A single filled point stands beside its own fact and adds nothing to the words. Two or
  // three say what a line rests on, so screen readers are told which.
  let a11y = 'aria-hidden="true"';
  if (lit.length === MARK.points.length) a11y = 'role="img" aria-label="Rests on all three facts."';
  else if (lit.length > 1) a11y = `role="img" aria-label="Rests on two facts: ${lit.map((n) => facts[n - 1]).join("; ")}."`;
  return `<svg class="mark" viewBox="0 0 ${MARK.width} ${MARK.height}" width="${MARK.width}" height="${MARK.height}" ${a11y} focusable="false">${dots}</svg>`;
}

// A comment runs from <!-- to the first --> after it, and no further.
const COMMENT = "<!--(?:(?!-->)[\\s\\S])*-->";

function page(file) {
  let html = readFileSync(file, "utf8");
  html = html.replace(/<!--mark:([1-3]+)-->/g, (_, digits) => mark([...digits].map(Number)));
  check(!/<!--\s*mark/i.test(html), `${file} has no mark the build could not read`);
  // While booking is by email, the address is printed under the link, for anyone whose
  // mail program does not open. A booking page needs no such line.
  html = html.replace(/<!--booking-via-->/g, bookingAddress ? `<span class="via">By email, to ${bookingAddress}</span>` : "");
  // Notes in the source are for whoever edits it; they are not shipped.
  html = html.replace(new RegExp(`^[ \\t]*${COMMENT}[ \\t]*\\r?\\n`, "gm"), "").replace(new RegExp(COMMENT, "g"), "");
  html = html.replace(/\{\{paper\}\}/g, light.paper ?? "").replace(/\{\{paper-dark\}\}/g, dark.paper ?? "");
  check(!/\{\{|<!--/.test(html), `${file} has every placeholder filled and every comment closed`);
  // The commit goes in last, after the comments are gone, as the final line of the head.
  check(!/name="build-sha"/.test(html) && (html.match(/<\/head>/gi) ?? []).length === 1, `${file} has one head and no commit of its own`);
  html = html.replace(/<\/head>/i, `  <meta name="build-sha" content="${SHA}">\n</head>`);
  return html;
}

const pages = { "index.html": page("index.html"), "404.html": page("404.html") };
const index = pages["index.html"];

// The main action is booking a paid call, through exactly one link, so that moving from
// email to a booking page is a change to one href.
check(bookingTags.length === 1 && [...index.matchAll(/\bdata-book\b/g)].length === 1, "index.html has exactly one booking link (data-book)");
check(/^(mailto:|https:\/\/)/.test(bookingHref), "the booking link is a mailto: or https: address");
check(index.includes('href="#call"'), "the masthead leads to the call");
// The link's visible words say the call is paid, whatever the href becomes. The site has no
// class that hides words from sight, so every word inside the link is seen.
const bookingWords = (source.match(/<a\b[^>]*\bdata-book\b[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? "").replace(/<[^>]+>/g, " ");
check(/\bpaid\b/i.test(bookingWords), "the booking link says the call is paid");

// The call's terms, its length and its fee, are the owner's to set. Every place that offers
// the call states them plainly and once: the description a search shows, the one a shared
// link shows, the masthead's way to the call, and the call itself, before its booking link.
// They are the same in every place and appear nowhere else on the page, in its text or its
// attributes. The build holds no figure of its own: it reads them from the pages, so a new
// fee or length is a change to the pages alone. A fee could hide behind an entity, so
// entities are read first.
const SYMBOLS = { euro: "€", pound: "£", dollar: "$", yen: "¥", cent: "¢", nbsp: " " };
const decode = (html) =>
  html
    .replace(/&([a-z]+);/gi, (whole, name) => SYMBOLS[name.toLowerCase()] ?? whole)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)));
const AMOUNT = String.raw`\d+(?:[.,]\d+)*`;
const FEE = new RegExp(
  String.raw`[$€£¥¢]\s*${AMOUNT}|${AMOUNT}\s*(?:[$€£¥¢]|(?:EUR|USD|GBP|CHF|euros?|dollars?|pounds?|francs?)\b)|\b(?:EUR|USD|GBP|CHF)\s*${AMOUNT}`,
  "gi",
);
// A fee could also be given as a bare number beside a word for it; once every fee with its
// currency is set aside, no such number may remain.
const BARE_FEE = /\b(?:fees?|prices?|priced|costs?|costing|rates?|charges?|charged)\b[^.<]{0,40}?\d/i;
const CURRENCY = { "€": "EUR", euro: "EUR", euros: "EUR", $: "USD", dollar: "USD", dollars: "USD", "£": "GBP", pound: "GBP", pounds: "GBP", "¥": "JPY", "¢": "US cents", franc: "CHF", francs: "CHF" };
// So "€250", "250 €" and "EUR 250" are one fee: the currency's code, then the whole amount.
const feeOf = ([text]) => {
  const amount = text.match(/\d+(?:[.,]\d+)*/)[0].replace(/[.,](?=\d{3}(?!\d))/g, "");
  const unit = text.replace(/[\d.,\s]/g, "");
  return `${CURRENCY[unit.toLowerCase()] ?? unit.toUpperCase()} ${amount}`;
};
// A length in figures or words, in hours or minutes, read as minutes so that "one hour",
// "an hour" and "sixty minutes" agree, and "an hour and a half" does not.
const WORDS = {
  "half an": 0.5, half: 0.5, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, ten: 10, fifteen: 15,
  twenty: 20, thirty: 30, "forty-five": 45, forty: 40, fifty: 50, sixty: 60, ninety: 90,
};
const LENGTH = new RegExp(
  String.raw`\b(${Object.keys(WORDS).join("|")}|\d+(?:[.,]\d+)?)[\s-]*(hours?|hrs?|minutes?|mins?)\b(\s+and\s+a\s+half)?`,
  "gi",
);
const minutesOf = ([, amount, unit, andHalf]) =>
  ((WORDS[amount.toLowerCase()] ?? Number(amount.replace(",", "."))) + (andHalf ? 0.5 : 0)) * (/^h/i.test(unit) ? 60 : 1);
const found = (pattern, html) => [...decode(html ?? "").matchAll(pattern)];

const metaContent = (html, key) =>
  html.match(new RegExp(`<meta\\s+(?:name|property)="${key}"\\s+content="([^"]*)"`))?.[1];
const wayToCall = (html) => html.match(/<a\b[^>]*\bclass="to-call"[^>]*>([\s\S]*?)<\/a>/)?.[1];
const beforeBooking = (html) => {
  const opens = html.indexOf('id="call"');
  const from = opens < 0 ? -1 : html.indexOf(">", opens) + 1;
  const to = html.search(/<a\b[^>]*\bdata-book\b/);
  return from > 0 && to > from ? html.slice(from, to) : undefined;
};
const PLACES = {
  "index.html": [
    ["the description a search shows", (html) => metaContent(html, "description")],
    ["the description a shared link shows", (html) => metaContent(html, "og:description")],
    ["the masthead's way to the call", wayToCall],
    ["the call, before its booking link", beforeBooking],
  ],
  "404.html": [["the masthead's way to the call", wayToCall]],
};
const terms = { fee: new Set(), minutes: new Set() };

// Only the site's own files may be loaded: no scheme, and not protocol-relative.
const own = (url) => !/^[a-z][a-z0-9+.-]*:/i.test(url.trim()) && !url.trim().startsWith("//");
const cssUrls = (css) =>
  [...css.matchAll(/url\(\s*["']?([^"')\s]+)|@import\s+["']([^"']+)/gi)].map((m) => m[1] ?? m[2]);

for (const [name, html] of Object.entries(pages)) {
  const places = PLACES[name] ?? [];
  for (const [place, find] of places) {
    const part = find(html);
    const fees = found(FEE, part);
    const lengths = found(LENGTH, part);
    check(
      part !== undefined && fees.length === 1 && lengths.length === 1,
      `${name} states the call's fee once and its length once in ${place} ` +
        `(it states the fee ${fees.length} times and the length ${lengths.length} times)`,
    );
    fees.forEach((match) => terms.fee.add(feeOf(match)));
    lengths.forEach((match) => terms.minutes.add(minutesOf(match)));
  }
  check(found(FEE, html).length === places.length, `${name} states a fee nowhere but where the call is offered`);
  check(found(LENGTH, html).length === places.length, `${name} states the call's length nowhere but where the call is offered`);
  check(!BARE_FEE.test(decode(html).replace(FEE, " ")), `${name} gives no fee as a bare number`);
  // A keyboard reaches the content without passing the masthead: the first link on the
  // page skips to the main element.
  const firstLink = html.slice(html.indexOf("<body")).match(/<a\b[^>]*>/)?.[0] ?? "";
  check(
    /\bhref="#main"/.test(firstLink) && /<main\b[^>]*\bid="main"/.test(html),
    `${name} opens with a link that skips to the main content`,
  );
  const loads = [];
  let handlers = 0;
  let scriptLinks = 0;
  for (const [, tagName, attrs] of html.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi)) {
    const tag = tagName.toLowerCase();
    for (const [, attrName, dq, sq, bare] of attrs.matchAll(/([^\s=/>"']+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) {
      const attr = attrName.toLowerCase();
      const value = dq ?? sq ?? bare ?? "";
      if (attr.startsWith("on")) handlers += 1;
      if (/^\s*javascript:/i.test(value)) scriptLinks += 1;
      if (["src", "poster", "data"].includes(attr)) loads.push(value);
      if (attr === "srcset") loads.push(...value.split(",").map((part) => part.trim().split(/\s+/)[0]));
      if (attr === "style") loads.push(...cssUrls(value));
      if (attr === "href" && tag === "link" && !/\brel\s*=\s*["']?canonical\b/i.test(attrs)) loads.push(value);
    }
  }
  // The canonical link names the site's address and loads nothing, so it is left out above.
  check(loads.every(own), `${name} loads nothing from another origin`);
  const scripts = [...html.matchAll(/<script\b[^>]*>/gi)].map((m) => m[0]);
  check(scripts.every((tag) => /\btype\s*=\s*["']?application\/ld\+json/i.test(tag)), `${name} runs no script`);
  check(handlers === 0 && scriptLinks === 0, `${name} has no inline handlers and no javascript: links`);
}
check(
  terms.fee.size === 1 && terms.minutes.size === 1,
  `every place states the same fee and the same length for the call (fees: ${[...terms.fee].join(", ") || "none"}; ` +
    `lengths in minutes: ${[...terms.minutes].join(", ") || "none"})`,
);
for (const name of ["tokens.css", "site.css"]) {
  check(cssUrls(readFileSync(name, "utf8")).every(own), `${name} loads nothing from another origin`);
}

if (failures.length) {
  for (const rule of failures) console.error(`Not built, because this does not hold: ${rule}.`);
  process.exit(1);
}

// ---- The images ----------------------------------------------------------------------
// The full mark again, at pixel level: sixteen samples per pixel, blended in linear
// light, on the paper or on nothing. A PNG needs only zlib and a checksum.

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
    `the call stated in ${Object.values(PLACES).flat().length} places as ${[...terms.minutes][0]} minutes for ${[...terms.fee][0]}; ` +
    `contrast, light: ${ratios.light.join(", ")}; dark: ${ratios.dark.join(", ")}; ` +
    `built from commit ${SHA}`,
);

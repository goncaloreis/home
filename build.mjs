// Builds the static site into ./site for Vercel (vercel.json runs `node build.mjs`).
// It copies the page, its styles, fonts and images, and draws the figure in the second
// note from the formula. It refuses to build if any number in the copy disagrees with
// the arithmetic, so the page can never claim what it cannot show.
import { mkdirSync, rmSync, readFileSync, writeFileSync, cpSync } from "node:fs";

const OUT = "site";

// One attempt in ten works. The chance that at least one of n attempts has worked:
const P = 1 / 10;
const odds = (p, n) => 1 - (1 - p) ** n;
const attemptsFor = (p, target) => {
  let n = 1;
  while (odds(p, n) < target) n += 1;
  return n;
};

// What the copy says, checked against the arithmetic.
const claims = [
  ["seven attempts are better than even", attemptsFor(P, 0.5), 7],
  ["twenty-two attempts are nine in ten", attemptsFor(P, 0.9), 22],
  ["forty-four attempts are all but certain (99 in 100)", attemptsFor(P, 0.99), 44],
  ["at one in twenty, the same certainty takes ninety", attemptsFor(1 / 20, 0.99), 90],
];
for (const [claim, computed, written] of claims) {
  if (computed !== written) {
    console.error(`The copy says ${claim}, but the arithmetic gives ${computed}.`);
    process.exit(1);
  }
}

// The figure: one hairline per attempt, its height the chance so far. Three are marked.
const ATTEMPTS = 44;
const MARKED = [7, 22, 44];
const bars = Array.from({ length: ATTEMPTS }, (_, k) => {
  const n = k + 1;
  const x = n - 0.5;
  const top = (100 * (1 - odds(P, n))).toFixed(2);
  const cls = MARKED.includes(n) ? ' class="key"' : "";
  return `<line${cls} x1="${x}" x2="${x}" y1="100" y2="${top}" vector-effect="non-scaling-stroke" shape-rendering="crispEdges"/>`;
}).join("");

const percent = (n) => String(Math.round(odds(P, n) * 100));

function page(file) {
  let html = readFileSync(file, "utf8");
  html = html.replace("<!--bars-->", bars);
  html = html.replace(/\{\{odds:(\d+)\}\}/g, (_, n) => percent(Number(n)));
  if (/\{\{|<!--bars-->/.test(html)) {
    console.error(`${file}: a placeholder was left unfilled.`);
    process.exit(1);
  }
  return html;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const f of ["tokens.css", "site.css", "robots.txt", "sitemap.xml", "og.png", "favicon.png", "apple-touch-icon.png"]) {
  cpSync(f, `${OUT}/${f}`);
}
cpSync("fonts", `${OUT}/fonts`, { recursive: true });
writeFileSync(`${OUT}/index.html`, page("index.html"));
writeFileSync(`${OUT}/404.html`, page("404.html"));

console.log(`built ${OUT}/ (${claims.length} arithmetic checks passed)`);

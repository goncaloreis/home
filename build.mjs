// Builds the static site into ./site for Vercel (vercel.json runs `node build.mjs`).
// It copies the pages, styles, fonts and images, and draws the five figures from their
// formulas. It refuses to build if any number in the copy disagrees with the arithmetic,
// so the page can never claim what it cannot show.
import { mkdirSync, rmSync, readFileSync, writeFileSync, cpSync } from "node:fs";

const OUT = "site";

// The chance that at least one of n attempts has worked, when each works with chance p.
const odds = (p, n) => 1 - (1 - p) ** n;
const attemptsFor = (p, target) => {
  let n = 1;
  while (odds(p, n) < target) n += 1;
  return n;
};
const pct = (x) => Math.round(x * 100);

// What the copy says, checked against the arithmetic. Each entry: claim, holds?
const claims = [
  ["1: twice as able, three attempts, gets there about half the time", Math.abs(odds(1 / 5, 3) - 0.5) < 0.05],
  ["1: keeping going for thirty gets there nineteen times in twenty", odds(1 / 10, 30) >= 0.95],
  ["2: seven attempts are better than even", attemptsFor(1 / 10, 0.5) === 7],
  ["2: forty-four attempts are all but certain (99 in 100)", attemptsFor(1 / 10, 0.99) === 44],
  ["4: at one in ten, nine in ten takes twenty-two attempts", attemptsFor(1 / 10, 0.9) === 22],
  ["4: at one in twenty, the same nine in ten takes forty-five", attemptsFor(1 / 20, 0.9) === 45],
  ["5: five attempts on easy ground (one in five) are enough for two in three", Math.abs(odds(1 / 5, 5) - 2 / 3) < 0.03],
  ["5: five attempts on difficult ground (one in twenty) are enough for fewer than one in four", odds(1 / 20, 5) < 0.25 && odds(1 / 20, 5) > 0.2],
  ["5: whoever keeps going (forty-five attempts) arrives nine times in ten", odds(1 / 20, 45) >= 0.9],
];
for (const [claim, holds] of claims) {
  if (!holds) {
    console.error(`The copy says "${claim}", but the arithmetic does not agree.`);
    process.exit(1);
  }
}

// The figures. A stroke is one attempt; its height is the chance that one has worked by then.
// A copied attempt adds no new chance, so its strokes stay at p.
const figures = {
  stay: {
    slots: 30,
    bands: [
      { title: "Twice as able, stops after three", p: 1 / 5, n: 3, marks: [3] },
      { title: "Half as able, keeps going", p: 1 / 10, n: 30, marks: [30] },
    ],
  },
  again: {
    slots: 44,
    tall: true,
    bands: [{ title: "One attempt in ten works", p: 1 / 10, n: 44, marks: [7, 22, 44] }],
  },
  copy: {
    slots: 22,
    bands: [
      { title: "Worked out again each time", p: 1 / 10, n: 22, marks: [22] },
      { title: "The same attempt, repeated", p: 1 / 10, n: 22, copies: true, marks: [22] },
    ],
  },
  corners: {
    slots: 45,
    bands: [
      { title: "Done properly: one in ten", p: 1 / 10, n: 22, marks: [22] },
      { title: "Corners cut: one in twenty", p: 1 / 20, n: 45, marks: [45] },
    ],
  },
  ground: {
    slots: 45,
    bands: [
      { title: "Easy ground: one in five", p: 1 / 5, n: 45, marks: [5] },
      { title: "Difficult ground: one in twenty", p: 1 / 20, n: 45, marks: [5, 45] },
    ],
  },
  // The first screen: line 2 at work, under the five lines.
  hero: {
    slots: 44,
    hero: true,
    bands: [{ title: "Forty-four attempts at one in ten each", p: 1 / 10, n: 44, marks: [44] }],
  },
};

const chance = (band, n) => (band.copies ? band.p : odds(band.p, n));
const css = [];

function heroFigure(id, f) {
  const b = f.bands[0];
  const lines = Array.from({ length: b.n }, (_, k) => {
    const n = k + 1;
    const top = (100 * (1 - chance(b, n))).toFixed(2);
    const key = b.marks.includes(n) ? ' class="key"' : "";
    return `<line${key} x1="${n - 0.5}" x2="${n - 0.5}" y1="100" y2="${top}" vector-effect="non-scaling-stroke" shape-rendering="crispEdges"/>`;
  }).join("");
  const last = b.marks[b.marks.length - 1];
  const summary = `${b.title}: the chance that one has worked rises to ${pct(chance(b, last))}%.`;
  return `<figure class="fig fig-${id} hero-fig"><div class="bands" role="img" aria-label="${summary}"><span class="plot"><svg class="strokes" viewBox="0 0 ${f.slots} 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">${lines}</svg></span></div><figcaption class="hero-label">Each stroke is one attempt; its height is the chance that one has worked by then, and the dotted line is certainty. At one in ten, ${last} attempts reach ${pct(chance(b, last))}%.</figcaption></figure>`;
}

function figure(id) {
  const f = figures[id];
  if (f.hero) return heroFigure(id, f);
  const summary = f.bands
    .map((b) => `${b.title}. ${b.marks.map((m, i) => `${pct(chance(b, m))}% after ${m}${i === 0 ? " attempts" : ""}`).join(", ")}.`)
    .join(" ");
  const bands = f.bands.map((b, bi) => {
    const lines = Array.from({ length: b.n }, (_, k) => {
      const n = k + 1;
      const x = n - 0.5;
      const top = (100 * (1 - chance(b, n))).toFixed(2);
      const key = b.marks.includes(n) ? ' class="key"' : "";
      return `<line${key} x1="${x}" x2="${x}" y1="100" y2="${top}" vector-effect="non-scaling-stroke" shape-rendering="crispEdges"/>`;
    }).join("");
    const ticks = b.marks.map((m, mi) => {
      const x = ((m - 0.5) / f.slots) * 100;
      const align = x < 15 ? "start" : x > 85 ? "end" : "mid";
      const sel = `.fig-${id} .b${bi + 1} .t${mi + 1}`;
      css.push(align === "end" ? `${sel} { right: ${(100 - x).toFixed(3)}%; }` : `${sel} { left: ${x.toFixed(3)}%; }`);
      const last = mi === b.marks.length - 1;
      return `<span class="tick ${align} t${mi + 1}">${m}${last ? " attempts" : ""}<span class="pct">${pct(chance(b, m))}%</span></span>`;
    }).join("");
    return `<div class="band b${bi + 1}"><span class="band-title">${b.title}</span><span class="plot"><svg class="strokes" viewBox="0 0 ${f.slots} 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">${lines}</svg></span><span class="ticks">${ticks}</span></div>`;
  }).join("");
  const dense = f.slots > 60 ? " dense" : "";
  const tall = f.tall ? " tall" : "";
  const rows = Array.from({ length: Math.max(...f.bands.map((b) => b.n)) }, (_, k) => {
    const n = k + 1;
    return `<tr><th scope="row">${n}</th>${f.bands.map((b) => `<td>${n <= b.n ? `${pct(chance(b, n))}%` : ""}</td>`).join("")}</tr>`;
  }).join("");
  const table = `<details class="values"><summary>Every attempt, in numbers</summary><table><thead><tr><th scope="col">Attempt</th>${f.bands.map((b) => `<th scope="col">${b.title}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></details>`;
  return `<figure class="fig fig-${id}${dense}${tall}"><div class="bands" role="img" aria-label="${summary}">${bands}</div>${table}</figure>`;
}

function page(file) {
  let html = readFileSync(file, "utf8");
  html = html.replace(/<!--figure:([a-z]+)-->/g, (_, id) => {
    if (!figures[id]) {
      console.error(`${file}: no figure called ${id}.`);
      process.exit(1);
    }
    return figure(id);
  });
  if (/\{\{|<!--figure:/.test(html)) {
    console.error(`${file}: a placeholder was left unfilled.`);
    process.exit(1);
  }
  return html;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const f of ["tokens.css", "robots.txt", "sitemap.xml", "og.png", "favicon.png", "apple-touch-icon.png"]) {
  cpSync(f, `${OUT}/${f}`);
}
cpSync("fonts", `${OUT}/fonts`, { recursive: true });
const index = page("index.html");
writeFileSync(`${OUT}/index.html`, index);
writeFileSync(`${OUT}/404.html`, page("404.html"));
// Figure label positions are computed with the strokes, so they are written with them.
writeFileSync(`${OUT}/site.css`, `${readFileSync("site.css", "utf8")}\n/* Figure labels, placed at their strokes by build.mjs. */\n${css.join("\n")}\n`);

console.log(`built ${OUT}/ (${claims.length} arithmetic checks passed, ${Object.keys(figures).length} figures)`);

// Build step for Vercel: copies the static site into ./site and fills
// values that must not live in the repository.
// - OFFER_PRICE (for example a currency and amount) fills {{OFFER_PRICE}}.
//   It is set in the Vercel project environment, never committed.
//   A production build fails if it is missing. A preview or local build
//   shows a placeholder that is not a price.
import { mkdirSync, rmSync, readFileSync, writeFileSync, cpSync } from "node:fs";

const OUT = "site";
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const f of ["styles.css", "tokens.css", "robots.txt", "sitemap.xml"]) cpSync(f, `${OUT}/${f}`);
cpSync("fonts", `${OUT}/fonts`, { recursive: true });

let html = readFileSync("index.html", "utf8");
const price = (process.env.OFFER_PRICE || "").trim();
const vercelEnv = (process.env.VERCEL_ENV || "").trim();
if (!price && vercelEnv === "production") {
  console.error("OFFER_PRICE is required for a production build.");
  process.exit(1);
}
html = html.replaceAll("{{OFFER_PRICE}}", price ? esc(price) : "[price set at deploy]");

writeFileSync(`${OUT}/index.html`, html);
console.log(`built ${OUT}/ (price ${price ? "set" : "missing"}, env ${vercelEnv || "local"})`);

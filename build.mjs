// Build step for Vercel: copies the static site into ./site and fills
// values that must not live in the repository.
// - OFFER_PRICE (for example a currency and amount) fills {{OFFER_PRICE}}.
//   It is set in the Vercel project environment, never committed.
// - HERO_VARIANT ("a" or "b") swaps in one of Growth's alternative first
//   screens kept as <template> blocks in index.html. Unset means the
//   recommended option.
import { mkdirSync, rmSync, readFileSync, writeFileSync, cpSync } from "node:fs";

const OUT = "site";
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const f of ["styles.css", "tokens.css", "robots.txt", "sitemap.xml"]) cpSync(f, `${OUT}/${f}`);
cpSync("fonts", `${OUT}/fonts`, { recursive: true });

let html = readFileSync("index.html", "utf8");
const price = (process.env.OFFER_PRICE || "").trim();
html = html.replaceAll("{{OFFER_PRICE}}", price ? esc(price) : "[price set at deploy]");

const variant = (process.env.HERO_VARIANT || "").trim().toLowerCase();
if (variant === "a" || variant === "b") {
  const tpl = html.match(new RegExp(`<template data-hero-variant="${variant}">([\\s\\S]*?)</template>`));
  if (tpl) {
    html = html.replace(/(<section class="hero"[^>]*>\s*<div class="wrap">)[\s\S]*?(<p class="hero-action">)/, `$1${tpl[1].replace("<h1>", '<h1 id="hero-h">')}$2`);
    html = html.replace('data-hero-variant="recommended"', `data-hero-variant="${variant}"`);
  }
}

writeFileSync(`${OUT}/index.html`, html);
console.log(`built ${OUT}/ (price ${price ? "set" : "missing"}, hero ${variant || "recommended"})`);

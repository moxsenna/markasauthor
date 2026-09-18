import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
};

const html = readFileSync(resolve(ROOT, "majarani-shelf.html"), "utf8");
const books = JSON.parse(readFileSync(resolve(ROOT, "majarani-generated-books.json"), "utf8"));

const rootBlock = (html.match(/:root\s*{([^}]*)}/) || [])[1] || "";
const varOf = (name) => {
  const m = rootBlock.match(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*:\\s*([^;]+);"));
  return m ? m[1].trim().toLowerCase() : null;
};

ok(varOf("--paper") === "#fbf6ef", `default --paper must be #FBF6EF, got ${varOf("--paper")}`);
ok(varOf("--ink") === "#3b2a28", `default --ink must be #3B2A28, got ${varOf("--ink")}`);
ok(varOf("--paper-deep") === "#f1e2d6", `default --paper-deep must be #F1E2D6, got ${varOf("--paper-deep")}`);

const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
};

ok(books.length === 75, `expected 75 book palettes, got ${books.length}`);
let darkPaper = 0;
let lightInk = 0;
for (const b of books) {
  if (lum(b.palette.paper) < 0.6) darkPaper++;
  if (lum(b.palette.ink) > 0.12) lightInk++;
}
ok(darkPaper === 0, `${darkPaper} book palettes still have dark paper`);
ok(lightInk === 0, `${lightInk} book palettes still have light ink`);

if (failures.length) {
  for (const f of failures) console.log(`FAIL: ${f}`);
  process.exit(1);
}
console.log("theme verification passed");

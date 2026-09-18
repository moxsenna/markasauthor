import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
};

const html = readFileSync(resolve(ROOT, "majarani-shelf.html"), "utf8");

ok(html.includes('name="viewport"'), "viewport meta tag must be present");
ok(html.includes("configureResponsiveTargets"), "responsive target configuration must be present");
const mediaCount = (html.match(/@media[^{]*max-width:\s*\d+px/g) || []).length;
ok(mediaCount >= 2, `expected >=2 max-width media queries, got ${mediaCount}`);
ok(/max-width:\s*720px|max-width:\s*760px|max-width:\s*640px/.test(html),
  "a small-screen (<=760px) breakpoint must exist");

if (failures.length) {
  for (const f of failures) console.log(`FAIL: ${f}`);
  process.exit(1);
}
console.log("responsive verification passed");

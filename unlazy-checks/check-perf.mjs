import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
};

const html = readFileSync(resolve(ROOT, "majarani-shelf.html"), "utf8");

const coverSize = html.match(/canvasTexture\.width = (\d+);\s*canvasTexture\.height = (\d+);/);
ok(coverSize && +coverSize[1] <= 512 && +coverSize[2] <= 768,
  `cover texture must be <=512x768, got ${coverSize ? `${coverSize[1]}x${coverSize[2]}` : "none"}`);

const foilSize = html.match(/foilCanvas\.width = (\d+);\s*foilCanvas\.height = (\d+);/);
ok(foilSize && +foilSize[1] <= 512 && +foilSize[2] <= 768,
  `foil texture must be <=512x768, got ${foilSize ? `${foilSize[1]}x${foilSize[2]}` : "none"}`);

const spineSizes = [...html.matchAll(/spineCanvas\.width = (\d+);\s*spineCanvas\.height = (\d+);/g)];
ok(spineSizes.length > 0 && spineSizes.every((m) => +m[1] <= 256 && +m[2] <= 1024),
  `spine textures must be <=256x1024, got ${spineSizes.map((m) => `${m[1]}x${m[2]}`).join(",") || "none"}`);

const spineFoilSizes = [...html.matchAll(/foilCanvas\.width = 384;\s*foilCanvas\.height = 1536;/g)];
ok(spineFoilSizes.length === 0, "spine foil must no longer be 384x1536");

const paperSizes = [...html.matchAll(/paperCanvas\.width = (\d+);\s*paperCanvas\.height = (\d+);/g)];
ok(paperSizes.length > 0 && paperSizes.every((m) => +m[1] <= 384 && +m[2] <= 576),
  `interior paper textures must be <=384x576, got ${paperSizes.map((m) => `${m[1]}x${m[2]}`).join(",") || "none"}`);

const fiberLoop = html.match(/for \(let fiber = 0; fiber < (\d+);/);
ok(fiberLoop && +fiberLoop[1] <= 800,
  `paper fiber loop must be <=800 iterations, got ${fiberLoop ? fiberLoop[1] : "none"}`);

ok(html.includes("pumpBackgroundQueue") || html.includes("backgroundQueue"),
  "background covers must load in idle batches, not all at once");

const grainLoop = html.match(/for \(let line = 0; line < (\d+);/);
ok(grainLoop && +grainLoop[1] <= 600,
  `cover grain loop must be <=600 iterations, got ${grainLoop ? grainLoop[1] : "none"}`);

const threadLoop = html.match(/for \(let thread = 0; thread < (\d+);/);
ok(threadLoop && +threadLoop[1] <= 800,
  `spine thread loop must be <=800 iterations, got ${threadLoop ? threadLoop[1] : "none"}`);

ok(!html.includes("resolve(0), 9000)"),
  "old 9s full-cover blocking wait must be gone (progressive loading required)");
ok(html.includes("VISIBLE_COVER_COUNT") || html.includes("visibleCoverIds"),
  "visible-set cover gating marker must be present");
ok(html.includes("coverUpgrades") || html.includes("pendingCover"),
  "async cover-upgrade registry must be present");

ok(html.includes("function ensureRig(index)"),
  "lazy rig builder must be present");
ok(!html.includes("bookRigs = BOOKS.map((book, index) => {"),
  "eager 75-rig build must be gone (lazy rigs required)");
ok(html.includes("if (!rig) return;") || html.includes("if (!rig) {"),
  "rig loops must guard unbuilt rigs");

ok(html.includes("renderer.setPixelRatio"), "renderer pixel-ratio cap must be present");
ok(html.includes("? 1.25 : 1.75"), "pixel-ratio cap must be tightened to 1.25 mobile / 1.75 desktop");
ok(/antialias:\s*!/.test(html) || /antialias:\s*is[A-Za-z]*/.test(html),
  "antialias must be conditional (off on mobile)");

if (failures.length) {
  for (const f of failures) console.log(`FAIL: ${f}`);
  process.exit(1);
}
console.log("perf verification passed");

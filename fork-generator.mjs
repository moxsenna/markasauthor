import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = "D:/Coding/markasauthor";
const src = readFileSync(resolve(ROOT, "complete-shelf-v2.html"), "utf8");
const rawData = JSON.parse(readFileSync(resolve(ROOT, "majarani-generated-books.json"), "utf8"));

const hasUsableCover = (b) => {
  if (!b.coverPath || /default_cover|default_user|placeholder|no-cover|noimage/i.test(b.coverPath)) return false;
  const local = resolve(ROOT, b.coverPath.replace(/^\.\//, ""));
  try {
    return existsSync(local) && statSync(local).size > 8000;
  } catch {
    return false;
  }
};
const data = rawData.filter(hasUsableCover);
console.log(`books with usable covers: ${data.length} / ${rawData.length}`);

const js = (v) => JSON.stringify(v);
const clampText = (s, n) => {
  if (!s) return "";
  s = s.replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
};

const bookLiteral = (b, i) => `      {
        id: ${js(b.id)},
        title: ${js(b.title)},
        roman: ${js(String(i + 1))},
        discipline: ${js("Novel KBM")},
        note: ${js(clampText(b.synopsis, 90) || "Karya Majarani di KBM")},
        deck: ${js(clampText(b.synopsis, 320) || "Cerita dari Majarani, penulis KBM.")},
        binding: ${js("KBM App · Novel")},
        format: ${js(b.chaptersCount ? `${b.chaptersCount} bab` : "Cerbung")},
        theme: ${js(clampText(b.synopsis, 90) || "Novel Majarani")},
        motif: ${js(b.motifKey)},
        motifKey: ${js(b.motifKey)},
        paletteLabel: ${js(`${b.chaptersCount || "?"} bab`)},
        color: ${js(b.color)},
        foil: ${js(b.foil)},
        palette: {
          paper: ${js(b.palette.paper)},
          paperDeep: ${js(b.palette.paperDeep)},
          paperPale: ${js(b.palette.paperPale)},
          ink: ${js(b.palette.ink)},
          inkSoft: ${js(b.palette.inkSoft)},
          wall: ${js(b.palette.wall)},
          shelf: ${js(b.palette.shelf)},
          shelfDark: ${js(b.palette.shelfDark)},
          light: ${js(b.palette.light)},
          fill: ${js(b.palette.fill)}
        },
        width: 1.02,
        height: 1.55,
        depth: 0.26,
        chapters: ["Bab", "Alur", "Epilog"],
        seed: ${b.seed},
        coverPath: ${js(b.coverPath)}
      }`;

const BOOKS_JS = `const BOOKS = [
${data.map(bookLiteral).join(",\n")}
    ];`;

const bi = src.indexOf("const BOOKS = [");
const be = src.indexOf("\n    ];", bi) + "\n    ];".length;
if (bi < 0 || be < 8) throw new Error("BOOKS block not found");
let out = src.slice(0, bi) + BOOKS_JS + src.slice(be);

const atlasRe = /const COVER_ATLAS_DATA = "data:image\/webp;base64,[^"]+";/;
if (!atlasRe.test(out)) throw new Error("COVER_ATLAS_DATA not found");
out = out.replace(atlasRe, 'const COVER_ATLAS_DATA = "";');

const marker = "    function makeCoverTexture(book) {";
if (!out.includes(marker)) throw new Error("makeCoverTexture marker not found");
const coverHelper = `    const coverImages = new Map();
    const coverUpgrades = new Map();
    const VISIBLE_COVER_COUNT = 7;

    function visibleCoverIds() {
      const ids = [];
      for (let k = 0; k < VISIBLE_COVER_COUNT; k += 1) {
        ids.push(BOOKS[(BOOKS.length - 3 + k) % BOOKS.length].id);
      }
      return ids;
    }

    function drawRealCover(ctx, image, width, height) {
      ctx.drawImage(image, 0, 0, width, height);
      const edgeShade = ctx.createLinearGradient(0, 0, width, 0);
      edgeShade.addColorStop(0, "rgba(0,0,0,0.16)");
      edgeShade.addColorStop(0.055, "rgba(255,255,255,0.015)");
      edgeShade.addColorStop(0.93, "rgba(255,255,255,0)");
      edgeShade.addColorStop(1, "rgba(0,0,0,0.1)");
      ctx.fillStyle = edgeShade;
      ctx.fillRect(0, 0, width, height);
    }

    function upgradeCover(bookId) {
      const entry = coverUpgrades.get(bookId);
      const image = coverImages.get(bookId);
      if (!entry || !image || !image.complete || !image.naturalWidth) return;
      coverUpgrades.delete(bookId);
      drawRealCover(entry.ctx, image, entry.canvas.width, entry.canvas.height);
      entry.texture.needsUpdate = true;
      if (entry.foil) {
        const foilCtx = entry.foil.canvas.getContext("2d");
        foilCtx.clearRect(0, 0, entry.foil.canvas.width, entry.foil.canvas.height);
        entry.foil.texture.needsUpdate = true;
      }
      requestFrame();
    }

    function preloadCovers() {
      const visible = new Set(visibleCoverIds());
      const loadOne = (book) => {
        const image = new Image();
        image.decoding = "async";
        image.src = book.coverPath;
        coverImages.set(book.id, image);
        return image.decode().then(
          () => {
            upgradeCover(book.id);
            return true;
          },
          () => {
            coverImages.delete(book.id);
            return false;
          }
        );
      };
      const visibleReady = Promise.all(
        BOOKS.filter((book) => visible.has(book.id)).map(loadOne)
      );
      const backgroundQueue = BOOKS.filter((book) => !visible.has(book.id));
      const pumpBackgroundQueue = () => {
        const batch = backgroundQueue.splice(0, 6);
        batch.forEach((book) => {
          loadOne(book).catch(() => {});
        });
        if (backgroundQueue.length > 0) {
          if (typeof requestIdleCallback === "function") {
            requestIdleCallback(pumpBackgroundQueue, { timeout: 2000 });
          } else {
            setTimeout(pumpBackgroundQueue, 120);
          }
        }
      };
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(pumpBackgroundQueue, { timeout: 3000 });
      } else {
        setTimeout(pumpBackgroundQueue, 300);
      }
      return visibleReady;
    }

    function makeCoverTexture(book) {`;
out = out.replace(marker, coverHelper);

const atlasBranchStart = out.indexOf("if (coverAtlasReady) {", out.indexOf("function makeCoverTexture"));
if (atlasBranchStart < 0) throw new Error("coverAtlasReady branch not found");
const realCoverBranch = `const pendingCover = coverImages.get(book.id);
      if (pendingCover && pendingCover.complete && pendingCover.naturalWidth) {
        drawRealCover(ctx, pendingCover, canvasTexture.width, canvasTexture.height);
        return configureCanvasTexture(new THREE.CanvasTexture(canvasTexture));
      }

      `;
out = out.slice(0, atlasBranchStart) + realCoverBranch + out.slice(atlasBranchStart);

const coverReturnMarker = "      ctx.fillText(book.discipline.toUpperCase(), canvasTexture.width / 2, canvasTexture.height * 0.79);";
if (!out.includes(coverReturnMarker)) throw new Error("cover return marker not found");
out = out.replace(
  coverReturnMarker,
  `${coverReturnMarker}
      const coverTexture = configureCanvasTexture(new THREE.CanvasTexture(canvasTexture));
      if (pendingCover) {
        coverUpgrades.set(book.id, { canvas: canvasTexture, ctx, texture: coverTexture });
      }
      return coverTexture;`
);
out = out.replace(
  "      return configureCanvasTexture(new THREE.CanvasTexture(canvasTexture));\n    }\n\n    function makeFoilTexture",
  "    }\n\n    function makeFoilTexture"
);

const initMarker = "      const woodTexturePromise = woodTextureImage.decode().then(";
if (!out.includes(initMarker)) throw new Error("initialize marker not found");
out = out.replace(
  initMarker,
  `      try { await Promise.race([preloadCovers(), new Promise((resolve) => setTimeout(() => resolve(0), 4000))]); } catch (error) {}
      const woodTexturePromise = woodTextureImage.decode().then(`
);

out = out.replace(
  "      const titleSize = book.title.length > 10 ? 72 : 88;\n      ctx.font = `400 ${titleSize}px \"Iowan Old Style\", Baskerville, Georgia, serif`;\n      ctx.fillText(book.title, canvasTexture.width / 2, canvasTexture.height * 0.72);",
  "      const titleSize = book.title.length > 10 ? 58 : 76;\n      ctx.font = `400 ${titleSize}px \"Iowan Old Style\", Baskerville, Georgia, serif`;\n      ctx.textAlign = \"center\";\n      drawWrappedCanvasText(ctx, book.title, canvasTexture.width / 2, canvasTexture.height * 0.62, 16, titleSize * 1.12, 4);"
);

out = out.replace(
  "      ctx.save();\n      ctx.translate(foilCanvas.width * 0.5, foilCanvas.height * 0.5);\n      ctx.rotate(Math.PI / 2);\n      ctx.font = `400 ${book.title.length > 10 ? 58 : 68}px \"Iowan Old Style\", Baskerville, Georgia, serif`;\n      ctx.letterSpacing = \"0px\";\n      ctx.fillText(book.title, 0, 0);\n      ctx.restore();",
  "      ctx.save();\n      ctx.translate(foilCanvas.width * 0.5, foilCanvas.height * 0.5);\n      ctx.rotate(Math.PI / 2);\n      const spineTitleSize = book.title.length > 24 ? 34 : book.title.length > 10 ? 58 : 68;\n      ctx.font = `400 ${spineTitleSize}px \"Iowan Old Style\", Baskerville, Georgia, serif`;\n      ctx.letterSpacing = \"0px\";\n      const spineText = book.title.length > 24 ? book.title.slice(0, 23) + \"…\" : book.title;\n      ctx.fillText(spineText, 0, 0);\n      ctx.restore();"
);

out = out.replace(
  "<title>Working Volumes — Seven Tools for Making</title>",
  "<title>Majarani — 75 Karya Pilihan</title>"
);
out = out.replace(
  /<strong>Working Volumes<\/strong>\s*<span>Seven field guides for making<\/span>/,
  '<strong>Majarani</strong> <span>' + data.length + ' karya pilihan · KBM</span>'
);
out = out.replace(
  /Edition 02[^\d<]{1,5}2026/,
  'Koleksi 2026'
);
out = out.replace(
  /Working Volumes[^\w<]{1,5}Static catalog/,
  'Majarani · Katalog statis'
);
out = out.replace(
  /<h2 id="fallback-title">Seven tools for making\.<\/h2>/,
  '<h2 id="fallback-title">75 karya pilihan Majarani.</h2>'
);
out = out.replace(
  'content="Working Volumes is an original interactive Three.js library of seven tactile field guides for contemporary creative tools."',
  'content="Showcase interaktif 75 karya Majarani — penulis KBM."'
);
out = out.replace(
  "ctx.fillText(`WORKING VOLUMES  /  ${book.roman}`,",
  "ctx.fillText(`MAJARANI  /  ${book.roman}`,"
);
out = out.replace(
  "`${book.binding}. ${book.format}. Conceived as an original editorial study for Working Volumes.`",
  "`${book.binding}. ${book.format}. Karya asli Majarani di KBM.`"
);

const slim = (from, to) => {
  if (!out.includes(from)) throw new Error(`slim marker not found: ${from.slice(0, 60)}`);
  out = out.split(from).join(to);
};

slim("canvasTexture.width = 768;\n      canvasTexture.height = 1152;", "canvasTexture.width = 512;\n      canvasTexture.height = 768;");
slim("foilCanvas.width = 768;\n      foilCanvas.height = 1152;", "foilCanvas.width = 512;\n      foilCanvas.height = 768;");
slim("backCanvas.width = 768;\n      backCanvas.height = 1152;", "backCanvas.width = 512;\n      backCanvas.height = 768;");
slim("spineCanvas.width = 384;\n      spineCanvas.height = 1536;", "spineCanvas.width = 256;\n      spineCanvas.height = 1024;");
slim("foilCanvas.width = 384;\n      foilCanvas.height = 1536;", "foilCanvas.width = 256;\n      foilCanvas.height = 1024;");
slim("paperCanvas.width = 768;\n      paperCanvas.height = 1152;", "paperCanvas.width = 384;\n      paperCanvas.height = 576;");
slim("for (let fiber = 0; fiber < 2400;", "for (let fiber = 0; fiber < 800;");
slim("for (let line = 0; line < 1250; line += 1) {", "for (let line = 0; line < 500; line += 1) {");
slim("for (let thread = 0; thread < 1900; thread += 1) {", "for (let thread = 0; thread < 700; thread += 1) {");
slim("viewWidth < 820 ? 1.5 : 2", "viewWidth < 820 ? 1.25 : 1.75");
slim("antialias: true,", "antialias: !window.matchMedia(\"(pointer: coarse)\").matches,");

const foilHeadMarker = "ctx.fillText(`WORKING VOLUMES  /  ${pad(index)}`, 58, 70);";
const foilTailMarker = "ctx.fillText(book.discipline.toUpperCase(), 60, 1066);";
if (!out.includes(foilHeadMarker)) throw new Error("foil header marker not found");
if (!out.includes(foilTailMarker)) throw new Error("foil tail marker not found");
{
  const headIdx = out.indexOf(foilHeadMarker);
  const tailIdx = out.indexOf(foilTailMarker) + foilTailMarker.length;
  const foilTextBlock = out.slice(headIdx, tailIdx);
  const wrappedFoilText = `const foilRealCover = coverImages.get(book.id);
      const foilHasReal = foilRealCover && foilRealCover.complete && foilRealCover.naturalWidth;
      if (!foilHasReal) {
        ${foilTextBlock.replace("ctx.fillText(`WORKING VOLUMES  /  ${pad(index)}`, 58, 70);", "ctx.fillText(`MAJARANI / ${pad(index)}`, 58, 70);")}
      }`;
  out = out.slice(0, headIdx) + wrappedFoilText + out.slice(tailIdx);
}
out = out.replace(
  "return configureCanvasTexture(new THREE.CanvasTexture(foilCanvas));",
  `const foilTexture = configureCanvasTexture(new THREE.CanvasTexture(foilCanvas));
      const foilUpgradeEntry = coverUpgrades.get(book.id);
      if (foilUpgradeEntry) foilUpgradeEntry.foil = { canvas: foilCanvas, texture: foilTexture };
      return foilTexture;`
);

slim("--paper: #171a24;", "--paper: #FBF6EF;");
slim("--paper-deep: #10131b;", "--paper-deep: #F1E2D6;");
slim("--paper-pale: #f1eadf;", "--paper-pale: #FFFDF9;");
slim("--ink: #f4eee6;", "--ink: #3B2A28;");
slim("--ink-soft: #b9b4ae;", "--ink-soft: #7A5A50;");
slim("--accent: #c87046;", "--accent: #7A3341;");
slim('<meta name="theme-color" content="#171a24">', '<meta name="theme-color" content="#FBF6EF">');

const lazyBuildBlock = `      bookRigs = new Array(BOOKS.length).fill(null);
      for (let k = -4; k <= 6; k += 1) ensureRig(k);`;
if (!out.includes("      bookRigs = BOOKS.map((book, index) => {")) throw new Error("rig build block not found");
out = out.replace("      bookRigs = BOOKS.map((book, index) => {\n        const rig = createBookRig(book, index);\n        shelfStage.add(rig.root);\n        return rig;\n      });", lazyBuildBlock);

const shelfLayoutMarker = "    function updateShelfLayout(delta, elapsed) {";
if (!out.includes(shelfLayoutMarker)) throw new Error("updateShelfLayout marker not found");
out = out.replace(
  shelfLayoutMarker,
  `    function ensureRig(index) {
        const safe = mod(index, BOOKS.length);
        if (bookRigs[safe]) return bookRigs[safe];
        const rig = createBookRig(BOOKS[safe], safe);
        shelfStage.add(rig.root);
        bookRigs[safe] = rig;
        snapRigToShelfSlot(rig, safe);
        return rig;
      }

    ${shelfLayoutMarker}`
);

if (!out.includes("      bookRigs.forEach((rig, index) => {\n        if (rig.root.parent !== shelfStage) return;\n\n        let offset = index - position;")) throw new Error("shelf layout loop not found");
out = out.replace(
  "      bookRigs.forEach((rig, index) => {\n        if (rig.root.parent !== shelfStage) return;\n\n        let offset = index - position;",
  `      bookRigs.forEach((rig, index) => {
        if (!rig) {
          let ahead = index - position;
          ahead -= Math.round(ahead / BOOKS.length) * BOOKS.length;
          if (Math.abs(ahead) <= 3.5) ensureRig(index);
          return;
        }
        if (rig.root.parent !== shelfStage) return;

        let offset = index - position;`
);

if (!out.includes("bookRigs.forEach((rig, index) => {\n        if (rig !== activeBook && rig.root.parent === shelfStage) {")) throw new Error("snap loop not found");
out = out.replace(
  "bookRigs.forEach((rig, index) => {\n        if (rig !== activeBook && rig.root.parent === shelfStage) {",
  "bookRigs.forEach((rig, index) => {\n        if (!rig) return;\n        if (rig !== activeBook && rig.root.parent === shelfStage) {"
);

if (!out.includes("activeBook = bookRigs[selectedIndex];\n      activeBook.contactShadow.visible = false;")) throw new Error("openDetail assignment not found");
out = out.replace(
  "activeBook = bookRigs[selectedIndex];\n      activeBook.contactShadow.visible = false;",
  "ensureRig(selectedIndex); activeBook = bookRigs[selectedIndex];\n      activeBook.contactShadow.visible = false;"
);

slim(
  "@media (max-width: 560px) {",
  `@media (max-width: 560px) {
      .browse-actions { gap: 4px; }
      .round-button { width: 32px; height: 32px; }
      .text-button { min-height: 32px; padding: 0 12px; font-size: 0.6rem; }
      .markers { overflow-x: auto; max-width: 100%; scrollbar-width: none; }
      .markers::-webkit-scrollbar { display: none; }
      .marker { flex-shrink: 0; }
      .index-nav { min-width: 0; overflow: hidden; }
      .browse-ui { grid-template-columns: minmax(0, 1fr) auto; row-gap: 10px; }
      .index-nav { grid-column: 1 / -1; grid-row: 2; }`
);

slim("ctx.fillText(`WORKING VOLUMES  /  ${book.roman}`, 68, 82);", "ctx.fillText(`MAJARANI / ${book.roman}`, 68, 82);");
{
  const plMarker = '<strong id="pointer-label-title">Codex</strong>';
  if (!out.includes(plMarker)) throw new Error("pointer label marker not found");
  out = out.replace(plMarker, `<strong id="pointer-label-title">${data[0].Title}</strong>`);
}

writeFileSync(resolve(ROOT, "majarani-shelf.html"), out, "utf8");
console.log(`forked -> majarani-shelf.html (${data.length} books)`);

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = "D:/Coding/markasauthor";
const TEMP = "C:/Users/bimap/AppData/Local/Temp/opencode";
const stripBom = (s) => s.replace(/^\uFEFF/, "");
const books = JSON.parse(stripBom(readFileSync(resolve(ROOT, "majarani-books.json"), "utf8")));

const out = [];
for (const b of books) {
  const slug = b.Link.split("/").pop();
  const file = resolve(TEMP, "kbm-details", `${slug}.html`);
  if (!existsSync(file)) {
    out.push({ Title: b.Title, Cover: b.Cover, Link: b.Link, Synopsis: "", Genre: "", Chapters: 0 });
    continue;
  }
  const d = readFileSync(file, "utf8");
  const title = ((d.match(/<title>([^<]+)<\/title>/) || [])[1] || b.Title).replace(/\s*-\s*Majarani\s*$/, "").trim();
  let syn = "";
  const si = d.indexOf('id="Sinopsis"');
  if (si >= 0) {
    const w = d.slice(si, si + 6000);
    const paras = [...w.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
      .map((m) => m[1].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").trim())
      .filter((p) => p.length > 20);
    syn = paras.join(" ");
    if (syn.length > 600) syn = syn.slice(0, 599).trimEnd() + "…";
  }
  const chm = d.match(/(\d+)\s*(?:Bab|Chapter|BAB)/);
  out.push({ Title: title, Cover: b.Cover, Link: b.Link, Synopsis: syn, Genre: "", Chapters: chm ? +chm[1] : 0 });
}
writeFileSync(resolve(TEMP, "majarani-books-rich.json"), JSON.stringify(out, null, 1), "utf8");
console.log(`enriched ${out.length} books`);
const broken = out.filter((b) => /�/.test(b.Synopsis)).length;
console.log(`synopses with replacement chars: ${broken}`);

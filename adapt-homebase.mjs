import { readFileSync, writeFileSync } from "node:fs";

const P = "D:/Coding/markasauthor/author-homebase-ratna-maharani/project/Author Homebase - Ratna Maharani.dc.html";
let h = readFileSync(P, "utf8");
const R = (from, to) => {
  if (!h.includes(from)) throw new Error("MISS: " + from.slice(0, 70));
  h = h.split(from).join(to);
};

R(
  '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">',
  `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<title>Majarani — Author Homebase</title>`
);
R(">Ratna Maharani</a>", ">Majarani</a>");
R(
  `<div style="width:100%;height:100%;border-radius:50%;background:repeating-linear-gradient(45deg,#EBD8D2 0 8px,#F4E7E2 8px 16px);display:flex;align-items:center;justify-content:center">
        <span style="font-family:ui-monospace,Menlo,monospace;font-size:10px;color:#8A6A5E">foto penulis</span>
      </div>`,
  `<img src="uploads/majarani-avatar.webp" alt="Foto Majarani" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block">`
);
R(
  `<h1 style="margin:0 0 8px;font-family:'Playfair Display',serif;font-size:36px;font-weight:600;line-height:1.15;color:#3B2A28">Ratna Maharani</h1>`,
  `<h1 style="margin:0 0 8px;font-family:'Playfair Display',serif;font-size:36px;font-weight:600;line-height:1.15;color:#3B2A28">Majarani</h1>`
);
R("Penulis romance keluarga &amp; rumah tangga", "Penulis drama rumah tangga, roman &amp; misteri");
R("<span>Penulis Terlaris KBM App 2024</span>", "<span>Emerald · No. 1 Fortune 500 KBM App</span>");
R(
  "Menulis kisah rumah tangga yang dekat dengan hidup kita — tentang cinta, luka, dan perempuan yang memilih bertahan atau pergi. Lebih dari 32 juta kali dibaca di KBM App.",
  "Akrab disapa Maja, ia menulis di KBM App sejak 2020 — 75 karya drama rumah tangga, roman, dan misteri. “Misteri IUD di Rahim Hana” memecahkan rekor pendapatan Rp66 juta dalam sebulan."
);

R("BARU TERBIT</span>", "SOROTAN KARYA</span>");
R('<span style="margin-left:auto;font-size:12px;color:#9A8078">3 Juli 2026</span>', '<span style="margin-left:auto;font-size:12px;color:#9A8078">100 bab</span>');
R("Istri Kedua: Musim 2</p>", "Misteri · Rumah tangga</p>");
R("Bab 47 — Pintu yang Tak Pernah Dikunci</h3>", "Rekor Rp66 juta dalam sebulan</h3>");
R(
  '<a href="https://kbm.id/ratna-maharani/istri-kedua-musim-2?ref=homebase"',
  '<a href="https://kbm.id/book/detail/3a67c9ee-2adc-47ef-44ab-9a5dc301fbb3?ref=homebase"'
);

R("<p style=\"margin:0 0 4px;font-family:'Playfair Display',serif;font-size:20px;font-weight:600;color:#FBF6EF\">Ratna Maharani</p>", "<p style=\"margin:0 0 4px;font-family:'Playfair Display',serif;font-size:20px;font-weight:600;color:#FBF6EF\">Majarani</p>");
R("© 2026 Ratna Maharani ·", "© 2026 Majarani ·");
R(
  "Ratna Maharani menulis romance keluarga &amp; rumah tangga sejak 2021 dan kini menjadi salah satu penulis terlaris di KBM App. Ceritanya dikenal lewat konflik rumah tangga yang jujur dan tokoh perempuan yang kuat — dibaca jutaan perempuan Indonesia usia 25–45.",
  "Majarani — akrab disapa Maja — menulis di KBM App sejak 2020: 75 karya drama rumah tangga, roman, dan misteri. Meraih peringkat Emerald, pernah No. 1 Fortune 500 KBM, dan karyanya dilirik rumah produksi untuk adaptasi film."
);
R("Bekerja sama dengan Ratna</h1>", "Bekerja sama dengan Majarani</h1>");

writeFileSync(P, h, "utf8");
console.log("homebase content adapted");

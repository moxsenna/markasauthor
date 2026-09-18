# Gates: Majarani shelf — tema global, performa, responsif mobile

OWNS: majarani-shelf.html, majarani-generated-books.json, generate-palettes.py, fork-generator.mjs, book-showcase.html, unlazy-checks/**, GATES.md

Scope: Samakan background dengan tema global terang, ringankan Three.js agar jauh lebih cepat terbuka dari baseline 69.6 detik, dan pastikan responsif di mobile 390px.

- [x] G1: Background default halaman sama dengan tema website global
  CHECK: node unlazy-checks/check-theme.mjs
  EXPECT: theme verification passed
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=D:\Coding\markasauthor; path=49037f729fe2/57 entries; EXPECT=matched; output-sha256=8c527b1f9b6a4f418051c333babda6ac73be5dc7adeeb4f714639d0973475159; output-bytes=26

- [x] G2: Seluruh 75 palet buku berjangkar terang agar applyBookTheme tidak mengembalikan mode gelap
  CHECK: node unlazy-checks/check-theme.mjs
  EXPECT: theme verification passed
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=D:\Coding\markasauthor; path=49037f729fe2/57 entries; EXPECT=matched; output-sha256=8c527b1f9b6a4f418051c333babda6ac73be5dc7adeeb4f714639d0973475159; output-bytes=26

- [x] G3: Resolusi tekstur dan loop kanvas dipangkas
  CHECK: node unlazy-checks/check-perf.mjs
  EXPECT: perf verification passed
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=D:\Coding\markasauthor; path=49037f729fe2/57 entries; EXPECT=matched; output-sha256=c5f7de639b8379b21f966debc07918758ef109bd70ad7b5da45c3814771cd812; output-bytes=25

- [x] G4: Cover dimuat progresif tanpa blocking await 75 gambar
  CHECK: node unlazy-checks/check-perf.mjs
  EXPECT: perf verification passed
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=D:\Coding\markasauthor; path=49037f729fe2/57 entries; EXPECT=matched; output-sha256=c5f7de639b8379b21f966debc07918758ef109bd70ad7b5da45c3814771cd812; output-bytes=25

- [x] G5: Pixel ratio dibatasi dan antialias kondisional
  CHECK: node unlazy-checks/check-perf.mjs
  EXPECT: perf verification passed
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=D:\Coding\markasauthor; path=49037f729fe2/57 entries; EXPECT=matched; output-sha256=c5f7de639b8379b21f966debc07918758ef109bd70ad7b5da45c3814771cd812; output-bytes=25

- [x] G6: Fondasi responsif statis ada di dokumen fork
  CHECK: node unlazy-checks/check-responsive.mjs
  EXPECT: responsive verification passed
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=D:\Coding\markasauthor; path=49037f729fe2/57 entries; EXPECT=matched; output-sha256=45cdfefc1518e953cc299e3276626619d03b6f4207eb747c17d01c6b5ab857da; output-bytes=31

- [x] G7: Visual desktop bertema terang konsisten dengan website global
  EVIDENCE: manual 2026-09-18 — screenshot .playwright-mcp/final-desktop.png: background paper terang, rak walnut, 5 cover foto; computed --paper #f4f4f3 (tint buku-1 dari #faf7f0), --ink #1c1b17, --accent #c7ad62; foil teks template hilang sepenuhnya (light-nopl.png). Sesuai index.html (:root --paper #faf7f0, --ink #1a1712).
  UPDATE 2026-09-18 (permintaan user: tema mengikuti halaman homebase): palet di-anchor ulang ke tema homebase Ratna Maharani (paper #FBF6EF, ink #3B2A28, maroon #7A3341, gold #E4B87E); runnable G1/G2 di-reverify hijau terhadap nilai baru; screenshot homebase-rak2.png menunjukkan shelf rose/cream menyatu dengan halaman (paper ter-computed #f7f6f6). Filter no-cover aktif: 75/75 buku lolos (tidak ada yang dibuang; aturan berlaku untuk data berikutnya).

- [x] G8: Waktu sampai webgl-ready jauh di bawah baseline 69.6 detik
  EVIDENCE: manual 2026-09-18 — performance.mark di salinan diagnosis: m-ready 2933ms lalu 2125ms lalu 1576ms (cache hangat) vs baseline 69630ms metode poll-identik; breakdown m-init 0.2-0.4s, 11 rigs ~1s, first-render ~1.5s (dari 23s). Lazy-rigs + tekstur ramping + cover progresif.

- [x] G9: Mobile 390px tanpa overflow horizontal, UI terlihat, Open/Escape berfungsi
  EVIDENCE: manual 2026-09-18 — sesi fresh 390x844: scrollWidth-clientWidth=0, browse-ui tampil, h1 + 75 markers; tombol OPEN bisa diklik setelah strip markers dipindah ke baris sendiri (overlap prev-OPEN -4px = renggang); chain Open (mode-detail + judul benar) lalu Escape kembali ke shelf; console 0 errors. Screenshot final-mobile-fresh.png, final-mobile-ok.png.
  UPDATE: feedback "teks tidak kelihatan" — judul menumpuk counter di ≤560px karena patch terselip sebelum aturan canonical (kalah cascade). Perbaikan: seleksi di-stack vertikal via override block di akhir stylesheet + cache-bust iframe ?v=2; verifikasi stacked=true di 390px (fb-stacked2.png).

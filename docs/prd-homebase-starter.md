# PRD — Homebase Starter

| | |
|---|---|
| **Produk** | Homebase Starter |
| **Harga** | Rp1.500.000 (sekali bayar) |
| **Posisi dalam lini** | Tier entry / jalur turun dari Author Homebase. Bukan produk yang dipromosikan — ditawarkan sebagai jawaban saat calon klien keberatan harga hero. |
| **Target produksi** | ≤ 2 hari kerja per situs (setelah materi lengkap) |
| **Status dokumen** | Draft v1 — 2026-07-06 |

---

## 1. Ringkasan & Tujuan Produk

Homebase Starter adalah rumah digital minimum-viable untuk penulis KBM: identitas + katalog karya + **fondasi database pembaca**. Tujuannya "mengamankan yang paling penting dulu" — nama pena di Google dan kontak pembaca — dengan jalur upgrade yang jelas ke Author Homebase.

**Prinsip desain tier ini:** cukup untuk mulai, jelas kurang untuk serius. Starter tidak boleh terasa selengkap hero (hindari kanibalisasi), tapi juga tidak boleh terasa murahan (dia tetap membawa brand MarkasAuthor).

### Tujuan bisnis
1. Menurunkan hambatan masuk tanpa merusak anchor harga hero.
2. Menjadi pintu upgrade: klien Starter yang aktif adalah prospek terbaik untuk upgrade + retainer.
3. Portofolio volume — memperbanyak situs ber-badge MarkasAuthor di komunitas KBM.

### Non-tujuan
- Bukan mesin pertumbuhan database lewat **Ruang Bonus** (fitur hero).
- Bukan situs multi-halaman kompleks (peta baca page, collab PDF, halaman per-karya).
- Bukan CMS web bebas / edit source code.

---

## 2. Pengguna

| Persona | Kebutuhan |
|---|---|
| **Penulis** (pembeli) — penulis KBM aktif, 1–5 karya, penghasilan mulai stabil, belum siap Rp3,5jt | Punya alamat resmi di internet; mulai mengumpulkan kontak pembaca; terlihat profesional saat dihubungi pihak luar |
| **Pembaca** (pengunjung) | Menemukan semua karya penulis di satu tempat; tahu cara mengikuti penulis; link langsung ke KBM |
| **Pihak ketiga** (penerbit/brand/media) | Bio, kontak, dan daftar karya dalam satu halaman kredibel |

---

## 3. Scope — Struktur & Fitur

Situs **one-page** (single scroll) dengan section berikut, berurutan:

### 3.1 Hero / Identitas
- Nama pena (H1), tagline/genre, foto penulis.
- CTA utama: "Baca Karya Saya di KBM" → deep link ke profil KBM penulis.
- **Wajib:** badge "Karya Asli Terbit di KBM App" (elemen standar semua tier).

### 3.2 Rak Buku (Bookshelf)
- Grid visual cover karya (maks. 12 di Starter).
- Per karya: cover, judul, genre, 1 kalimat hook, tombol **"Baca di KBM →"** (deep link ke halaman buku di KBM).
- **Dilarang:** sinopsis panjang, preview chapter, atau konten cerita apa pun di situs (prinsip non-kompetisi dengan KBM).

### 3.3 Author Timeline (versi ringkas)
- 3–6 milestone karier (vertikal): debut, karya pertama tembus X pembaca, dst.
- Data dari formulir onboarding; format teks + tahun, tanpa aset custom.

### 3.4 Database Pembaca (versi dasar — WhatsApp-first)
- Satu formulir: **nama + nomor WhatsApp** (email opsional) → tersimpan otomatis ke **Google Sheet milik klien** (lihat §4).
- Tombol "Ikuti Saluran WhatsApp [Nama Pena]" bersebelahan — jalur kabar cepat untuk pembaca.
- Copy standar: "Jadi yang pertama tahu karya terbaru [Nama Pena]".
- Tanpa lead magnet, tanpa kabar rilis terkelola (fitur hero).

### 3.5 Collaboration Kit (ringkas)
- Section "Kerja Sama": bio pendek (±100 kata), genre/spesialisasi, statistik ringkas (total pembaca/karya), kontak kerja sama (email/WA manajemen).
- Tanpa foto HD unduhan / PDF (fitur hero).

### 3.6 Footer
- Link semua medsos + KBM.
- Badge "Dibangun oleh MarkasAuthor" → link ke situs MarkasAuthor. **(Wajib di semua tier — mesin akuisisi.)**

### 3.7 MarkasAuthor Assistant + Dashboard Penulis (ops — semua tier)

Starter menyertakan **jalur operasional penulis** (add-on bulanan opsional) lewat dua surface setara:

1. **Telegram bot** — command allowlist (bukan chat CMS bebas).
2. **Dashboard web** (`/dashboard`) — form terstruktur dengan capability yang sama.

**Scope command Starter (MVP produk):**
- Aktivasi membership (kode sekali pakai) — production later; mock presentasi: langsung "masuk".
- `Update Bab` (karya, judul bab, URL KBM HTTPS, tanggal) → preview → konfirmasi → undo.
- Draft pesan **Saluran WhatsApp** siap salin (penulis tetap post manual).
- Riwayat rilis ringkas + lihat database pembaca (Sheet milik klien; mock tabel di demo).
- Tema situs minimal (pilih preset) — mock only di presentasi.

**Di luar Starter ops (🔒 upgrade):** kelola Ruang Bonus, edit peta baca multi-node page, Collab Kit PDF fields, chapter-card ekosistem penuh, universe/tokoh.

**Prinsip keamanan (sama semua tier):** AI/parser hanya mengisi schema; eksekusi deterministik; tidak ada publish tanpa konfirmasi; tidak edit HTML; `author_id` dari server.

Harga add-on bulanan: lihat paket Care / Active / Managed di PRD Author Homebase §7.2 (berlaku lintas tier).

### Fitur teknis lintas-section
- SEO dasar: title/meta description dengan nama pena, structured data `Person` + `Book`, sitemap, OG image (1 template standar diganti nama+foto).
- Cloudflare Web Analytics terpasang (akun klien).
- Responsif penuh (mobile-first — mayoritas pembaca KBM dari HP).
- Skor Lighthouse target: Performance ≥ 95, SEO ≥ 95, A11y ≥ 90.

---

## 4. Arsitektur Teknis

**Prinsip utama: zero maintenance untuk MarkasAuthor, zero biaya bulanan untuk klien, 100% kepemilikan klien.**

| Komponen | Pilihan | Alasan |
|---|---|---|
| Situs | HTML/CSS statis dari **template internal tunggal** (satu codebase untuk semua tier) | Tanpa build step rumit; konten via file data (JSON/MD); template yang sama adalah fondasi tier atas & calon SaaS |
| Hosting | **Cloudflare Pages di akun milik klien** | Gratis selamanya, klien pegang kendali penuh |
| Domain | .my.id / .web.id gratis (dibelikan, **atas nama klien**) | Sesuai janji offer |
| Formulir pembaca | Nama + nomor WA → **Google Sheet milik klien** (Google Form embed atau Apps Script endpoint) + tombol ikuti **Saluran WhatsApp** penulis | Pembaca & penulis KBM hidup di WA, bukan email; Sheet = daftar kontak yang benar-benar dimiliki klien; tanpa backend buatan sendiri, gratis selamanya |
| Analytics | Cloudflare Web Analytics (akun klien) | Gratis, tanpa cookie banner |

**Yang sengaja TIDAK dipakai:** CMS (Notion/Supabase/Decap), database custom, backend/Workers custom. Update konten = jasa (retainer atau per-request), bukan self-service.

---

## 5. Alur Produksi & Serah Terima

1. **Onboarding (klien, ±30 menit):** isi 1 formulir — nama pena, bio, foto, link semua karya KBM, milestone karier, link medsos, pilihan domain.
2. **Setup akun (kita, dipandu):** buat/akses akun Cloudflare klien, Google Sheet penampung kontak, dan Saluran WhatsApp penulis (via panggilan singkat atau akses sementara yang dicabut setelah serah terima). Seluruh proses harus bisa diikuti klien **dari HP** — asumsikan klien tidak punya laptop.
3. **Build (kita):** isi template, generate OG image, pasang formulir & analytics. Target ≤ 2 hari kerja.
4. **Review klien:** 1× putaran revisi (perubahan konten/warna; bukan perubahan struktur).
5. **Serah terima:** deploy ke akun klien + **Surat Kepemilikan Aset** (domain, akun, file = milik klien) + video tutorial 5 menit (cara lihat subscriber & analytics).
6. **H+14 & H+30:** follow-up — momen menawarkan retainer "Penjaga Rumah" dan upgrade.

**SLA:** live ≤ 7 hari kerja sejak materi lengkap, atau DP kembali 100%.

---

## 6. Kriteria Penerimaan (Acceptance Criteria)

- [ ] Semua section §3 terpasang dan terisi konten klien.
- [ ] Semua tombol karya deep-link benar ke halaman KBM masing-masing (diuji manual satu per satu).
- [ ] Formulir kontak teruji end-to-end dari HP: submit → baris baru muncul di Google Sheet klien; tombol Saluran WA mengarah ke saluran yang benar.
- [ ] Domain aktif dengan HTTPS; `nama-pena` muncul di Google (indexing diminta via Search Console) ≤ 14 hari.
- [ ] Lighthouse mobile: Perf ≥ 95, SEO ≥ 95.
- [ ] Tidak ada satu pun konten chapter/cerita ter-host di situs.
- [ ] Surat Kepemilikan Aset ditandatangani kedua pihak.

---

## 7. Di Luar Scope (dan ke mana mengarahkannya)

| Permintaan | Jawaban |
|---|---|
| Kabar rilis multi-kanal + Ruang Bonus + peta baca page | Upgrade → Author Homebase |
| Update bab + draft WA via bot/dashboard | **Termasuk** Starter (add-on Assistant) |
| Konten bonus / deleted scene | Upgrade → Author Homebase |
| Peta baca multi-seri | Upgrade → Author Homebase |
| Halaman semesta/tokoh | Signature Universe / add-on Wiki |
| Edit konten sendiri (CMS) | Add-on khusus Signature |
| Update rutin oleh kita | Retainer "Penjaga Rumah" Rp150rb/bln |

## 8. Jalur Upgrade

Upgrade ke Author Homebase = **bayar selisih (Rp2jt)**, dikerjakan di atas situs yang sama (tanpa migrasi). Semua kontak pembaca terbawa karena Google Sheet dan Saluran WA memang milik klien sejak awal.

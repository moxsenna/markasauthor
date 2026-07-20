# PRD — Signature Universe

| | |
|---|---|
| **Produk** | Signature Universe |
| **Harga** | Mulai Rp7.500.000 (harga final via konsultasi & proposal custom) |
| **Posisi dalam lini** | Tier tertinggi, **by invitation/konsultasi**. Fungsi ganda: produk premium nyata + anchor psikologis yang membuat hero (Rp3,5jt) terasa masuk akal. Keberadaannya harus selalu terlihat di price list meski penjualannya selektif. |
| **Target produksi** | 2–3 minggu per proyek (scope disepakati per proposal) |
| **Status dokumen** | Draft v1 — 2026-07-06 |

---

## 1. Ringkasan & Tujuan Produk

Signature Universe memperlakukan karya penulis sebagai **IP (intellectual property)**, bukan sekadar daftar novel. Semua fitur Author Homebase, ditambah lapisan "dunia": ensiklopedia semesta cerita, tokoh, timeline internal, peta, playlist, trivia — dengan desain custom penuh yang mengikuti nuansa karya.

Framing penjualan: bukan "paket termahal", melainkan *"karya Anda layak diperlakukan sebagai IP"*. Target pembeli sesungguhnya adalah penulis yang sedang/berpotensi ke arah adaptasi (film/series/cetak) atau punya fandom yang aktif membahas lore.

### Tujuan bisnis
1. Margin tertinggi per proyek + add-on margin tinggi (Wiki, CMS).
2. Portofolio "wow" — 1 proyek Signature yang bagus menjual 10 proyek hero.
3. Anchor harga untuk seluruh lini.

### Non-tujuan
- Bukan produk volume. Target realistis: 1–2 proyek per kuartal.
- Tetap **tidak** meng-host konten cerita, **tidak** memproses pembayaran. Prinsip non-kompetisi dengan KBM berlaku penuh, tanpa pengecualian di tier mana pun.

---

## 2. Pengguna

| Persona | Kebutuhan |
|---|---|
| **Penulis IP-builder** — ≥1 universe dengan banyak tokoh/istilah, fandom aktif, penghasilan tinggi, orientasi jangka panjang (adaptasi, penerbitan mayor) | Semesta ceritanya terdokumentasi secara resmi & memukau; identitas digital selevel penulis internasional; alat bantu fandom |
| **Fans berat** | Tempat menyelami lore: profil tokoh, timeline, peta, trivia; konten yang bisa dibagikan ulang |
| **Pembaca baru** | Pintu masuk universe yang tidak menakutkan: mulai dari mana, siapa tokohnya |
| **Produser/penerbit/scout** | Melihat dalam 5 menit bahwa IP ini serius, terstruktur, dan punya fandom |

---

## 3. Scope — Semua Fitur Author Homebase, Plus:

### 3.1 Author Universe Hub ⭐
Halaman gerbang per universe (mendukung >1 universe) dengan desain custom mengikuti nuansa karya (palet, tipografi, tekstur — misal dark academia, wuxia, teen romance):

```
Semesta [Nama Universe]
├── Tokoh          → galeri kartu karakter
├── Timeline       → kronologi internal semesta cerita
├── Urutan Baca    → peta baca (dari hero, ditingkatkan visualnya)
├── Peta Lokasi    → ilustrasi/peta stilasi lokasi penting
├── Playlist       → embed Spotify/YouTube playlist resmi per karya/arc
└── Trivia         → fakta di balik cerita, easter egg, FAQ lore
```

### 3.2 Galeri Tokoh (Character Cards)
- Kartu per tokoh: nama, peran, kutipan khas, deskripsi singkat, relasi antartokoh, karya tempat ia muncul.
- Visual: ilustrasi milik klien / komisi terpisah / tipografi stilasi (tanpa ilustrasi). **Kita tidak memproduksi ilustrasi** — di luar scope, bisa difasilitasi via ilustrator partner.
- **Kartu bisa dibagikan**: tiap kartu punya OG image sendiri → di-share ke medsos tampil cantik dengan watermark URL situs. (Mesin distribusi organik oleh fandom.)
- Batas Signature dasar: ≤ 15 tokoh. Lebih dari itu → add-on Character Wiki.

### 3.3 Timeline Semesta
- Kronologi internal cerita (berbeda dari Author Timeline karier di beranda).
- **Kebijakan spoiler:** penanda spoiler per-entri (blur + klik untuk buka, murni client-side). Disepakati dengan klien entri mana yang dianggap spoiler.

### 3.4 Peta Lokasi
- Peta stilasi (SVG/ilustrasi statis) dengan titik lokasi penting → klik menampilkan deskripsi singkat.
- Sumber visual sama dengan §3.2 (aset klien / komisi / tipografis).

### 3.5 Rangkaian Sambutan Pembaca (WhatsApp-first)
- Alur sambutan bertingkat setelah pembaca meninggalkan kontak: halaman bonus → tur universe & peta baca → ajakan mulai baca di KBM + gabung kanal fandom (Saluran WA / grup Telegram).
- Segmentasi dasar per-universe: formulir per universe → tab terpisah di Google Sheet klien (pembaca memilih universe favorit saat mendaftar) — bekal blast tertarget di kemudian hari.
- Automasi pesan WA sungguhan (balasan otomatis, drip campaign) **bukan** bagian paket — tersedia via retainer premium + layanan WA API lokal.

### 3.6 Desain Custom Penuh
- Bukan varian template: art direction per proyek (moodboard → 1 konsep desain → implementasi).
- Yang tetap dari template: struktur data, loop kontak, standar SEO/performa — supaya biaya produksi terkendali.

---

## 4. Add-on Resmi (dijual terpisah, margin tinggi)

| Add-on | Harga | Isi | Batasan |
|---|---|---|---|
| **Character Wiki** | +Rp1.500.000 | >15 tokoh, halaman penuh per tokoh, indeks & pencarian client-side | Konten dari klien; kita struktur & desain |
| **Universe Wiki** | +Rp2.000.000 | Ensiklopedia istilah/lokasi/organisasi/sistem dunia, saling bertaut ala wiki | Statis; penambahan entri via retainer |
| **CMS Self-Edit** | +Rp2.500.000 & hanya untuk klien Signature | Decap CMS (git-based) untuk edit karya/bonus/trivia sendiri | **Satu-satunya pengecualian kebijakan no-CMS.** Wajib paket onboarding 1 jam + disclaimer dukungan terbatas; di luar itu, perbaikan = billable. Git-based dipilih karena tanpa server & token pihak ketiga yang bisa expired |
| **Ilustrasi** | via partner | Komisi ilustrator (karakter/peta) | Kita fasilitasi & arahkan art direction; kontrak langsung klien-ilustrator |

---

## 5. Arsitektur Teknis

Fondasi identik dengan hero (template codebase yang sama, Cloudflare Pages akun klien, Google Sheet + Saluran WA milik klien) dengan tambahan:

| Komponen | Pilihan | Catatan |
|---|---|---|
| Data universe | `universe/<nama>/characters/*.md`, `timeline.md`, `locations.md`, `trivia.md` | Struktur data = dasar Wiki add-on & retainer |
| OG per kartu tokoh | Generate saat build (template → PNG statis) | Tanpa layanan runtime |
| Spoiler gate | Client-side (CSS/JS ringan) | Bukan proteksi keras — cukup untuk etika spoiler |
| Pencarian wiki (add-on) | Index JSON + pencarian client-side (mis. lunr) | Tanpa backend |
| CMS (add-on) | Decap CMS + GitHub repo milik klien | Git-based = tanpa DB, tanpa token expiring |

**Guardrail proyek custom:** desain boleh custom, **struktur data dan loop kontak tidak boleh menyimpang dari template**. Penyimpangan struktur = utang maintenance selamanya.

---

## 6. Alur Produksi

1. **Konsultasi (gratis, 45 menit):** gali universe, aset visual yang dimiliki, tujuan (fandom? adaptasi?). Hasil: proposal + harga final + timeline.
2. **DP 50%** → mulai.
3. **Fase 1 — Art direction (3–4 hari):** moodboard + 1 konsep desain → persetujuan klien (1× revisi konsep).
4. **Fase 2 — Konten universe (paralel):** klien mengisi workbook terstruktur (template tokoh/timeline/trivia yang kita sediakan) — **klien adalah sumber lore, kita adalah kurator & penata**. Sesi kerja bareng 1×2 jam bila perlu.
5. **Fase 3 — Build (7–10 hari):** fondasi hero → lapisan universe → OG kartu → rangkaian sambutan pembaca.
6. **Uji loop inti + uji universe** (checklist §7).
7. **Review klien:** 3× putaran revisi.
8. **Serah terima:** Surat Kepemilikan Aset + tutorial + **1 bulan retainer Penjaga Rumah gratis** (mengunci kebiasaan, jalur ke retainer berbayar).

**SLA:** timeline per proposal; keterlambatan dari pihak kita > 7 hari dari jadwal = kompensasi retainer 2 bulan gratis.

---

## 7. Kriteria Penerimaan

Semua kriteria Author Homebase, plus:

- [ ] Universe Hub live dengan minimal: 6 tokoh, 8 entri timeline, peta baca, 10 trivia, 1 playlist (minimum konten disepakati di proposal).
- [ ] OG image kartu tokoh teruji tampil benar saat share ke WhatsApp, X/Twitter, Instagram.
- [ ] Spoiler gate berfungsi dan daftar entri-spoiler disetujui klien tertulis.
- [ ] Rangkaian sambutan (formulir → Sheet → bonus → kanal fandom) teruji end-to-end dari HP.
- [ ] Desain disetujui klien pada fase konsep **sebelum** build (mencegah revisi struktural di akhir).
- [ ] (Bila add-on CMS) klien berhasil melakukan 3 operasi dasar sendiri saat onboarding: tambah karya, edit trivia, publish.

---

## 8. Risiko Khusus Tier Ini

| Risiko | Mitigasi |
|---|---|
| Scope creep (universe "masih ada satu lagi kak") | Minimum & maksimum konten dikunci di proposal; kelebihan = add-on/retainer |
| Klien tak punya aset visual tapi berharap "wow" | Opsi tipografi-stilasi ditunjukkan di konsultasi via contoh; ekspektasi dikunci sebelum DP |
| Lore tidak konsisten (penulis sendiri lupa) | Workbook terstruktur memaksa konsistensi; ketidaksesuaian dicatat & dikonfirmasi, bukan ditebak |
| Revisi desain tak berujung | Persetujuan konsep di Fase 1 bersifat mengikat; revisi pasca-build terbatas 3× |

## 9. Metrik Keberhasilan (per proyek, 90 hari)

- ≥ 1 konten kartu tokoh di-share organik oleh fandom (terlihat dari referral/mention).
- Database pembaca ≥ 250 subscriber.
- 1 studi kasus lengkap terpublikasi (dengan izin klien) — aset marketing paling berharga dari tier ini.

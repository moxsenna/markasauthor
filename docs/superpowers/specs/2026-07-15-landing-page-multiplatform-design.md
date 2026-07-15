# Design: Landing Page Multi-Platform + PRD Sync

| | |
|---|---|
| **Tanggal** | 2026-07-15 |
| **File target** | `index.html` (root) |
| **Deploy** | Cloudflare Pages |
| **Status** | Approved design — menunggu review spec |

---

## 1. Tujuan

1. Ubah copy LP agar **tidak terlalu spesifik ke KBM** — penulis dari platform baca/app serial/medsos lain juga merasa dituju.
2. **Sinkronkan LP dengan PRD terbaru** (Author Homebase v2, Starter v1.1, Signature v1): fitur, harga, Assistant, SLA, ownership.
3. Deploy hasil ke **Cloudflare Pages**.

## 2. Keputusan yang dikunci

| Topik | Keputusan |
|---|---|
| Posisi platform | Multi-platform + **KBM soft mention** — brand platform **minim di hero**; boleh 1× di FAQ/truth sebagai contoh |
| Assistant di LP | **Section khusus** + harga Care / Active / Managed |
| Founding Authors | **10 slot** @ Rp2.000.000 (bukan 3 slot di header PRD) |
| Nomor WA CTA | `6285179595302` |
| Pendekatan | **C — Restructure full funnel** (urutan section baru + How it works + Assistant) |
| Layout visual | Pertahankan palet, tipografi, komponen CSS yang ada; tambah style section baru seperlunya |

## 3. Struktur section (urutan final)

1. **Nav** — logo · Kenapa · Cara kerja · Investasi · FAQ · CTA Amankan Slot  
2. **Hero** — multi-platform soft · hook platform-risk · CTA founding + secondary  
3. **Truth (dark)** — pembaca dipinjam platform · soft example platform boleh 1×  
4. **Pain ×6** — generik penulis serial · solusi fitur MarkasAuthor  
5. **How it works (baru)** — 5 langkah loop inti  
6. **For readers** — 3 value · note multi-platform (bukan KBM-only)  
7. **Pricing** — Signature · Author Homebase (hero) · Starter · list fitur sinkron PRD  
8. **Assistant (baru)** — Care / Active / Managed · dual surface Telegram + Dashboard  
9. **Guarantee** — live 7 hari · surat kepemilikan · ±45 menit materi (PRD)  
10. **Founding** — 10 slot · Rp2jt dari 3,5jt · progress bar  
11. **FAQ** — multi-platform, non-compete platform baca, Assistant, ownership, gaptek  
12. **Final CTA + Footer** — WA `6285179595302` · tanpa “berdampingan KBM only”

## 4. Arah copy

### 4.1 Prinsip

- **Platform generik dulu:** “platform baca”, “app serial”, “medsos”, “algoritma”.
- **Minim nama brand platform di hero, pricing, eyebrow, footer.**
- **KBM soft:** maksimal 1× di Truth atau FAQ sebagai contoh, bukan syarat.
- **H1 hook tetap** (sudah platform-agnostic):  
  *Follower 50 ribu. Akun hilang besok pagi. Berapa pembaca yang masih bisa Anda hubungi?*
- **Tone:** serius, hangat, Indonesia formal-santai (sama seperti LP sekarang).
- **Non-kompetisi:** homebase tidak host chapter; semua tombol “Baca” ke platform tempat karya terbit.

### 4.2 Draft framing (arah, bukan final word-for-word)

| Elemen | Arah copy |
|---|---|
| Eyebrow | Untuk penulis yang serius dengan kariernya di platform mana pun |
| Lead hero | Tanah pinjaman: algoritma, app, medsos. MarkasAuthor = rumah digital milik Anda (domain, hosting, database). |
| Truth | Follower di app/medsos bukan milik Anda. Izin bisa dicabut. Butuh satu alamat yang tidak pindah. |
| Note pembaca | Semua jalan berujung ke **platform tempat karya Anda terbit**. Memperbesar, bukan memindahkan. |
| Footer | Rumah digital milik penulis, selamanya. © 2026 MarkasAuthor |

### 4.3 Pain cards (6) — generik

1. Spam story/grup tiap rilis → **Sistem Kabar Rilis** (Saluran WhatsApp)  
2. Follower banyak, kontak nol jika akun hilang → **Database Pembaca**  
3. Seri & spin-off membingungkan → **Peta Baca**  
4. Linktree ke penerbit/brand → **Collaboration Kit** (+ PDF di Homebase)  
5. Bonus di Drive berantakan → **Ruang Bonus Pembaca** (gate kontak)  
6. Googling nama pena → hasil acak → **SEO / halaman yang ditemukan Google**

Pain quote tidak menyebut brand platform. Solusi menyebut fitur MarkasAuthor.

## 5. How it works (section baru)

Lima langkah, visual horizontal di desktop / vertikal di mobile:

1. **Bonus** — konten pelengkap (bukan chapter) di Ruang Bonus  
2. **Kontak** — nama + WA + consent → Google Sheet milik penulis  
3. **Database** — aset pembaca di tangan penulis  
4. **Kabar rilis** — update bab → draft pesan → post Saluran WA  
5. **Baca di platform** — link ke tempat karya terbit; homebase memperbesar jangkauan  

Section ini memvisualkan loop inti PRD Author Homebase §1.

## 6. Pricing (sinkron PRD)

| Paket | Harga | Poin LP |
|---|---|---|
| **Signature Universe** | Mulai Rp7,5 jt | Semua Homebase + universe, wiki tokoh, timeline, peta, playlist, trivia, desain custom; undangan/konsultasi |
| **Author Homebase** (hero) | Rp3,5 jt | Kabar rilis WA, DB, bonus, peta baca, collab PDF, rak+timeline, domain gratis, SEO; cicil 2× |
| **Homebase Starter** | Rp1,5 jt | Rak+timeline, bio+link karya, DB dasar, collab ringkas, domain gratis; upgrade bayar selisih; fitur hero di-muted |
| **Founding Authors** | Rp2 jt (dari 3,5 jt) | **10 slot**; studi kasus; setelah penuh harga normal |

Catatan pricing:

- Domain `.my.id` / `.web.id` gratis; hosting Cloudflare Pages di akun klien Rp0/bulan.  
- DP 50%; pelunasan setelah rumah berdiri & klien melihat sendiri.  
- Assistant **bukan** syarat website live.

## 7. MarkasAuthor Assistant (section baru)

**Posisi copy:** setelah rumah berdiri — remote control operasional lewat **Telegram bot** atau **Dashboard web** (hasil setara, allowlist command). WhatsApp tetap front-office ke pembaca.

| Paket | Harga | Cakupan (LP-friendly) |
|---|---|---|
| **Care** | Rp149.000/bulan | Maks. 30 update berhasil; draft rilis; histori; Undo; support dasar |
| **Active** | Rp299.000/bulan | Maks. 100 update; multi-tim; variasi copy; laporan; prioritas support |
| **Managed** | Rp499.000–750.000/bulan | Semua Active + human review, bantu kampanye rilis, optimasi CTA |

**Wajib di copy section:**

- Website tetap live & milik klien jika Assistant dihentikan; yang berhenti = otomasi/update.  
- Tidak ada AI yang edit HTML bebas; hanya command allowlist + preview + konfirmasi.  
- Tersedia di **semua tier** (capability mengikuti matrix tier).

CTA section: chat WA untuk tanya paket / aktivasi.

## 8. Guarantee (update)

1. **Live 7 hari kerja** setelah materi lengkap, atau DP 100% kembali.  
2. **Surat Kepemilikan Aset** — domain, Cloudflare, file 100% milik klien.  
3. **Waktu materi ±45 menit** (sesuai PRD onboarding; ganti “30 menit” di LP lama). Stat strip hero boleh tetap “fokus menulis”; guarantee pakai angka PRD.

## 9. FAQ (inti yang harus ada)

1. Beda dengan Linktree/Lynk?  
2. Menyaingi / melanggar aturan **platform baca**? (bukan “aturan KBM” saja)  
3. Gaptek — sanggup? (+ sebut Assistant opsional, bukan “Penjaga Rumah Rp150rb”)  
4. Benar tanpa biaya bulanan hosting?  
5. Kalau MarkasAuthor tutup? (ownership)  
6. Ini cuma website? (sistem: DB, kabar, peta, collab)  
7. **Baru:** Apa itu MarkasAuthor Assistant? Wajib?  

Soft KBM: boleh di jawaban FAQ #2 sebagai contoh platform, bukan framing tunggal.

## 10. CTA & kontak

- Semua `wa.me/6200000000000` → `wa.me/6285179595302`  
- Prefilled text disesuaikan multi-platform (hapus “penulis di KBM” sebagai default).  
- Contoh: `Halo, saya penulis dan ingin tanya soal Author Homebase`

## 11. Yang tidak berubah

- Single-file `index.html` (HTML + CSS inline).  
- Palet warna, font Lora + Plus Jakarta Sans, pola komponen (pain-card, price-card, dll.).  
- Bahasa LP: Indonesia.  
- Tidak menambah backend, form server, analytics baru di scope ini (kecuali copy menyebut analytics bila relevan).

## 12. Deploy Cloudflare Pages

1. Pastikan proyek Pages mengarah ke root yang berisi `index.html` (atau path yang disepakati).  
2. Deploy via `wrangler pages deploy` dari root (atau folder publish yang disepakati), project name yang sudah ada / buat baru `markasauthor` bila belum.  
3. Verifikasi URL production setelah deploy.  
4. Tidak mengubah DNS kustom di scope ini kecuali user minta.

Detail command & project name diselesaikan di implementation plan (cek `.wrangler/` / akun yang ter-auth).

## 13. Out of scope

- Rewrite PRD (Founding 10 slot di LP ≠ 3 slot di header PRD — tidak diubah di PRD pada task ini).  
- Build fitur Assistant sungguhan / Dashboard production.  
- Ubah situs demo klien (`author-homebase-ratna-maharani/`, `tiers/`).  
- A/B testing, i18n English.

## 14. Kriteria selesai

- [ ] Tidak ada eyebrow/hero/footer yang membatasi “hanya penulis KBM”.  
- [ ] Brand platform minim di atas fold; soft mention maksimal di Truth/FAQ.  
- [ ] Section How it works + Assistant ada dan akurat vs PRD §7.2.  
- [ ] Harga tier + Founding 10 slot + WA nomor benar.  
- [ ] “Penjaga Rumah Rp150rb” tidak muncul.  
- [ ] Guarantee: 7 hari, ownership, ~45 menit materi.  
- [ ] Deploy CF Pages sukses; URL production bisa dibuka.  
- [ ] Smoke visual desktop + mobile (screenshot atau buka di browser).

## 15. Risiko & mitigasi

| Risiko | Mitigasi |
|---|---|
| Copy terlalu generik → kehilangan konversi klien KBM | Soft mention 1× di FAQ; value prop tetap “serial/app author” |
| Founding 10 slot vs PRD 3 slot membingungkan internal | Spec LP eksplisit; PRD update terpisah (out of scope) |
| Section Assistant bikin LP panjang | Pricing tetap hero; Assistant di bawah, compact 3-card |
| Deploy project name salah | Cek wrangler auth & list projects sebelum deploy |

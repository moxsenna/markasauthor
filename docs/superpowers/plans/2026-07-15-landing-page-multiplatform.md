# Landing Page Multi-Platform + PRD Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Rewrite `index.html` copy and section structure so LP is multi-platform (minim brand platform), syncs PRD (Assistant, pricing, SLA), then deploy to Cloudflare Pages.

**Architecture:** Single-file static LP (`index.html` root). Keep existing CSS tokens/components; add minimal CSS for How-it-works + Assistant sections. No build step. Deploy with `npx wrangler pages deploy`.

**Tech Stack:** HTML + inline CSS, Cloudflare Pages via Wrangler, WhatsApp deep links (`wa.me/6285179595302`).

**Spec:** `docs/superpowers/specs/2026-07-15-landing-page-multiplatform-design.md`

---

## File map

| File | Role |
|---|---|
| `index.html` | Satu-satunya file produk yang diubah (HTML body + sedikit CSS) |
| `docs/superpowers/specs/2026-07-15-landing-page-multiplatform-design.md` | Spec (read-only referensi) |
| Cloudflare Pages project | Target deploy (discover via `wrangler pages project list`) |

Tidak membuat file JS/backend baru. Tidak menyentuh `tiers/`, `author-homebase-ratna-maharani/`, atau PRD.

---

### Task 1: CSS untuk section baru

**Files:**
- Modify: `index.html` (blok `<style>` sebelum penutup `</style>`)

- [x] **Step 1: Tambah CSS How-it-works + Assistant**

Sisipkan sebelum penutup `</style>` (setelah `.mt-40{margin-top:40px}`):

```css
  /* ---------- HOW IT WORKS ---------- */
  .how{background:var(--paper-warm)}
  .how-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-top:48px;counter-reset:step}
  .how-step{background:var(--white);border:1px solid var(--line);border-radius:var(--radius);padding:24px 18px;position:relative}
  .how-step .num{font-family:var(--serif);font-size:28px;color:var(--gold);font-weight:700;margin-bottom:10px}
  .how-step h3{font-size:17px;margin-bottom:8px}
  .how-step p{font-size:14.5px;color:var(--ink-soft);line-height:1.55}
  @media(max-width:900px){.how-grid{grid-template-columns:1fr 1fr}}
  @media(max-width:560px){.how-grid{grid-template-columns:1fr}}

  /* ---------- ASSISTANT ---------- */
  .assistant{background:var(--paper)}
  .assistant-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;margin-top:48px}
  .assistant-card{background:var(--white);border:1px solid var(--line);border-radius:18px;padding:30px 26px;display:flex;flex-direction:column}
  .assistant-card.featured{border:2px solid var(--gold);box-shadow:0 12px 36px rgba(150,105,26,.12)}
  .assistant-card .plan-name{font-size:22px}
  .assistant-card .plan-price{font-size:32px;margin:12px 0 4px}
  .assistant-note{text-align:center;margin-top:28px;font-size:15px;color:var(--ink-soft);max-width:640px;margin-left:auto;margin-right:auto}
```

- [x] **Step 2: Verifikasi CSS valid (tidak putus tag)**

Run:

```bash
grep -n "HOW IT WORKS\|ASSISTANT\|</style>" index.html | head -20
```

Expected: komentar HOW/ASSISTANT muncul sebelum `</style>`.

- [x] **Step 3: Commit**

```bash
git add index.html
git commit -m "style(lp): add how-it-works and assistant section CSS"
```

---

### Task 2: Nav + Hero (multi-platform soft)

**Files:**
- Modify: `index.html` (nav + `<header class="hero">`)

- [x] **Step 1: Ganti nav links**

Ganti blok `.nav-links` menjadi:

```html
    <div class="nav-links">
      <a href="#masalah">Kenapa Ini Penting</a>
      <a href="#cara-kerja">Cara Kerja</a>
      <a href="#investasi">Investasi</a>
      <a href="#faq">FAQ</a>
      <a class="nav-cta" href="#founding">Amankan Slot</a>
    </div>
```

- [x] **Step 2: Ganti hero copy**

Ganti seluruh isi `<header class="hero">` … `</header>` dengan:

```html
<header class="hero">
  <div class="wrap">
    <span class="eyebrow">Untuk penulis yang serius dengan kariernya — di platform mana pun</span>
    <h1>Follower 50 ribu.<br>Akun hilang besok pagi.<br><em>Berapa pembaca yang masih bisa Anda hubungi?</em></h1>
    <p class="lead">Kalau jawabannya <strong>nol</strong> — Anda tidak sendirian. Ribuan penulis membangun karier di atas tanah pinjaman: algoritma, app serial, dan akun medsos yang bisa berubah kapan saja. MarkasAuthor membangun satu hal yang tidak bisa diambil siapa pun dari Anda: <strong>rumah digital yang sepenuhnya Anda miliki.</strong></p>
    <div class="hero-cta">
      <a class="btn btn-gold" href="#founding">Amankan Rumah Anda →</a>
      <a class="btn btn-ghost" href="#masalah">Baca dulu, saya masih ragu</a>
    </div>
    <p class="hero-note">Bukan langganan. Bukan sewa. Dibayar sekali, milik Anda selamanya — domain, akun, dan seluruh isinya atas nama Anda.</p>

    <div class="stat-strip">
      <div class="stat"><b>100%</b><span>kepemilikan — domain &amp; hosting atas nama Anda</span></div>
      <div class="stat"><b>Rp0</b><span>biaya bulanan hosting, selamanya</span></div>
      <div class="stat"><b>7 hari</b><span>live, atau uang kembali 100%</span></div>
      <div class="stat"><b>±45 mnt</b><span>waktu materi Anda — sisanya kami kerjakan</span></div>
    </div>
  </div>
</header>
```

- [x] **Step 3: Verifikasi tidak ada “KBM” di hero**

Run:

```bash
# Ambil baris hero saja
awk '/class="hero"/,/<\/header>/' index.html | grep -i kbm || echo "OK: no KBM in hero"
```

Expected: `OK: no KBM in hero`

- [x] **Step 4: Commit**

```bash
git add index.html
git commit -m "copy(lp): multi-platform hero and nav"
```

---

### Task 3: Truth + Pain cards (generik)

**Files:**
- Modify: `index.html` (section `#masalah` + section pain-grid)

- [x] **Step 1: Ganti Truth (dark) section**

```html
<section class="dark" id="masalah">
  <div class="wrap narrow">
    <span class="eyebrow kicker">Kebenaran yang jarang dibicarakan</span>
    <h2>Semua pembaca Anda saat ini... dipinjamkan.</h2>
    <p class="lead">Follower di app serial, di Instagram, di TikTok — mereka bukan milik Anda. Mereka milik platform. Anda hanya diberi izin menyapa mereka, selama algoritma berkenan. Izin itu bisa dicabut tanpa peringatan: akun kena suspend, aplikasi ganti kebijakan, jangkauan dipotong.</p>
    <blockquote>Hari ini pembaca mengenal Anda lewat satu app. Besok mungkin dari medsos. Lusa mungkin dari adaptasi film. Apa pun pintunya, mereka butuh satu alamat yang tidak pernah pindah: rumah milik Anda sendiri.</blockquote>
    <p class="lead">Penulis papan atas tidak menunggu musibah untuk sadar. Mereka mengamankan asetnya <em>sebelum</em> dibutuhkan — seperti asuransi: paling murah dibeli saat belum terjadi apa-apa.</p>
  </div>
</section>
```

- [x] **Step 2: Ganti 6 pain cards (quotes generik, solusi fitur)**

Ganti isi `.pain-grid` dengan:

```html
    <div class="pain-grid">
      <div class="pain-card">
        <p class="pain-quote">"Tiap rilis chapter aku spam story IG dan grup WA. Capek — dan yang lihat itu-itu saja."</p>
        <div class="pain-divider"></div>
        <div class="pain-solution"><b>Sistem Kabar Rilis</b>
        <p>Pembaca daftar sekali. Setiap chapter baru terbit, mereka dapat kabar langsung lewat Saluran WhatsApp Anda — klik, langsung baca di platform tempat karya terbit. Tanpa spam.</p></div>
      </div>
      <div class="pain-card">
        <p class="pain-quote">"Follower 50 ribu, tapi kalau akunku hilang besok... aku nggak bisa menghubungi satu pun dari mereka."</p>
        <div class="pain-divider"></div>
        <div class="pain-solution"><b>Database Pembaca Milik Sendiri</b>
        <p>Nama dan kontak pembaca setia tersimpan di tangan Anda — bukan di algoritma. Aset yang ikut ke mana pun karier Anda pergi.</p></div>
      </div>
      <div class="pain-card">
        <p class="pain-quote">"Seriku ada 4, spin-off 2. Tiap hari ada yang DM: 'Kak, bacanya mulai dari mana?'"</p>
        <div class="pain-divider"></div>
        <div class="pain-solution"><b>Peta Baca</b>
        <p>Satu link, pembaca langsung paham urutan bacanya. Pertanyaan berulang hilang — diganti pembaca yang langsung menyelam ke semesta Anda.</p></div>
      </div>
      <div class="pain-card">
        <p class="pain-quote">"Ada penerbit yang minta profil dan portofolio... dan aku kirim link Linktree."</p>
        <div class="pain-divider"></div>
        <div class="pain-solution"><b>Collaboration Kit</b>
        <p>Satu halaman profesional: bio, foto HD, statistik pembaca, daftar karya, kontak kerja sama. Anda tampil selevel dengan tawaran yang datang.</p></div>
      </div>
      <div class="pain-card">
        <p class="pain-quote">"Aku pengen kasih bonus ke pembaca setia — deleted scene, POV ekstra. Tapi naruhnya di mana? Link Google Drive berantakan."</p>
        <div class="pain-divider"></div>
        <div class="pain-solution"><b>Ruang Bonus Pembaca</b>
        <p>Konten eksklusif tersimpan rapi di satu tempat. Untuk membukanya, pembaca meninggalkan kontak — database Anda tumbuh dengan sendirinya.</p></div>
      </div>
      <div class="pain-card">
        <p class="pain-quote">"Coba googling nama penaku... yang muncul malah akun fanbase dan penulis lain."</p>
        <div class="pain-divider"></div>
        <div class="pain-solution"><b>Halaman yang Ditemukan Google</b>
        <p>Nama pena Anda jadi milik Anda di hasil pencarian. Pembaca baru menemukan Anda — dan semua jalan mengarah ke karya Anda di platform tempat ia terbit.</p></div>
      </div>
    </div>
```

Pastikan heading section pain tetap:

```html
      <span class="eyebrow">Mungkin Anda pernah merasakan ini</span>
      <h2>Enam masalah yang diam-diam menggerogoti karier penulis</h2>
```

- [x] **Step 3: Verifikasi**

```bash
grep -n "KBM\|kbm" index.html || echo "OK: no KBM yet (soft mention added later in FAQ only)"
grep -c "pain-card" index.html
```

Expected: 6 `pain-card`; KBM belum wajib ada sampai Task 6 FAQ.

- [x] **Step 4: Commit**

```bash
git add index.html
git commit -m "copy(lp): generic truth and pain cards"
```

---

### Task 4: How it works + For readers

**Files:**
- Modify: `index.html` (sisip section baru + rewrite `#pembaca`)

- [x] **Step 1: Sisipkan section How it works SETELAH pain section, SEBELUM readers**

```html
<!-- ============ HOW IT WORKS ============ -->
<section class="how" id="cara-kerja">
  <div class="wrap">
    <div class="center narrow">
      <span class="eyebrow">Cara kerjanya</span>
      <h2>Satu loop yang bekerja untuk karier Anda</h2>
      <p class="lead">Bukan sekadar profil cantik. Homebase Anda menjalankan sistem: menarik pembaca setia, menyimpan kontaknya, lalu mengantar mereka kembali ke karya Anda.</p>
    </div>
    <div class="how-grid">
      <div class="how-step">
        <div class="num">01</div>
        <h3>Bonus</h3>
        <p>Konten pelengkap — deleted scene, POV, trivia — di Ruang Bonus. Bukan chapter utama.</p>
      </div>
      <div class="how-step">
        <div class="num">02</div>
        <h3>Kontak</h3>
        <p>Pembaca isi nama + WhatsApp dengan persetujuan. Data masuk Google Sheet milik Anda.</p>
      </div>
      <div class="how-step">
        <div class="num">03</div>
        <h3>Database</h3>
        <p>Aset pembaca setia di tangan Anda — bukan di algoritma platform mana pun.</p>
      </div>
      <div class="how-step">
        <div class="num">04</div>
        <h3>Kabar rilis</h3>
        <p>Update bab → draft pesan → Anda post ke Saluran WhatsApp. Pembaca tahu detik itu juga.</p>
      </div>
      <div class="how-step">
        <div class="num">05</div>
        <h3>Baca di platform</h3>
        <p>Semua tombol “Baca” mengarah ke tempat karya Anda terbit. Memperbesar — bukan memindah.</p>
      </div>
    </div>
  </div>
</section>
```

- [x] **Step 2: Rewrite For readers + ganti kbm-note**

```html
<section class="readers" id="pembaca">
  <div class="wrap">
    <div class="center narrow">
      <span class="eyebrow">"Tapi... emang pembacaku mau buka?"</span>
      <h2>Pembaca Anda datang bukan untuk situsnya.<br>Mereka datang untuk tiga hal yang jarang ada di dalam aplikasi.</h2>
    </div>
    <div class="reader-grid">
      <div class="reader-card">
        <div class="num">01</div>
        <h3>Tidak pernah ketinggalan update</h3>
        <p>Notifikasi app sering lolos atau di-mute. Lewat Saluran WhatsApp penulis, pembaca setia tahu chapter baru terbit — di aplikasi yang mereka buka tiap hari.</p>
      </div>
      <div class="reader-card">
        <div class="num">02</div>
        <h3>Bonus yang tidak ada di app</h3>
        <p>Deleted scene, POV tokoh favorit, trivia di balik cerita, profil karakter. Hadiah kecil yang membuat pembaca merasa jadi orang dalam.</p>
      </div>
      <div class="reader-card">
        <div class="num">03</div>
        <h3>Tahu urutan baca yang benar</h3>
        <p>Tidak perlu DM penulisnya. Peta baca menunjukkan harus mulai dari mana — lalu satu klik langsung membaca di platform tempat karya terbit.</p>
      </div>
    </div>

    <div class="kbm-note">
      <h3>🤝 Dan satu hal yang penting: semua jalan tetap berujung ke karya Anda.</h3>
      <p>MarkasAuthor tidak meng-host cerita Anda dan tidak punya sistem baca sendiri. Setiap tombol “Baca Sekarang” mengarah langsung ke platform tempat karya Anda terbit. Rumah ini <strong>memperbesar</strong> pembaca Anda di sana — bukan memindahkannya. Anda tetap tumbuh di platform pilihan Anda, sambil memiliki fondasi sendiri.</p>
    </div>
  </div>
</section>
```

- [x] **Step 3: Verifikasi anchor nav**

```bash
grep -n 'id="cara-kerja"\|href="#cara-kerja"\|id="pembaca"' index.html
```

Expected: ketiga muncul.

- [x] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(lp): how-it-works loop and multi-platform readers section"
```

---

### Task 5: Pricing + Assistant + Guarantee + Founding

**Files:**
- Modify: `index.html` (section `#investasi` sampai `#founding`)

- [x] **Step 1: Update pricing cards (fitur list + WA links)**

Ganti seluruh section `#investasi` dengan:

```html
<section class="pricing" id="investasi">
  <div class="wrap">
    <div class="center narrow">
      <span class="eyebrow">Investasi</span>
      <h2>Bukan biaya. Premi asuransi untuk aset yang sudah Anda bangun bertahun-tahun.</h2>
      <p class="lead">Dibayar sekali. Tanpa langganan situs. Domain <strong>.my.id / .web.id gratis</strong> dari kami, hosting <strong>Rp0/bulan selamanya</strong> di akun Cloudflare milik Anda sendiri.</p>
    </div>

    <div class="price-grid">
      <div class="price-card">
        <div class="plan-name">Signature Universe</div>
        <p class="plan-tag">Untuk penulis yang membangun IP &amp; semesta cerita</p>
        <div class="plan-price">Rp7,5 jt<small> — mulai dari</small></div>
        <div class="plan-once">Melalui undangan &amp; konsultasi</div>
        <ul class="plan-list">
          <li>Semua yang ada di Author Homebase</li>
          <li>Author Universe: halaman semesta cerita lengkap</li>
          <li>Ensiklopedia tokoh &amp; dunia (Character Wiki)</li>
          <li>Timeline semesta, peta lokasi, playlist, trivia</li>
          <li>Rangkaian sambutan pembaca baru — berbasis WhatsApp</li>
          <li>Desain custom penuh sesuai nuansa karya Anda</li>
        </ul>
        <a class="btn btn-ghost" href="https://wa.me/6285179595302?text=Halo%2C%20saya%20tertarik%20konsultasi%20Signature%20Universe" target="_blank" rel="noopener">Ajukan Konsultasi</a>
        <p class="invite-only">Karya Anda layak diperlakukan sebagai IP.</p>
      </div>

      <div class="price-card hero-plan">
        <div class="plan-badge">Pilihan Para Penulis</div>
        <div class="plan-name">Author Homebase</div>
        <p class="plan-tag">Rumah digital lengkap — siap menampung seluruh pembaca Anda</p>
        <div class="plan-price">Rp3,5 jt</div>
        <div class="plan-once">Sekali bayar · milik Anda selamanya · bisa dicicil 2×</div>
        <ul class="plan-list">
          <li><strong>Sistem Kabar Rilis via WhatsApp</strong> — pembaca tahu chapter baru, tanpa Anda spam</li>
          <li><strong>Database Pembaca</strong> milik sendiri — nama &amp; nomor WA pembaca setia</li>
          <li><strong>Ruang Bonus Pembaca</strong> — konten eksklusif penumbuh database</li>
          <li><strong>Peta Baca</strong> semua seri &amp; spin-off Anda</li>
          <li><strong>Collaboration Kit</strong> lengkap + PDF untuk penerbit &amp; brand</li>
          <li>Rak Buku visual + Author Timeline perjalanan karier</li>
          <li>Domain .my.id / .web.id <strong>gratis</strong> (senilai Rp250rb+)</li>
          <li>SEO dasar — nama pena Anda ditemukan di Google</li>
        </ul>
        <a class="btn btn-gold" href="#founding">Amankan Slot Founding Author →</a>
      </div>

      <div class="price-card">
        <div class="plan-name">Homebase Starter</div>
        <p class="plan-tag">Cukup untuk mulai. Mengamankan yang paling penting dulu.</p>
        <div class="plan-price">Rp1,5 jt</div>
        <div class="plan-once">Sekali bayar · bisa upgrade kapan pun (bayar selisihnya saja)</div>
        <ul class="plan-list">
          <li>Rak Buku visual + Author Timeline</li>
          <li>Bio, kontak &amp; semua link karya Anda</li>
          <li><strong>Database Pembaca versi dasar</strong> — mulai amankan nomor WA pembaca</li>
          <li>Collaboration Kit ringkas</li>
          <li>Domain .my.id / .web.id <strong>gratis</strong></li>
          <li class="muted">Sistem Kabar Rilis — hanya di Author Homebase</li>
          <li class="muted">Ruang Bonus Pembaca — hanya di Author Homebase</li>
          <li class="muted">Peta Baca — hanya di Author Homebase</li>
        </ul>
        <a class="btn btn-ghost" href="https://wa.me/6285179595302?text=Halo%2C%20saya%20tertarik%20paket%20Homebase%20Starter" target="_blank" rel="noopener">Mulai dari Starter</a>
      </div>
    </div>

    <p class="price-note">Semua paket: dikerjakan tangan satu per satu, DP 50% — <strong>pelunasan setelah rumah Anda berdiri dan Anda melihatnya sendiri.</strong></p>
  </div>
</section>
```

- [x] **Step 2: Sisipkan section Assistant SETELAH pricing, SEBELUM guarantee**

```html
<!-- ============ ASSISTANT ============ -->
<section class="assistant" id="assistant">
  <div class="wrap">
    <div class="center narrow">
      <span class="eyebrow">Setelah rumah berdiri</span>
      <h2>MarkasAuthor Assistant — remote control lewat Telegram atau Dashboard</h2>
      <p class="lead">Update bab, draft kabar rilis, dan undo — tanpa minta developer. Opsional di semua tier. Website tetap milik Anda meski Assistant dihentikan.</p>
    </div>
    <div class="assistant-grid">
      <div class="assistant-card">
        <div class="plan-name">Care</div>
        <p class="plan-tag">Cukup untuk rilis rutin</p>
        <div class="plan-price">Rp149rb<small>/bulan</small></div>
        <ul class="plan-list">
          <li>Maks. 30 update berhasil / bulan</li>
          <li>Update bab + link di website</li>
          <li>Draft pesan Saluran WhatsApp</li>
          <li>Histori + Undo</li>
          <li>Support dasar</li>
        </ul>
        <a class="btn btn-ghost" href="https://wa.me/6285179595302?text=Halo%2C%20saya%20ingin%20tahu%20paket%20Assistant%20Care" target="_blank" rel="noopener">Tanya Care</a>
      </div>
      <div class="assistant-card featured">
        <div class="plan-badge">Paling sering dipilih</div>
        <div class="plan-name">Active</div>
        <p class="plan-tag">Untuk penulis yang rilis sering</p>
        <div class="plan-price">Rp299rb<small>/bulan</small></div>
        <ul class="plan-list">
          <li>Maks. 100 update berhasil / bulan</li>
          <li>Semua yang ada di Care</li>
          <li>Beberapa anggota tim</li>
          <li>Variasi copy lintas kanal</li>
          <li>Laporan penggunaan bulanan</li>
          <li>Prioritas support</li>
        </ul>
        <a class="btn btn-gold" href="https://wa.me/6285179595302?text=Halo%2C%20saya%20ingin%20tahu%20paket%20Assistant%20Active" target="_blank" rel="noopener">Tanya Active</a>
      </div>
      <div class="assistant-card">
        <div class="plan-name">Managed</div>
        <p class="plan-tag">Dampingan manusia + otomasi</p>
        <div class="plan-price">Rp499–750rb<small>/bulan</small></div>
        <ul class="plan-list">
          <li>Semua yang ada di Active</li>
          <li>Human review perubahan</li>
          <li>Bantuan kampanye rilis</li>
          <li>Optimasi CTA &amp; copy</li>
          <li>Laporan kinerja</li>
        </ul>
        <a class="btn btn-ghost" href="https://wa.me/6285179595302?text=Halo%2C%20saya%20ingin%20tahu%20paket%20Assistant%20Managed" target="_blank" rel="noopener">Tanya Managed</a>
      </div>
    </div>
    <p class="assistant-note">Telegram &amp; Dashboard menjalankan command yang diizinkan — dengan preview &amp; konfirmasi. Bukan CMS bebas, bukan AI yang mengedit HTML sendiri. Kuota dihitung dari update yang berhasil dipublikasikan.</p>
  </div>
</section>
```

- [x] **Step 3: Update Guarantee (45 menit materi)**

```html
<section class="guarantee">
  <div class="wrap">
    <div class="center narrow">
      <span class="eyebrow">Tanpa risiko di pihak Anda</span>
      <h2>Tiga janji yang kami tulis hitam di atas putih</h2>
    </div>
    <div class="g-grid">
      <div class="g-card">
        <div class="icon">⏱️</div>
        <h3>Live 7 Hari, atau Kembali 100%</h3>
        <p>Homebase Anda tayang maksimal 7 hari kerja setelah materi lengkap. Lewat dari itu, seluruh DP kami kembalikan penuh.</p>
      </div>
      <div class="g-card">
        <div class="icon">📜</div>
        <h3>Surat Kepemilikan Aset</h3>
        <p>Dokumen serah terima resmi: domain, akun Cloudflare, dan seluruh file dinyatakan 100% milik Anda. Kami tidak memegang apa pun sebagai sandera.</p>
      </div>
      <div class="g-card">
        <div class="icon">🪶</div>
        <h3>Waktu Materi ±45 Menit</h3>
        <p>Anda mengisi formulir: link karya, bio, foto, bonus awal, urutan baca. Sisanya urusan kami. Anda tetap fokus pada satu-satunya hal yang penting — menulis.</p>
      </div>
    </div>
  </div>
</section>
```

- [x] **Step 4: Update Founding (10 slot, WA benar)**

```html
<section class="founding" id="founding">
  <div class="wrap narrow center">
    <span class="eyebrow kicker">Kesempatan perdana — tidak akan diulang</span>
    <h2>Program Founding Authors</h2>
    <p class="lead">Kami baru memulai, dan kami butuh 10 penulis pertama sebagai studi kasus. Sebagai gantinya, Anda mendapat harga yang tidak akan pernah ada lagi.</p>

    <div class="founding-box">
      <div class="plan-name" style="color:var(--white)">Author Homebase — Harga Perdana</div>
      <div class="founding-price">
        <span class="price-strike">Rp3,5 jt</span>
        <span class="price-now">Rp2 jt</span>
      </div>
      <p class="founding-reason">Kenapa lebih murah? Sederhana dan jujur: kami butuh portofolio dan testimoni dari penulis sungguhan. Sebagai Founding Author, Anda mengizinkan homebase Anda kami tampilkan sebagai studi kasus. Setelah 10 slot terisi, harga kembali normal — <strong>dan tidak akan turun lagi.</strong></p>
      <div class="slot-bar"><div class="slot-fill"></div></div>
      <p class="slot-text"><strong>3 dari 10 slot terisi</strong> · slot ke-11 membayar harga penuh</p>
      <div class="mt-40">
        <a class="btn btn-gold" href="https://wa.me/6285179595302?text=Halo%2C%20saya%20ingin%20mengamankan%20slot%20Founding%20Author" target="_blank" rel="noopener">Amankan Slot Founding Author →</a>
      </div>
    </div>
  </div>
</section>
```

- [x] **Step 5: Verifikasi harga & WA**

```bash
grep -n "6285179595302\|6200000000000\|Penjaga Rumah\|Rp149\|Rp299\|10 slot\|3 dari 10" index.html
```

Expected: nomor `6285179595302` muncul berkali-kali; `620000…` **tidak** ada; `Penjaga Rumah` **tidak** ada; Care/Active harga ada; “3 dari 10 slot”.

- [x] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(lp): pricing, assistant packages, guarantee, founding sync"
```

---

### Task 6: FAQ + Final CTA + Footer + meta

**Files:**
- Modify: `index.html` (`#faq`, final CTA, footer, `<head>` meta)

- [x] **Step 1: Ganti FAQ lengkap**

```html
<section class="faq" id="faq">
  <div class="wrap narrow">
    <span class="eyebrow">Pertanyaan yang sering muncul</span>
    <h2>Sebelum Anda memutuskan</h2>

    <details>
      <summary>Apa bedanya ini dengan Linktree atau Lynk yang gratis?</summary>
      <p>Linktree adalah kamar kos: cepat, gratis, tapi bukan milik Anda dan tampilannya sama dengan jutaan orang lain. Homebase adalah rumah atas nama Anda sendiri — domain Anda, akun Anda, desain khas karya Anda, plus mesin yang Linktree tidak punya: database pembaca, kabar rilis, dan ruang bonus. Dan tidak ada logo platform lain yang menumpang di identitas Anda.</p>
    </details>
    <details>
      <summary>Apakah ini menyaingi atau melanggar aturan platform baca?</summary>
      <p>Tidak — justru sebaliknya. Homebase Anda tidak meng-host satu chapter pun dan tidak punya sistem baca berbayar. Semua tombol “Baca” mengarah langsung ke platform tempat karya Anda terbit. Fungsinya seperti etalase dan corong: menangkap pembaca baru dari Google dan media sosial, lalu mengantarkan mereka ke karya Anda. Pembaca di platform Anda bertambah, bukan berkurang. (Termasuk bila Anda menulis di app serial populer di Indonesia — prinsip non-kompetisi berlaku penuh.)</p>
    </details>
    <details>
      <summary>Saya gaptek. Apa saya sanggup mengurusnya?</summary>
      <p>Anda tidak perlu sanggup — itu tugas kami. Waktu Anda ±45 menit untuk mengisi formulir materi. Setelah live, homebase berjalan sendiri. Kalau nanti ingin update bab lewat chat tanpa minta developer, tersedia MarkasAuthor Assistant (Telegram atau Dashboard) mulai Rp149rb/bulan — sepenuhnya opsional; website tetap hidup tanpa itu.</p>
    </details>
    <details>
      <summary>Apa itu MarkasAuthor Assistant? Wajib?</summary>
      <p>Tidak wajib. Assistant adalah add-on operasional: update bab di website + draft kabar rilis lewat Telegram bot atau Dashboard web, dengan preview dan konfirmasi. Paket Care / Active / Managed. Jika dihentikan, website publik tetap live pada versi terakhir; yang berhenti hanya otomasi dan support aktif.</p>
    </details>
    <details>
      <summary>Benar tidak ada biaya bulanan hosting sama sekali?</summary>
      <p>Benar. Homebase di-deploy ke Cloudflare Pages di akun milik Anda — layanan kelas dunia yang gratis untuk kebutuhan seperti ini. Domain .my.id/.web.id kami gratiskan. Satu-satunya biaya berulang yang mungkin: perpanjangan domain (±Rp10–25rb/tahun) jika Anda memilih ekstensi lain seperti .com, atau langganan Assistant bila Anda mengambilnya.</p>
    </details>
    <details>
      <summary>Kalau suatu saat MarkasAuthor tutup, bagaimana nasib rumah saya?</summary>
      <p>Tidak terjadi apa-apa. Itulah inti dari kepemilikan: domain atas nama Anda, hosting di akun Anda, seluruh file diserahkan ke Anda dengan surat serah terima. Homebase Anda tetap berdiri walau kami hilang dari muka bumi. Coba tanyakan hal yang sama ke platform langganan mana pun.</p>
    </details>
    <details>
      <summary>Jadi sebenarnya... ini website, kan?</summary>
      <p>Secara teknis, ya. Tapi menyebutnya “website” seperti menyebut rumah sebagai “tumpukan batu bata”. Yang Anda dapatkan adalah sistem: database pembaca yang tumbuh sendiri, jalur kabar rilis, peta baca, etalase profesional untuk kolaborasi — dirangkai menjadi satu markas yang bekerja untuk karier Anda selama bertahun-tahun.</p>
    </details>
  </div>
</section>
```

- [x] **Step 2: Final CTA + Footer**

```html
<section class="final">
  <div class="wrap narrow">
    <h2 class="serif">Platform datang dan pergi.<br><em style="color:var(--accent)">Pembaca yang bisa Anda hubungi — itu selamanya.</em></h2>
    <p class="lead" style="margin:22px 0 36px">Suatu hari nanti, entah karena algoritma, adaptasi film, atau babak baru karier Anda — Anda akan bersyukur rumah ini sudah berdiri dari sekarang.</p>
    <a class="btn btn-gold" href="https://wa.me/6285179595302?text=Halo%2C%20saya%20penulis%20dan%20ingin%20tanya%20soal%20Author%20Homebase" target="_blank" rel="noopener">Ngobrol Dulu via WhatsApp →</a>
    <p class="hero-note">Tanya-tanya dulu boleh banget. Tidak ada tim sales yang mengejar Anda — yang balas chat adalah orang yang akan membangun rumah Anda.</p>
  </div>
</section>

<footer>
  <div class="foot-inner">
    <div><strong class="serif">Markas<span style="color:var(--gold-deep)">Author</span></strong> — Rumah digital milik penulis, selamanya.</div>
    <div>© 2026 MarkasAuthor</div>
  </div>
</footer>
```

- [x] **Step 3: Update meta description (soft multi-platform)**

Ganti di `<head>`:

```html
<title>MarkasAuthor — Rumah Digital yang Sepenuhnya Milik Penulis</title>
<meta name="description" content="Amankan pembaca setia di luar platform. MarkasAuthor membangun homebase digital yang sepenuhnya Anda miliki — database pembaca, kabar rilis, dan peta baca dalam satu rumah.">
<meta property="og:title" content="MarkasAuthor — Rumah Digital Milik Penulis">
<meta property="og:description" content="Follower 50 ribu. Akun hilang besok pagi. Berapa pembaca yang masih bisa Anda hubungi?">
```

(Meta sudah cocok — pastikan tidak ada frasa “khusus KBM”.)

- [x] **Step 4: Acceptance grep (checklist spec §14)**

```bash
# Harus NOL
grep -ni "penjaga rumah\|berdampingan dengan kbm\|untuk penulis kbm\|6200000000000\|baca di kbm\|karya di kbm" index.html && echo FAIL || echo PASS_forbidden

# Harus ADA
grep -n "6285179595302" index.html | wc -l
grep -n "id=\"cara-kerja\"\|id=\"assistant\"\|Rp149\|Rp299\|Rp499\|3 dari 10 slot\|±45\|platform tempat karya" index.html
```

Expected: `PASS_forbidden`; WA count ≥ 6; section ids + harga Assistant + founding 10 + 45 mnt + frasa multi-platform ada.

Soft KBM: opsional di FAQ #2 — **tidak wajib** sebut kata “KBM”; frasa “app serial populer di Indonesia” sudah cukup soft. Jangan tambah brand lain di hero.

- [x] **Step 5: Commit**

```bash
git add index.html
git commit -m "copy(lp): FAQ, CTA, footer multi-platform; fix WA links"
```

---

### Task 7: Smoke visual + Deploy Cloudflare Pages

**Files:**
- Deploy: `index.html` → CF Pages  
- Read-only: akun wrangler yang ter-login

- [ ] **Step 1: Buka LP lokal di browser**

Serve root:

```bash
npx --yes serve -l 4173 .
```

Buka `http://localhost:4173` (atau buka `index.html` langsung). Cek desktop + resize mobile:

- Nav “Cara Kerja” scroll ke `#cara-kerja`
- How-it-works 5 langkah terlihat
- Assistant 3 kartu + harga
- Founding “3 dari 10”
- Semua CTA WA buka `wa.me/6285179595302`
- Tidak ada “Penjaga Rumah” / “Untuk Penulis KBM”

Opsional screenshot via Playwright MCP bila tersedia.

- [ ] **Step 2: Cek auth & project Pages**

```bash
npx wrangler whoami
npx wrangler pages project list
```

Catat `project name` yang dipakai MarkasAuthor LP. Jika belum ada, buat:

```bash
npx wrangler pages project create markasauthor --production-branch master
```

(Gunakan nama yang user setujui bila beda.)

- [ ] **Step 3: Deploy**

Dari root repo (folder yang berisi `index.html`):

```bash
npx wrangler pages deploy . --project-name markasauthor --commit-dirty=true
```

> Hanya deploy file yang dibutuhkan bila project sudah punya ignore: pastikan `index.html` ikut ter-upload. Jika wrangler mengunggah terlalu banyak (`.git`, `docs/`), gunakan directory publish sementara:

```bash
mkdir -p /tmp/markasauthor-lp
cp index.html /tmp/markasauthor-lp/
npx wrangler pages deploy /tmp/markasauthor-lp --project-name markasauthor --commit-dirty=true
```

Expected: URL `https://<hash>.markasauthor.pages.dev` atau custom domain terikat.

- [ ] **Step 4: Verifikasi production**

```bash
curl -sL "https://markasauthor.pages.dev" | grep -E "cara-kerja|6285179595302|MarkasAuthor Assistant|3 dari 10" | head
```

(Sesuaikan host jika project name/domain beda.) Expected: string-string baru muncul.

- [ ] **Step 5: Commit catatan deploy (opsional) + status akhir**

Tidak wajib commit URL. Laporkan ke user:

- URL production
- Ringkas perubahan section
- Sisa: custom domain / ganti progress founding bila slot berubah

```bash
git status -sb
```

---

## Self-review vs spec

| Spec requirement | Task |
|---|---|
| Multi-platform, brand minim di hero | Task 2, 3 |
| Soft mention platform di FAQ/truth | Task 3, 6 |
| How it works 5 langkah | Task 4 |
| For readers multi-platform note | Task 4 |
| Pricing Signature / Homebase / Starter | Task 5 |
| Assistant Care/Active/Managed | Task 5 |
| Founding 10 slot @ Rp2jt | Task 5 |
| WA 6285179595302 | Task 5, 6 |
| Guarantee 7 hari + ownership + ~45 mnt | Task 5 |
| Hapus Penjaga Rumah / KBM-only footer | Task 6 |
| Deploy CF Pages | Task 7 |
| Acceptance grep checklist | Task 6 Step 4, Task 7 |

Tidak ada placeholder TBD di langkah. Single-file scope — tidak split berlebih.

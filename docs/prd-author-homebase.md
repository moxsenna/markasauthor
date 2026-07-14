# PRD — Author Homebase (Produk Hero)

| | |
|---|---|
| **Produk** | Author Homebase |
| **Harga** | Rp3.500.000 setup awal (cicilan 2× Rp1.750.000; Founding Authors pilot: Rp2.000.000, 3 slot) + add-on bulanan MarkasAuthor Assistant (lihat §7) |
| **Posisi dalam lini** | **Produk hero** — satu-satunya yang dipromosikan aktif di semua materi marketing |
| **Target produksi** | ≤ 4 hari kerja per situs (setelah materi lengkap) |
| **Status dokumen** | Draft v2 — 2026-07-13 |

---

## 1. Ringkasan & Tujuan Produk

Author Homebase adalah rumah digital lengkap seorang penulis KBM: identitas, katalog, **sistem pengumpulan database pembaca**, jalur kabar rilis, peta baca, etalase kolaborasi, dan—bila berlangganan—**MarkasAuthor Assistant** (add-on operasional lintas tier MarkasAuthor: Starter, Author Homebase, Signature) sebagai remote control lewat Telegram atau Dashboard web. Ini bukan "website profil" — ini sistem dengan **satu loop inti** yang harus bekerja:

```
Bonus konten menarik pembaca → pembaca memberi persetujuan & kontak →
database milik penulis tumbuh → penulis mengabarkan chapter baru via Telegram →
website diperbarui + pesan rilis dibuat → penulis memposting ke Saluran WhatsApp →
pembaca kembali membaca di KBM → hasilnya terukur
```

Setiap keputusan desain dan teknis di dokumen ini melayani loop tersebut.

### Tujuan bisnis
1. Produk utama pencetak pendapatan (margin tertinggi per jam kerja).
2. Pintu masuk pendapatan berulang MarkasAuthor Assistant (target: ≥50% klien hero berlangganan dalam 60 hari).
3. Studi kasus yang bisa diukur: "situs ini mengirim X klik ke KBM per bulan" — amunisi pitch partnership ke KBM.

### Non-tujuan
- Tidak meng-host konten cerita/chapter dalam bentuk apa pun.
- Tidak memproses pembayaran apa pun (tidak menyentuh ekonomi koin KBM).
- Tidak menyediakan CMS web bebas atau akses edit source code. Self-service dibatasi pada command allowlist lewat Telegram **atau** Dashboard (hasil setara).
- Tidak membuat AI otonom yang mengedit HTML, login ke KBM, mengambil data dengan scraping, atau memublikasikan perubahan tanpa konfirmasi penulis.
- Tidak mengganti WhatsApp sebagai kanal distribusi pembaca. Telegram dipakai untuk operasional penulis; WhatsApp tetap dipakai untuk kabar rilis ke pembaca.

---

## 2. Pengguna

| Persona | Kebutuhan | Ukuran keberhasilan bagi mereka |
|---|---|---|
| **Penulis** — KBM aktif, ≥3 karya / ada seri, penghasilan signifikan, sadar risiko platform | Memperbarui website tanpa dashboard rumit; mengurangi pekerjaan berulang tiap rilis; memiliki kontak pembaca; tampil profesional ke pihak luar | Satu chat menghasilkan update website + materi rilis; database dan klik ke KBM tumbuh serta terukur |
| **Pembaca setia** | Tidak ketinggalan update; bonus eksklusif; tahu urutan baca | Melihat kabar rilis di Saluran WhatsApp; akses materi pelengkap yang tak ada di app |
| **Pembaca baru** (dari Google/medsos) | Kenalan dengan penulis & karyanya; tahu mulai baca dari mana | Dari googling judul → paham universe → klik baca di KBM |
| **Penerbit/brand/media** | Riset & kontak penulis dengan cepat | Semua info dalam 1 halaman + aset siap unduh |

---

## 3. Scope — Struktur & Fitur

Situs **multi-halaman**: Beranda, Karya (per seri bila perlu), Bonus, Kolaborasi.

### 3.1 Beranda
Semua elemen Starter (hero identitas, badge KBM, rak buku, timeline) dengan peningkatan:
- **Rak Buku tanpa batas jumlah karya**, filter per seri/genre bila >8 karya.
- **Author Timeline lengkap** dengan visual (ikon milestone, cover karya terkait).
- Section "Chapter Terbaru": kartu update rilis terakhir (judul chapter + tanggal + tombol "Baca di KBM →"). **Hanya pengumuman — bukan konten.**

### 3.2 Sistem Kabar Rilis ⭐ (fitur pembeda #1 — WhatsApp-first)
**Kebutuhan:** saat penulis rilis chapter baru, pembaca mendapat kabar tanpa penulis menulis ulang pesan untuk banyak kanal. WhatsApp tetap jalur distribusi utama karena di sanalah kebiasaan pembaca berada; Telegram tidak menggantikannya.

- **Jalur utama: Saluran WhatsApp (WA Channel) milik penulis.** Pembaca mengikuti sekali via tombol di situs; penulis memposting kabar rilis (judul chapter + teaser 1 kalimat — **tanpa isi cerita** — + link KBM) → pengikut menerima update.
- **Jalur kepemilikan (asuransi):** formulir nama + nomor WA → Google Sheet milik klien (lihat §3.4). Saluran WA tetap platform Meta (pengikut tak bisa diekspor) — Sheet inilah database yang benar-benar dimiliki penulis.
- MarkasAuthor Assistant membuat template pesan rilis dari data karya terbaru. Pada MVP, penulis tetap meninjau, menyalin, lalu mempostingnya sendiri ke Saluran WhatsApp.
- Kolom email pada formulir bersifat opsional. Telegram Channel untuk pembaca boleh ditambahkan sebagai kanal sekunder, tetapi bukan deliverable inti.
- Blast WA personal massal ke nomor di Sheet, auto-post ke WhatsApp, dan pesan proaktif ke pembaca **bukan** bagian MVP.
- **Acceptance:** posting uji di Saluran WA diterima akun penguji; semua link mengarah ke halaman KBM yang benar; pesan tidak memuat isi chapter.

### 3.3 MarkasAuthor Assistant ⭐ (fitur recurring — operasional penulis)
**Kebutuhan:** setelah menerbitkan chapter di KBM, penulis dapat memperbarui website dan menyiapkan kabar rilis dari chat atau Dashboard, tanpa meminta developer mengedit manual.

**Catatan lini produk:** MarkasAuthor Assistant (Telegram) dan **Dashboard Penulis** tersedia sebagai add-on operasional di **semua tier** (Starter, Author Homebase, Signature). Yang membedakan tier adalah **matrix capability** (Starter ⊂ Hero ⊂ Signature), bukan ada/tidaknya bot.

**Dual surface:** setiap command allowlist harus bisa dijalankan dari Telegram **atau** Dashboard web dengan hasil setara. Dashboard bukan CMS bebas — hanya form/aksi yang di-allowlist, dengan preview + konfirmasi yang sama.

**Posisi produk:** Telegram dan Dashboard adalah back office/remote control untuk penulis. WhatsApp tetap front office/distribusi untuk pembaca. Fitur ini adalah add-on bulanan lintas tier, bukan syarat agar situs publik tetap bisa dibuka.

#### Scope MVP
- Onboarding melalui deep link/kode aktivasi sekali pakai yang mengikat `telegram_user_id` ke `author_id`. Username Telegram tidak dipakai sebagai identitas utama karena dapat berubah.
- Menu awal: `Update Bab`, `Riwayat`, `Batalkan Perubahan`, dan `Bantuan`.
- Command `Update Bab` menerima karya, nomor bab terbaru, URL share resmi KBM, dan tanggal rilis. Input awal dibuat terstruktur; bahasa alami menjadi lapisan bantu, bukan satu-satunya jalur.
- Bot memvalidasi bahwa karya milik penulis tersebut, nomor bab masuk akal, dan URL memakai skema HTTPS serta domain yang diizinkan.
- Bot menampilkan preview perubahan dan tombol inline `✅ Publikasikan`, `✏️ Edit`, `❌ Batalkan`. Tidak ada perubahan publik sebelum konfirmasi eksplisit.
- Setelah dikonfirmasi, satu command menghasilkan: update bab/link/tanggal di website, entri riwayat rilis, dan draft pesan Saluran WhatsApp siap salin.
- Setiap perubahan memiliki audit log dan versi sebelumnya. `Undo` membuat versi balik baru; histori lama tidak dihapus.
- AI hanya boleh: mengekstrak data ke schema command, mendeteksi kekurangan/ambiguitas, dan membuat draft copy. Eksekusi selalu dilakukan oleh fungsi deterministik yang di-allowlist.

**Batas MVP:** hanya chat pribadi bot; hanya penulis/anggota tim yang diundang; hanya update bab terbaru dan pembuatan copy rilis. Tambah karya, edit profil/bonus/acara, voice note, gambar, analytics interaktif, dan Mini App masuk roadmap (§10).

**Acceptance:** alur aktivasi → command → preview → konfirmasi → website berubah → draft WA terbentuk selesai end-to-end dari HP; command `Batalkan` tidak mengubah data; `Undo` mengembalikan versi sebelumnya.

#### Matrix capability (ringkas)

| Capability | Starter | Hero | Signature |
|---|:---:|:---:|:---:|
| Update bab + draft WA + undo + riwayat | ✓ | ✓ | ✓ |
| Database pembaca (view) | ✓ | ✓ | ✓ + segment universe |
| Chapter Terbaru / bonus / peta / collab kit ops | — | ✓ | ✓ |
| Universe tokoh/timeline/trivia ops | — | — | ✓ |

### 3.4 Ruang Bonus Pembaca ⭐ (fitur pembeda #2 — mesin pertumbuhan database)
**Kebutuhan:** memberi pembaca alasan meninggalkan kontak.

- Halaman `/bonus` berisi katalog konten eksklusif: deleted scene, POV ekstra, profil karakter, trivia, catatan penulis. (Konten dari klien; kita yang tata.)
- **Gate:** konten terkunci di balik formulir kontak (nama + nomor WA, email opsional). Mekanisme: submit → tersimpan ke Google Sheet milik klien → pembaca langsung diarahkan ke halaman bonus "rahasia" (URL non-index + token statis di query). Cukup aman untuk kasus ini, tanpa backend, tanpa email.
- Halaman terima kasih menyatukan dua aksi: "buka bonusmu" + "ikuti Saluran WA supaya tidak ketinggalan chapter baru".
- **Batas konten:** bonus = materi pelengkap, **bukan chapter/lanjutan cerita**. Ini garis non-kompetisi dengan KBM dan harus dijelaskan ke klien di onboarding.
- **Acceptance:** alur submit formulir → baris baru di Google Sheet → halaman bonus terbuka, teruji end-to-end dari HP (Chrome Android + Safari iOS).

### 3.5 Peta Baca (Reading Order)
- Halaman/section per universe: diagram urutan baca (Novel 1 → Novel 2 → Spin-off A…), visual vertikal mobile-friendly.
- Setiap node = cover mini + judul + tombol "Baca di KBM →".
- Mendukung >1 universe.
- **Acceptance:** pembaca baru yang dites (1 orang awam) bisa menjawab "mulai baca dari mana" dalam <30 detik.

### 3.6 Collaboration Kit (lengkap)
- Halaman `/kolaborasi`: bio pendek + panjang, foto HD (unduh), statistik pembaca (total reads, followers, pencapaian), daftar karya + genre, jenis kerja sama yang dibuka, kontak manajemen.
- Tombol "Unduh Collaboration Kit (PDF)" — PDF 1–2 halaman di-generate saat build, disimpan statis.
- **Acceptance:** PDF terunduh, tampil benar, ≤ 2 MB.

### 3.7 SEO & Distribusi
- Semua standar Starter, plus: halaman per-karya ringan (judul + sinopsis pendek + tombol KBM) untuk menangkap pencarian judul; OG image custom per halaman utama; structured data `Person`, `Book`, `BreadcrumbList`.
- **Acceptance:** sitemap dikirim, halaman dapat diindeks, structured data valid, Search Console aktif, dan pencarian bermerek nama pena/judul dapat diverifikasi. Tidak ada jaminan peringkat atau tenggat halaman pertama Google.

### 3.8 Analytics
- Cloudflare Web Analytics + event klik keluar ke KBM (penanda `?ref=homebase` pada link bila KBM tidak menghapus query param — verifikasi saat build pertama).
- Tujuan: klien (dan kita) bisa melihat "situs ini mengirim X klik ke KBM".

---

## 4. Arsitektur Teknis

Situs publik tetap memakai satu template codebase untuk semua tier (lihat PRD Starter §4). Add-on MarkasAuthor Assistant menambahkan backend terbatas dan database operasional; backend ini **tidak** mengubah AI menjadi CMS bebas.

```text
Penulis → (Telegram Bot API | Dashboard web) → auth/membership → …
        → command terstruktur/AI parser → validasi → preview → konfirmasi
        → action service deterministik → database + versi + audit log
        → publish worker → website publik → hasil dikirim kembali ke penulis

Pembaca → website publik → form consent → Google Sheet milik klien
        → mengikuti Saluran WhatsApp → klik kabar rilis → KBM
```

| Komponen | Pilihan | Catatan |
|---|---|---|
| Situs publik | Template yang sama; output statis atau read-only projection dari database | Tetap cepat, mobile-first, dan tidak memiliki area admin publik |
| Telegram connector | **Telegram Bot API resmi** via HTTPS webhook | Gunakan `secret_token` dan verifikasi header `X-Telegram-Bot-Api-Secret-Token`; batasi `allowed_updates` ke tipe yang dibutuhkan |
| Aktivasi & otorisasi | Kode aktivasi sekali pakai → `telegram_user_id` → membership author | Mendukung satu atau beberapa anggota tim; setiap aksi selalu membawa `author_id` dari server, bukan dari teks pengguna |
| Command engine | State machine + schema command yang di-allowlist | MVP: `update_latest_chapter`, `show_history`, `undo_change`; input ambigu berhenti di draft |
| AI parser/copywriter | Structured output dengan confidence threshold | Tidak punya akses langsung ke database, source code, deployment credential, atau tool arbitrer |
| Action service | Fungsi deterministik, transactional, idempotent | Contoh: `updateLatestChapter(authorId, workId, chapter, url, publishedAt)` |
| Database operasional | PostgreSQL terkelola | Source of truth untuk `authors`, `author_memberships`, `works`, `releases`, `commands`, `content_versions`, dan `audit_logs` |
| Publish worker | Queue/job runner dengan retry terbatas | Membuat projection/build baru; status `pending`, `published`, atau `failed`; kegagalan tidak boleh mengubah versi live |
| Kontak pembaca | Google Sheet milik klien melalui endpoint terautentikasi | Dipisahkan dari database operasional bot; tidak disalin ke model AI |
| PDF Collab Kit | Generate saat build, hasil statis di `/assets` | Tanpa layanan PDF runtime |
| Halaman bonus | Statis, `noindex`, URL bertoken | Bukan pengganti autentikasi untuk materi sensitif/berbayar |
| Secrets & observability | Secret manager, structured logs, health check, alerting | Token bot, credential deploy, dan credential database tidak boleh masuk repo atau log |

### 4.1 Siklus command aman
1. Telegram mengirim update ke webhook HTTPS; server menolak request dengan secret header yang salah.
2. Sistem membaca `telegram_user_id`, mencari membership aktif, lalu menetapkan `author_id` dari server.
3. State machine/AI mengubah pesan menjadi salah satu schema command yang diizinkan. Perintah di luar allowlist ditolak atau diarahkan ke bantuan manusia.
4. Validator memeriksa kepemilikan karya, tipe data, urutan bab, URL, status langganan, dan duplikasi request.
5. Bot menampilkan diff/preview. Draft kedaluwarsa setelah periode tertentu dan belum mengubah data publik.
6. Tombol konfirmasi menghasilkan callback sekali pakai. Callback ganda harus idempotent dan tidak boleh menerbitkan dua rilis.
7. Action service menulis perubahan, versi sebelumnya, dan audit event dalam satu transaksi.
8. Publish worker memperbarui website. Hanya build sukses yang dipromosikan menjadi versi live.
9. Bot mengirim hasil dan link website. Jika publish gagal, data ditandai `failed`, pengguna diberi tahu, dan sistem melakukan retry/eskalasi.
10. `Undo` membuat perubahan kompensasi dari versi terakhir yang sah; audit log tetap append-only.

### 4.2 Invarian keamanan
- Model AI **tidak pernah** menulis HTML/source code atau menjalankan shell/deploy secara langsung.
- Semua query/mutasi dibatasi `author_id`; uji cross-tenant wajib ada.
- Tidak ada publish tanpa konfirmasi manusia pada MVP.
- Aksi sensitif (hapus karya, ubah domain, ubah anggota tim, ekspor data) tidak tersedia di chat MVP.
- Semua webhook, callback, dan job menggunakan idempotency key.
- Token aktivasi sekali pakai, berumur pendek, disimpan dalam bentuk hash, dan tidak boleh muncul di analytics/log.
- Backup dan restore database diuji; rollback deploy tidak bergantung pada percakapan Telegram.

**Batas arsitektur:** bila klien tidak mengambil atau menghentikan add-on, website publik tetap live pada versi terakhir dan aset milik klien tetap dapat diserahterimakan. Akses bot dan otomasi dihentikan; tidak ada vendor lock-in terhadap konten situs.

---

## 5. Alur Produksi & Serah Terima

1. **Onboarding (±45 menit klien):** formulir materi + sesi khusus membahas bonus awal (minimal 2), urutan baca, statistik Collab Kit, persetujuan komunikasi pembaca, dan pilihan langganan Assistant.
2. **Setup aset milik klien:** domain, Cloudflare, Google Sheet kontak, dan Saluran WhatsApp. Seluruh proses utama harus bisa diikuti klien dari HP.
3. **Build situs:** target ≤ 4 hari kerja. Urutan: struktur & konten → loop kontak (formulir → Sheet → halaman bonus → Saluran WA) → peta baca → Collab Kit PDF → SEO/OG.
4. **Aktivasi Assistant (jika berlangganan):** kirim deep link/kode sekali pakai, ikat Telegram user ID, pilih karya awal, dan lakukan command uji.
5. **Uji loop inti + Assistant** (checklist §6) — wajib sebelum review klien.
6. **Review klien:** 2× putaran revisi untuk setup awal.
7. **Serah terima:** Surat Kepemilikan Aset + paket tutorial video (≤20 menit total, direkam dari HP): update bab lewat Telegram, posting copy ke Saluran WA, membuka daftar kontak di Google Sheet, membaca analytics, dan menggunakan Undo.
8. **H+14 dan H+30:** cek aktivasi, kegagalan command, jumlah rilis, serta offer upgrade/downgrade paket bulanan berdasarkan pemakaian nyata.

**SLA:** live ≤ 7 hari kerja sejak materi lengkap, atau DP kembali 100%.

**SLA Assistant MVP:** target publish ≤ 2 menit setelah konfirmasi pada kondisi normal. Gangguan Telegram, provider cloud, atau deploy dicatat sebagai insiden pihak ketiga; status dan workaround harus dikomunikasikan kepada klien.

---

## 6. Kriteria Penerimaan

**Loop inti (blocking — tanpa ini tidak boleh serah terima):**
- [ ] Submit formulir dari situs → baris baru di Google Sheet klien → halaman bonus terbuka. Diuji end-to-end minimal 2×, dari HP.
- [ ] Posting kabar rilis uji di Saluran WA diterima pengikut uji & semua link mengarah ke halaman KBM yang benar.
- [ ] Klien mendemonstrasikan posting kabar rilis sendiri dari HP-nya.

**MarkasAuthor Assistant (blocking hanya untuk klien add-on):**
- [ ] Kode aktivasi hanya dapat dipakai sekali, kedaluwarsa sesuai konfigurasi, dan mengikat Telegram user ID yang benar.
- [ ] Pengguna yang belum terikat atau membership-nya nonaktif tidak dapat membaca/mengubah data author.
- [ ] Command update bab menampilkan nilai lama vs baru, URL, tanggal, serta draft copy sebelum publish.
- [ ] `❌ Batalkan` dan draft kedaluwarsa tidak mengubah database maupun website.
- [ ] `✅ Publikasikan` mengubah database, riwayat rilis, website, dan menghasilkan copy Saluran WA; hasil live tampil ≤ 2 menit dalam pengujian normal.
- [ ] Callback/command duplikat tidak menghasilkan rilis ganda.
- [ ] Uji cross-tenant membuktikan author A tidak dapat melihat atau mengubah karya author B.
- [ ] `Undo` memulihkan versi publik sebelumnya tanpa menghapus audit log.
- [ ] Webhook dengan secret header salah ditolak; token bot/credential tidak muncul di repo, respons bot, atau log aplikasi.
- [ ] Simulasi deploy gagal mempertahankan versi live lama, memberi status gagal yang jelas, dan dapat di-retry oleh admin.

**Standar:**
- [ ] Semua deep link KBM diuji manual.
- [ ] Peta baca lolos uji "pembaca awam <30 detik".
- [ ] PDF Collaboration Kit terunduh dan benar.
- [ ] Lighthouse mobile: Perf ≥ 95, SEO ≥ 95, A11y ≥ 90.
- [ ] Zero konten cerita ter-host; halaman bonus hanya materi pelengkap.
- [ ] Analytics aktif + klik-ke-KBM terukur.
- [ ] Consent pembaca menyebut tujuan penggunaan nomor WA, kanal komunikasi, cara berhenti, dan tautan kebijakan privasi.
- [ ] Baris kontak menyimpan minimal timestamp, sumber formulir, versi consent, dan status aktif/berhenti.
- [ ] Alur permintaan akses/koreksi/penghapusan data diuji dengan satu data dummy.
- [ ] Surat Kepemilikan Aset ditandatangani.

---

## 7. Model Komersial Bulanan & Di Luar Scope

### 7.1 Setup awal
- Harga Author Homebase tetap Rp3.500.000 untuk setup aset, situs, reader capture, Saluran WhatsApp, peta baca, Collab Kit, dan analytics.
- Domain, akun Cloudflare, Google Sheet kontak, Saluran WhatsApp, konten, dan export data situs disiapkan atas nama/milik klien.
- Biaya bulanan membeli **kemudahan operasional, AI terkontrol, backend, histori, monitoring, dan support**—bukan hak untuk mempertahankan website. Website tetap live pada versi terakhir bila langganan berhenti, selama akun hosting/domain tetap aktif.

### 7.2 Paket MarkasAuthor Assistant

Paket berlaku lintas tier; capability mengikuti matrix tier situs klien.

| Paket | Harga | Batas wajar | Cakupan |
|---|---:|---:|---|
| **Care** | Rp149.000/bulan | Maks. 30 update berhasil/bulan | Update bab + link, draft kabar rilis, histori, Undo, hosting/monitoring backend, support dasar |
| **Active** | Rp299.000/bulan | Maks. 100 update berhasil/bulan | Semua Care + beberapa anggota tim, variasi copy lintas kanal, laporan penggunaan bulanan, prioritas support; fitur lanjutan diaktifkan sesuai roadmap |
| **Managed** | Rp499.000–750.000/bulan | Sesuai proposal | Semua Active + human review, bantuan kampanye rilis, optimasi CTA/copy, dan laporan kinerja |

**Aturan billing/fair-use:**
- Yang dihitung sebagai update adalah aksi terkonfirmasi yang berhasil dipublikasikan. Draft, edit, batal, retry akibat kegagalan sistem, dan pertanyaan bantuan tidak mengurangi kuota.
- Tidak ada paket unlimited. File besar, permintaan di luar schema, atau pemakaian model berlebihan dapat ditahan dan diarahkan ke support.
- Biaya domain, provider pesan berbayar, atau layanan pihak ketiga premium dipisahkan dan disetujui klien sebelum dibebankan.
- Saat berhenti: akses bot dinonaktifkan, data situs dan riwayat dapat diekspor, versi publik terakhir tidak dihapus, dan kebijakan retensi §8 berlaku.

### 7.3 Di luar scope MVP

| Permintaan | Jawaban |
|---|---|
| Halaman semesta/tokoh/peta/playlist | Signature Universe |
| Character/Universe Wiki | Add-on (Rp1,5jt / Rp2jt) |
| CMS web bebas / edit source code | Tidak; Telegram & Dashboard hanya menjalankan command allowlist |
| Telegram Mini App (UI visual lanjutan) | Roadmap, bukan MVP (lihat §10); Dashboard allowlist beda dari Mini App |
| Voice note, OCR screenshot/poster, dan upload cover via bot | Roadmap setelah command teks stabil |
| Login/scraping/otomasi publikasi ke KBM | Tidak; penulis tetap menerbitkan di KBM dan mengirim URL share resmi |
| Auto-post atau blast WhatsApp personal | Tidak dalam MVP; hanya copy siap tempel ke Saluran WA |
| Toko/merchandise/pembayaran | Tidak — link keluar ke Trakteer/Karyakarsa diperbolehkan |
| AI menjalankan tool umum, shell, atau mengedit HTML | Tidak, tanpa pengecualian |

## 8. Privasi, Keamanan & Risiko

### 8.1 Privasi dan tata kelola data
Produk harus mengikuti prinsip UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi dan kebijakan platform yang berlaku. Pembagian peran pengendali/prosesor, instruksi pemrosesan, subprosesor, retensi, dan prosedur insiden wajib ditegaskan dalam kontrak dan ditinjau secara hukum sebelum scale.

**Pemisahan data:**
- **Data pembaca:** nama, nomor WA, email opsional, timestamp, sumber, versi consent, dan status opt-out berada di Google Sheet milik klien. MarkasAuthor tidak memakainya untuk melatih model dan tidak mengirim blast tanpa instruksi serta dasar pemrosesan yang sah.
- **Data operasional penulis:** Telegram user ID, membership author, isi command, URL karya, draft copy, versi konten, audit log, dan metadata teknis berada di database MarkasAuthor Assistant.
- Nomor WA pembaca dan isi Sheet tidak dikirim ke model AI. Parser hanya menerima data minimum yang diperlukan untuk command penulis.

**Consent minimum pada form pembaca:**
> “Saya setuju menerima kabar karya dan bonus dari [Nama Penulis] melalui WhatsApp. Saya dapat berhenti kapan saja. Lihat Kebijakan Privasi.”

**Kewajiban produk:**
- Kebijakan privasi menjelaskan tujuan, data yang dikumpulkan, penerima/subprosesor, masa simpan, hak subjek data, kanal permintaan, dan mekanisme opt-out.
- Permintaan akses, koreksi, penarikan persetujuan, dan penghapusan memiliki prosedur serta SLA internal.
- Data command/versi disimpan selama langganan + maksimal 90 hari setelah berhenti untuk export/recovery, lalu dihapus atau dianonimkan; security logs maksimal 180 hari kecuali diperlukan untuk investigasi/kewajiban hukum.
- Backup mengikuti retensi yang sama. Penghapusan harus mencakup backup pada siklus expiry berikutnya.
- Enkripsi in transit, akses least-privilege, MFA admin, secret manager, audit admin, dan restore test wajib sebelum pilot berbayar.
- Insiden privasi/keamanan memiliki runbook untuk containment, assessment, komunikasi klien, dan notifikasi sesuai tenggat hukum yang berlaku.

Referensi normatif: [Telegram Bot API](https://core.telegram.org/bots/api) dan [UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi](https://jdih.komdigi.go.id/produk_hukum/view/id/832/t/undangundang%2Bnomor%2B27%2Btahun%2B2022).

### 8.2 Register risiko awal

| Risiko | Dampak | Mitigasi / trigger keputusan |
|---|---|---|
| Penulis enggan memasang Telegram | Aktivasi dan konversi bulanan rendah | Assisted onboarding; ukur activation rate; tawarkan update managed, bukan membangun WhatsApp unofficial |
| Command ambigu/salah dipahami AI | Informasi salah terbit | Schema + validasi + preview + konfirmasi; fallback menu terstruktur; confidence threshold |
| Cross-tenant data leak | Kritis: data/situs klien lain terbuka | Server-derived `author_id`, row-level policy, test isolasi wajib, audit akses |
| Token bot/credential bocor | Pengambilalihan bot/deploy | Secret manager, rotasi, least privilege, redaction log, incident runbook |
| Telegram/provider cloud down | Update tertunda | Queue, retry, status page, jalur update manual oleh admin; website publik tetap tersedia |
| Build/deploy gagal | Website tidak terbarui atau regresi | Atomic publish, health check, pertahankan versi live lama, rollback teruji |
| Callback ganda/retry webhook | Rilis atau biaya terduplikasi | Idempotency key per update/callback/action |
| Biaya AI/support melebihi ARPU | Margin bulanan negatif | Kuota update, model routing, structured-first, metering per tenant, review harga setelah pilot |
| Database pembaca tanpa consent/opt-out | Risiko hukum dan reputasi | Consent versioning, privacy policy, opt-out/delete workflow, audit dummy sebelum launch |
| Website tidak benar-benar mendorong klik | Retensi rendah meski bot dipakai | Ukur klik-ke-KBM, kontak, dan posting rilis; optimasi bonus/CTA, bukan menambah fitur bot |
| Ketergantungan Telegram | Roadmap terhambat perubahan platform | Messaging adapter tipis; logika bisnis/action service tidak bergantung pada payload Telegram |

## 9. Metrik Keberhasilan Produk

**Outcome situs (90 hari pasca-launch):**
- Database pembaca: target awal ≥ 100 kontak WA ber-consent di Google Sheet + pengikut Saluran WA bertumbuh. Target divalidasi ulang setelah 3 pilot; tidak dijanjikan sebagai garansi.
- ≥ 2 kabar rilis diposting di Saluran WA.
- Klik keluar ke KBM terukur dan dilaporkan ke klien minimal 1×.

**Adopsi Assistant (per bulan):**
- Activation rate: ≥ 80% pelanggan add-on menyelesaikan command pertama dalam 7 hari.
- ≥ 60% pelanggan add-on melakukan minimal 2 update berhasil/bulan.
- Command success rate ≥ 95%; median waktu konfirmasi → live ≤ 2 menit.
- Undo rate < 5%; setiap undo ditinjau untuk menemukan masalah parser/UX.
- Cross-tenant/security incident: 0.
- Konversi setup → langganan dalam 60 hari ≥ 50%; churn bulanan dan biaya support per tenant dipantau sejak pilot.

## 10. Roadmap MarkasAuthor Assistant

| Fase | Scope | Exit criteria |
|---|---|---|
| **0 — Fondasi production** | Form → Sheet nyata, consent/privacy, analytics klik, situs dan deploy pipeline | Satu author production lolos loop inti §6 |
| **1 — MVP Telegram terstruktur** | Aktivasi, update bab/link, preview/confirm, database, audit log, Undo, draft WA | 3 author pilot; ≥95% command success; zero cross-tenant incident |
| **2 — AI bahasa alami** | Pesan bebas → schema yang sama, pertanyaan klarifikasi, variasi caption; tambah command karya/bonus/acara/profil secara bertahap | Ambiguous publish <2%; support load sesuai margin paket |
| **3 — Multimodal & insight** | Voice note, cover/poster/dokumen, laporan analytics via chat | Akurasi ekstraksi dan biaya per tenant memenuhi threshold pilot |
| **4 — Telegram Mini App** | Daftar karya, kalender rilis, statistik, histori/rollback, upload aset, pengaturan anggota tim | Chat mulai padat/kompleks dan ≥30% user meminta tampilan visual |
| **5 — Kanal admin tambahan (opsional)** | Evaluasi WhatsApp Cloud API resmi sebagai connector premium, tanpa mengubah action service | Ada demand berbayar yang cukup untuk menutup biaya/compliance |

**Prinsip roadmap:** jangan membangun Mini App karena terlihat lebih lengkap. Bangun ketika bukti penggunaan menunjukkan chat tidak lagi efisien untuk tugas visual atau multi-item; sampai saat itu, Telegram chat + tombol adalah permukaan produk utama.

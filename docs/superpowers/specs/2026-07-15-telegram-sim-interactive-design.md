# Design — Simulasi Telegram Interaktif (Signature)

| Field | Value |
|-------|--------|
| **Date** | 2026-07-15 |
| **Tier** | Signature Universe (`tiers/signature-universe`) |
| **Page** | `/untuk-penulis` |
| **Goal** | Simulasi Telegram lebih jelas dan interaktif agar presenter/penulis bisa mencoba alur ops tanpa bingung |
| **Approach** | Hybrid: polish chat UI + state machine ringan + guide strip |
| **Out of scope** | Telegram Bot API, auth allowlist nyata, CRUD semesta penuh, port ke Starter/Hero di sprint ini, e2e otomatis |

## 1. Context

Existing mock: `TelegramMock.astro` — phone frame, menu Update Bab / Riwayat / Bantuan, alur rilis bab + salin WA, `localStorage` via `demo-store.ts`.

Pain:

- Alur kurang jelas (user tidak tahu langkah demo)
- Interaksi kaku (wipe dynamic, list tombol, tanpa typing/composer/command)
- Fitur tipis vs matrix dual-surface (Dashboard + Telegram)

## 2. Goals & success

1. Presenter bisa jalankan alur **Update Bab** end-to-end tanpa penjelasan lisan panjang.
2. Chat terasa “bot Telegram”: typing, keyboard 2 kolom, composer, command, history append.
3. Aksi tambahan mirror dashboard: Status, Bonus toggle, Karya status, Semesta trivia.
4. Label **simulasi** selalu terlihat — tidak dikira bot live.

## 3. UX shell

### 3.1 Page (`untuk-penulis.astro`)

- Intro copy lebih actionable (apa yang bisa dicoba).
- **Guide strip** di atas phone:
  - Judul “Panduan coba”
  - Satu kalimat alur demo utama (Update Bab → … → salin WA)
  - Chip pintasan opsional ke alur (Update / Status / Bonus) — chip memicu flow yang sama dengan keyboard

### 3.2 Phone frame

- Status strip kecil: waktu placeholder + badge “Simulasi”
- Header bot: avatar, **MarkasAuthor Assistant**, subtitle `online · simulasi`
- **Step hint bar** di bawah header: mis. `Menu utama` / `Update bab · 2/4 Judul`
- Chat area scrollable, height ~520px (mobile-friendly)
- **Inline keyboard** 2 kolom (bukan list 1 kolom panjang)
- **Composer** bawah: input teks + tombol kirim; Enter submit

### 3.3 Interaction model

| Behavior | Spec |
|----------|------|
| History | Append bubbles; jangan wipe seluruh chat tiap aksi. Hanya ganti/remove keyboard aktif + input step. |
| Typing | 400–700ms indicator “mengetik…” sebelum tiap balasan bot |
| Keyboard | Sticky di bawah pesan bot terakhir untuk step pilihan; diganti per step |
| Composer | Freeform di step yang butuh teks; di idle terima command |
| Isi contoh | Chip di step teks (judul bab, teaser, trivia Q/A) mengisi draft sample |
| Cancel | `/batal` atau tombol Batalkan → bubble “Dibatalkan.” → idle + menu utama |
| `/start` | Append greeting singkat + tampilkan menu utama; **jangan hapus** history chat |

### 3.4 Commands (composer, idle)

| Command | Action |
|---------|--------|
| `/start` | Menu utama |
| `/update` | Flow Update Bab |
| `/status` | Flow Status |
| `/riwayat` | Flow Riwayat |
| `/bantuan` | Flow Bantuan |
| `/batal` | Cancel flow aktif |

Unknown command → bot: “Perintah tidak dikenal. Ketik /start atau pilih menu.”

## 4. Menu & flows

### 4.1 Menu utama (grid 2×3)

1. **Update Bab**
2. **Status**
3. **Bonus**
4. **Karya**
5. **Semesta**
6. **Lainnya** → sub-keyboard: Riwayat, Bantuan, /start, Kembali

### 4.2 Update Bab (existing, polished)

Steps:

1. Pilih karya (keyboard dari `works`)
2. Input judul bab (+ Isi contoh)
3. Input teaser opsional (Lewati + Isi contoh)
4. Preview konfirmasi → Publikasikan | Batalkan
5. On publish: `publishChapter('signature', …)` → draft WA + Salin + Kembali menu

Step hint: `Update bab · n/4 …`

### 4.3 Status (read-only)

Baca `loadContent('signature', author)`:

- Jumlah karya
- Bab terbaru (title + work + date)
- Panjang history rilis
- Link/button **Buka Dashboard** → `/dashboard`

### 4.4 Bonus

1. List bonus (title + PUBLIK/DRAFT dari `published`)
2. Pilih item → keyboard: Tampilkan | Sembunyikan | Kembali
3. Toggle `published` via helper → konfirmasi bot
4. Mirror tab Bonus dashboard

### 4.5 Karya

1. List karya (title + status `TAYANG` | `TAMAT`)
2. Pilih karya → keyboard status
3. `setWorkStatus` → konfirmasi
4. Mirror tab Karya

### 4.6 Semesta (mini)

Bukan full CRUD. Satu aksi: **Tambah trivia**.

1. Input pertanyaan (Q) + Isi contoh
2. Input jawaban (A) + Isi contoh
3. Preview → Simpan | Batalkan
4. `addUniverseTrivia` push `{ q, a }` ke `universe.trivia`
5. Mirror tab Semesta

### 4.7 Riwayat / Bantuan

- Riwayat: max 10 dari `history`, format rapi + Kembali
- Bantuan: jelaskan dual-surface, localStorage, label simulasi, daftar command singkat

## 5. Data & helpers

**Storage key:** `ma-demo-signature` (existing).

| Helper | Location | Behavior |
|--------|----------|----------|
| `publishChapter` | existing | unchanged |
| `buildWaMessage` | existing | unchanged |
| `loadContent` / `saveContent` | existing | used by new helpers |
| `toggleBonusPublished(tier, bonusId, author)` | **new** | flip `bonuses[].published`, save |
| `setWorkStatus(tier, workSlug, status, author)` | **new** | set `works[].status` to `TAYANG` \| `TAMAT`, save |
| `addUniverseTrivia(tier, item, author)` | **new** | ensure universe object, push trivia, save |

Edge cases:

- Works / bonuses / universe kosong → pesan bot ramah, tidak crash
- Input wajib kosong → jangan advance; hint “Isi dulu ya.”
- localStorage throw → bot/toast gagal simpan
- Status karya **hanya** `TAYANG` | `TAMAT` (match `types.ts` + TabKarya)

## 6. Architecture

```
untuk-penulis.astro     → guide strip + TelegramMock
TelegramMock.astro      → shell DOM + bootstrap script
lib/telegram-sim.ts     → (new if script gemuk) state machine + bubble/keyboard/typing helpers
lib/demo-store.ts       → + 3 helpers di atas
```

### State machine (ringan)

```ts
type Phase = 'idle' | 'flow';
type FlowId = 'update' | 'status' | 'bonus' | 'karya' | 'semesta' | 'riwayat' | 'bantuan' | 'lainnya';

// context: { phase, flow?, step: number, draft: Record<string, string> }
// events: menuClick | keyboardClick | textSubmit | command | cancel
```

Rules:

- Satu flow aktif
- Cancel selalu ke idle + render main keyboard
- Jangan `clearDynamic` total; remove `.tg-active-controls` saja

## 7. Visual tokens

Tetap selaras mock existing / ops cream-rose:

- Phone bg `#0F1A1C` / chat `#0A1517` / bot bubble `#1C2E32` / user `#7A3341`
- Accent text `#E8C4C8`, muted `#8AA0A4`, success `#7CC9A4`
- Fonts: Playfair header, Lora body

## 8. Testing (manual)

- [ ] Update Bab → muncul di tab Rilis + beranda (localStorage)
- [ ] Status angka konsisten dashboard
- [ ] Toggle bonus mirror tab Bonus
- [ ] Ubah status karya mirror tab Karya
- [ ] Tambah trivia mirror tab Semesta
- [ ] `/batal` di tengah alur → idle
- [ ] Commands: `/start`, `/update`, `/status`
- [ ] Isi contoh mengisi input
- [ ] Typing indicator terlihat
- [ ] History tidak hilang saat ganti menu
- [ ] Mobile width phone usable
- [ ] Label simulasi terlihat di header

## 9. Implementation order (for plan)

1. Helpers di `demo-store.ts`
2. Shell UI + guide strip + composer + step hint
3. State machine + typing + history append + main keyboard
4. Port Update Bab ke SM
5. Status, Riwayat, Bantuan
6. Bonus, Karya, Semesta
7. Commands + Isi contoh + cancel polish
8. Manual QA checklist §8

## 10. Risks

| Risk | Mitigation |
|------|------------|
| File script terlalu besar | Extract `telegram-sim.ts` |
| Presenter salah kira bot live | Label “Simulasi” + guide strip |
| State mismatch dashboard | Hanya mutate lewat demo-store helpers + loadContent seed |
| Scope creep universe | Hanya tambah trivia |

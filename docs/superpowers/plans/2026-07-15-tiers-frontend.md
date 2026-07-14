# 3-Tier Frontend Mock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship three standalone Astro static demos (Starter / Hero / Signature) for Ratna Maharani presentations, plus PRD updates so Telegram Assistant + Dashboard exist on every tier.

**Architecture:** Three independent Astro apps under `tiers/`. Shared *conventions* only (JSON shape, CSS tokens from prototype). Client-side `localStorage` (`ma-demo-{tier}`) powers mock chapter updates across public pages, `/dashboard`, and `/untuk-penulis`. Visuals ported from `author-homebase-ratna-maharani/project/*.dc.html` — no `support.js`.

**Tech Stack:** Astro 5, Tailwind CSS 4 (or 3), TypeScript (strict optional), vanilla client scripts, static output.

**Spec:** `docs/superpowers/specs/2026-07-15-tiers-frontend-design.md`

**Prototype sources (read before coding UI):**
- `author-homebase-ratna-maharani/project/Author Homebase - Ratna Maharani.dc.html`
- `author-homebase-ratna-maharani/project/Author Homebase - Desktop.dc.html`
- `author-homebase-ratna-maharani/project/Dashboard Penulis.dc.html`

---

## File map (target)

```text
docs/
  prd-homebase-starter.md                 # modify
  prd-author-homebase.md                  # modify
  prd-signature-universe.md               # modify
tiers/
  homebase-starter/
    package.json
    astro.config.mjs
    tsconfig.json
    README.md
    public/assets/.gitkeep
    public/assets/collab-kit-placeholder.pdf
    src/styles/global.css
    src/data/author.json
    src/lib/demo-store.ts
    src/lib/types.ts
    src/layouts/BaseLayout.astro
    src/layouts/OpsLayout.astro
    src/components/public/*
    src/components/ops/*
    src/pages/index.astro
    src/pages/dashboard.astro
    src/pages/untuk-penulis.astro
  author-homebase/                        # same skeleton + extra pages/components
  signature-universe/                     # hero + universe pages
```

Dev ports: Starter `4321`, Hero `4322`, Signature `4323`.

---

### Task 1: Update PRD — Homebase Starter

**Files:**
- Modify: `docs/prd-homebase-starter.md`

- [ ] **Step 1: Adjust non-goals and add dual-ops section**

In §1 Non-tujuan, replace any line that says Starter is not release tooling with narrower language:

```markdown
### Non-tujuan
- Bukan mesin pertumbuhan database lewat **Ruang Bonus** (fitur hero).
- Bukan situs multi-halaman kompleks (peta baca page, collab PDF, halaman per-karya).
- Bukan CMS web bebas / edit source code.
```

After §3.6 Footer (or end of §3), insert:

```markdown
### 3.7 MarkasAuthor Assistant + Dashboard Penulis (ops — semua tier)

Starter menyertakan **jalur operasional penulis** (add-on bulanan opsional) lewat dua surface setara:

1. **Telegram bot** — command allowlist (bukan chat CMS bebas).
2. **Dashboard web** (`/dashboard`) — form terstruktur dengan capability yang sama.

**Scope command Starter (MVP produk):**
- Aktivasi membership (kode sekali pakai) — production later; mock presentasi: langsung “masuk”.
- `Update Bab` (karya, judul bab, URL KBM HTTPS, tanggal) → preview → konfirmasi → undo.
- Draft pesan **Saluran WhatsApp** siap salin (penulis tetap post manual).
- Riwayat rilis ringkas + lihat database pembaca (Sheet milik klien; mock tabel di demo).
- Tema situs minimal (pilih preset) — mock only di presentasi.

**Di luar Starter ops (🔒 upgrade):** kelola Ruang Bonus, edit peta baca multi-node page, Collab Kit PDF fields, chapter-card ekosistem penuh, universe/tokoh.

**Prinsip keamanan (sama semua tier):** AI/parser hanya mengisi schema; eksekusi deterministik; tidak ada publish tanpa konfirmasi; tidak edit HTML; `author_id` dari server.

Harga add-on bulanan: lihat paket Care / Active / Managed di PRD Author Homebase §7.2 (berlaku lintas tier).
```

In §7 Di luar scope table, change row “Kabar rilis otomatis ke pembaca” to:

```markdown
| Kabar rilis multi-kanal + Ruang Bonus + peta baca page | Upgrade → Author Homebase |
| Update bab + draft WA via bot/dashboard | **Termasuk** Starter (add-on Assistant) |
```

- [ ] **Step 2: Verify doc consistency**

Read §1–§3 and §7. Ensure no remaining claim that Telegram/dashboard is hero-only.

- [ ] **Step 3: Commit** (if git available)

```bash
git add docs/prd-homebase-starter.md
git commit -m "docs(prd): Starter gets Telegram+Dashboard ops scope"
```

---

### Task 2: Update PRD — Author Homebase

**Files:**
- Modify: `docs/prd-author-homebase.md`

- [ ] **Step 1: Reframe Assistant as all-tier; add Dashboard**

In §1 Ringkasan, ensure wording says Assistant is add-on available across MarkasAuthor tiers (not “hanya hero”).

In §3.3 title/body, after opening, add:

```markdown
**Catatan lini produk:** MarkasAuthor Assistant (Telegram) dan **Dashboard Penulis** tersedia sebagai add-on operasional di **semua tier** (Starter, Author Homebase, Signature). Yang membedakan tier adalah **matrix capability** (Starter ⊂ Hero ⊂ Signature), bukan ada/tidaknya bot.

**Dual surface:** setiap command allowlist harus bisa dijalankan dari Telegram **atau** Dashboard web dengan hasil setara. Dashboard bukan CMS bebas — hanya form/aksi yang di-allowlist, dengan preview + konfirmasi yang sama.
```

In §4 architecture diagram, change first line to:

```text
Penulis → (Telegram Bot API | Dashboard web) → auth/membership → …
```

In §3 scope public features, keep hero exclusives (bonus, peta, collab PDF, chapter terbaru, multi-page).

Add short matrix subsection under §3.3:

```markdown
#### Matrix capability (ringkas)

| Capability | Starter | Hero | Signature |
|---|:---:|:---:|:---:|
| Update bab + draft WA + undo + riwayat | ✓ | ✓ | ✓ |
| Database pembaca (view) | ✓ | ✓ | ✓ + segment universe |
| Chapter Terbaru / bonus / peta / collab kit ops | — | ✓ | ✓ |
| Universe tokoh/timeline/trivia ops | — | — | ✓ |
```

- [ ] **Step 2: Commit**

```bash
git add docs/prd-author-homebase.md
git commit -m "docs(prd): Hero Assistant all-tier + Dashboard dual surface"
```

---

### Task 3: Update PRD — Signature Universe

**Files:**
- Modify: `docs/prd-signature-universe.md`

- [ ] **Step 1: Add ops paragraph**

After §3 (or in §5 Arsitektur), add:

```markdown
### Ops penulis (Telegram + Dashboard)

Signature memakai surface ops yang sama dengan tier lain (Telegram bot + Dashboard), dengan **command tambahan** untuk entitas universe (tokoh, timeline spoiler flags, lokasi, trivia) sesuai allowlist. CMS Self-Edit (Decap) tetap add-on terpisah §4 — tidak diganti oleh chat/dashboard command MVP.

Paket bulanan Assistant: sama dengan PRD Author Homebase §7.2.
```

- [ ] **Step 2: Commit**

```bash
git add docs/prd-signature-universe.md
git commit -m "docs(prd): Signature ops via Telegram+Dashboard"
```

---

### Task 4: Scaffold `tiers/homebase-starter`

**Files:**
- Create: all starter scaffold files listed below

- [ ] **Step 1: Create app with npm**

```bash
mkdir -p tiers
cd tiers
npm create astro@latest homebase-starter -- --template minimal --install --no-git --typescript strict --yes
cd homebase-starter
npx astro add tailwind --yes
```

If interactive prompts block, scaffold manually with the `package.json` below.

- [ ] **Step 2: Write `package.json` scripts and port**

Ensure `package.json` contains:

```json
{
  "name": "homebase-starter",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev --port 4321",
    "build": "astro build",
    "preview": "astro preview --port 4321"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

(Adjust versions to whatever `create astro` installed; keep port **4321**.)

- [ ] **Step 3: `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: `src/styles/global.css`**

```css
@import "tailwindcss";

@theme {
  --font-serif: "Playfair Display", Georgia, serif;
  --font-body: Lora, Georgia, serif;
  --color-ink: #3b2a28;
  --color-ink-soft: #5a453f;
  --color-muted: #7a5a50;
  --color-faint: #9a8078;
  --color-rose: #7a3341;
  --color-rose-deep: #5c2430;
  --color-blush: #f4e3de;
  --color-paper: #fbf6ef;
  --color-card: #fffdf9;
  --color-wa: #1e7a57;
  --color-alert: #b0483c;
  --color-shell: #eae0d3;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--color-ink);
  background: var(--color-shell);
}

a {
  color: inherit;
}
```

- [ ] **Step 5: Verify dev server starts**

```bash
cd tiers/homebase-starter && npm run dev
```

Expected: listening on `http://localhost:4321`. Stop after confirm.

- [ ] **Step 6: Commit**

```bash
git add tiers/homebase-starter
git commit -m "chore: scaffold homebase-starter Astro app"
```

---

### Task 5: Author data + types + demo-store (Starter)

**Files:**
- Create: `tiers/homebase-starter/src/lib/types.ts`
- Create: `tiers/homebase-starter/src/lib/demo-store.ts`
- Create: `tiers/homebase-starter/src/data/author.json`

- [ ] **Step 1: Write `types.ts`**

```ts
export type Tier = 'starter' | 'hero' | 'signature';

export interface Work {
  slug: string;
  title: string;
  genre: string;
  hook: string;
  readers: string;
  tag: string;
  coverBg: string;
  coverSize: string;
  kbmUrl: string;
  status: 'TAMAT' | 'TAYANG';
  series?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  detail: string;
  dot: string;
}

export interface LatestChapter {
  workSlug: string;
  workTitle: string;
  title: string;
  date: string;
  kbmUrl: string;
  teaser?: string;
}

export interface BonusItem {
  id: string;
  jenis: string;
  title: string;
  karya: string;
  teaser: string;
  excerpt: string;
  published: boolean;
  opens?: string;
}

export interface ReadingNode {
  workSlug: string;
  title: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  border: string;
  coverBg: string;
  desc: string;
  kbmUrl: string;
  showArrow?: boolean;
}

export interface DemoReader {
  name: string;
  wa: string;
  source: string;
  date: string;
  when: string;
  initials: string;
  universe?: string;
}

export interface Character {
  slug: string;
  name: string;
  role: string;
  quote: string;
  bio: string;
  relations: string[];
}

export interface AuthorData {
  tier: Tier;
  penName: string;
  tagline: string;
  bioShort: string;
  bioLong: string;
  kbmProfileUrl: string;
  waChannelUrl: string;
  managementWa: string;
  socials: { label: string; url: string }[];
  works: Work[];
  timeline: TimelineItem[];
  latestChapters: LatestChapter[];
  bonuses: BonusItem[];
  readingMain: ReadingNode[];
  readingSide: { title: string; desc: string; coverBg: string; kbmUrl: string }[];
  collab: {
    stats: { value: string; label: string }[];
    openTo: string[];
    kitNote: string;
  };
  demoReaders: DemoReader[];
  universe?: {
    name: string;
    blurb: string;
    characters: Character[];
    storyTimeline: { id: string; title: string; spoiler: boolean; body: string }[];
    locations: { id: string; name: string; blurb: string }[];
    trivia: { q: string; a: string }[];
    playlistUrl?: string;
  };
}
```

- [ ] **Step 2: Write `demo-store.ts`**

```ts
import type { LatestChapter } from './types';

export type DemoState = {
  latestChapters: LatestChapter[];
  history: LatestChapter[];
  unlocked?: boolean;
  readerName?: string;
};

export function storageKey(tier: string) {
  return `ma-demo-${tier}`;
}

export function loadDemoState(tier: string, fallback: LatestChapter[]): DemoState {
  if (typeof window === 'undefined') {
    return { latestChapters: fallback, history: fallback };
  }
  try {
    const raw = localStorage.getItem(storageKey(tier));
    if (!raw) return { latestChapters: fallback, history: fallback };
    const parsed = JSON.parse(raw) as DemoState;
    return {
      latestChapters: parsed.latestChapters?.length ? parsed.latestChapters : fallback,
      history: parsed.history?.length ? parsed.history : fallback,
      unlocked: parsed.unlocked,
      readerName: parsed.readerName,
    };
  } catch {
    return { latestChapters: fallback, history: fallback };
  }
}

export function saveDemoState(tier: string, state: DemoState) {
  localStorage.setItem(storageKey(tier), JSON.stringify(state));
}

export function publishChapter(tier: string, chapter: LatestChapter, previous: LatestChapter[]) {
  const current = loadDemoState(tier, previous);
  const next: DemoState = {
    ...current,
    latestChapters: [chapter, ...current.latestChapters.filter((c) => c.workSlug !== chapter.workSlug)].slice(0, 5),
    history: [chapter, ...current.history].slice(0, 20),
  };
  saveDemoState(tier, next);
  return next;
}

export function buildWaMessage(chapter: LatestChapter) {
  return (
    `📖 BAB BARU TERBIT\n` +
    `${chapter.workTitle} — ${chapter.title}\n\n` +
    `${chapter.teaser || 'Bab baru sudah tayang.'}\n\n` +
    `Baca sekarang di KBM:\n${chapter.kbmUrl}`
  );
}

export function unlockReader(tier: string, name: string, fallback: LatestChapter[]) {
  const current = loadDemoState(tier, fallback);
  const next = { ...current, unlocked: true, readerName: name };
  saveDemoState(tier, next);
  return next;
}
```

- [ ] **Step 3: Write `author.json` (Ratna — full data; Starter pages only *render* subset)**

```json
{
  "tier": "starter",
  "penName": "Ratna Maharani",
  "tagline": "Penulis romance keluarga & rumah tangga",
  "bioShort": "Menulis kisah rumah tangga yang dekat dengan hidup kita — tentang cinta, luka, dan perempuan yang memilih bertahan atau pergi. Lebih dari 32 juta kali dibaca di KBM App.",
  "bioLong": "Ratna Maharani menulis romance keluarga yang akrab di telinga perempuan Indonesia. Karyanya terbit di KBM App dan telah dibaca puluhan juta kali.",
  "kbmProfileUrl": "https://kbm.id/ratna-maharani?ref=homebase",
  "waChannelUrl": "https://whatsapp.com/channel/ratnamaharani",
  "managementWa": "https://wa.me/6281200000000",
  "socials": [
    { "label": "KBM", "url": "https://kbm.id/ratna-maharani?ref=homebase" },
    { "label": "Instagram", "url": "https://instagram.com/ratnamaharani" }
  ],
  "works": [
    {
      "slug": "istri-kedua",
      "title": "Istri Kedua",
      "genre": "Romance",
      "hook": "Ketika rumah tangga yang dibangun dengan sabar mulai retak dari dalam.",
      "readers": "18 juta pembaca",
      "tag": "SERI UTAMA",
      "coverBg": "linear-gradient(160deg,#5C2430,#7A3341)",
      "coverSize": "20px",
      "kbmUrl": "https://kbm.id/ratna-maharani/istri-kedua?ref=homebase",
      "status": "TAMAT",
      "series": "Istri Kedua"
    },
    {
      "slug": "istri-kedua-musim-2",
      "title": "Istri Kedua: Musim 2",
      "genre": "Romance",
      "hook": "Lanjutan dari sudut yang belum pernah diceritakan.",
      "readers": "Spin-off · sedang tayang",
      "tag": "SPIN-OFF · BARU",
      "coverBg": "linear-gradient(160deg,#7A3341,#A05055)",
      "coverSize": "17px",
      "kbmUrl": "https://kbm.id/ratna-maharani/istri-kedua-musim-2?ref=homebase",
      "status": "TAYANG",
      "series": "Istri Kedua"
    },
    {
      "slug": "menantu-pilihan-ibu",
      "title": "Menantu Pilihan Ibu",
      "genre": "Romance",
      "hook": "Ibu memilih menantu. Hati memilih yang lain.",
      "readers": "9 juta pembaca",
      "tag": "NOVEL LEPAS",
      "coverBg": "linear-gradient(160deg,#6E3B33,#94574C)",
      "coverSize": "18px",
      "kbmUrl": "https://kbm.id/ratna-maharani/menantu-pilihan-ibu?ref=homebase",
      "status": "TAMAT"
    },
    {
      "slug": "jodoh-untuk-laras",
      "title": "Jodoh untuk Laras",
      "genre": "Romance",
      "hook": "Laras menulis surat yang tak pernah ia kirim.",
      "readers": "5 juta pembaca",
      "tag": "NOVEL LEPAS",
      "coverBg": "linear-gradient(160deg,#8A5A52,#B07E71)",
      "coverSize": "18px",
      "kbmUrl": "https://kbm.id/ratna-maharani/jodoh-untuk-laras?ref=homebase",
      "status": "TAMAT"
    }
  ],
  "timeline": [
    {
      "year": "2021",
      "title": "Bab pertama ditulis",
      "detail": "Mulai menulis “Istri Kedua” di sela mengurus rumah, diunggah diam-diam ke KBM App.",
      "dot": "#B98A7C"
    },
    {
      "year": "2022",
      "title": "Viral pertama",
      "detail": "“Istri Kedua” menembus 1 juta pembaca dalam 3 bulan dan masuk jajaran trending KBM.",
      "dot": "#A05055"
    },
    {
      "year": "2024",
      "title": "Penulis Terlaris KBM App",
      "detail": "18 juta pembaca “Istri Kedua” — dinobatkan sebagai penulis terlaris KBM App.",
      "dot": "#7A3341"
    },
    {
      "year": "2025",
      "title": "“Musim 2” dimulai",
      "detail": "Spin-off “Istri Kedua: Musim 2” tayang — melanjutkan kisah dari sudut yang baru.",
      "dot": "#5C2430"
    }
  ],
  "latestChapters": [
    {
      "workSlug": "istri-kedua-musim-2",
      "workTitle": "Istri Kedua: Musim 2",
      "title": "Bab 47 — Pintu yang Tak Pernah Dikunci",
      "date": "3 Juli 2026",
      "kbmUrl": "https://kbm.id/ratna-maharani/istri-kedua-musim-2?ref=homebase",
      "teaser": "Ada yang mengetuk dari sisi rumah yang seharusnya kosong."
    }
  ],
  "bonuses": [
    {
      "id": "b1",
      "jenis": "DELETED SCENE",
      "title": "Malam Sebelum Akad",
      "karya": "Istri Kedua",
      "teaser": "Adegan yang dipotong dari Bab 12: percakapan terakhir Arini dengan ibunya.",
      "excerpt": "Ibu tidak menyalakan lampu. “Kamu masih bisa pulang,” katanya pelan.",
      "published": true,
      "opens": "3.412"
    },
    {
      "id": "b2",
      "jenis": "POV EKSTRA",
      "title": "POV Mas Bram",
      "karya": "Istri Kedua",
      "teaser": "Bab 23 diceritakan ulang dari mata Bram.",
      "excerpt": "Aku bukan tidak melihat. Aku melihat semuanya.",
      "published": true,
      "opens": "2.871"
    },
    {
      "id": "b3",
      "jenis": "SURAT",
      "title": "Surat Laras yang Tak Pernah Dikirim",
      "karya": "Jodoh untuk Laras",
      "teaser": "Ditulis Laras di halaman belakang buku resepnya.",
      "excerpt": "Kalau surat ini sampai padamu, berarti aku sudah cukup berani.",
      "published": false,
      "opens": "—"
    }
  ],
  "readingMain": [
    {
      "workSlug": "istri-kedua",
      "title": "Istri Kedua",
      "badge": "1 · MULAI DI SINI",
      "badgeBg": "#5C2430",
      "badgeColor": "#F4E3DE",
      "border": "#7A3341",
      "coverBg": "linear-gradient(160deg,#5C2430,#7A3341)",
      "desc": "Kisah utama Arini — 200 bab, tamat. Fondasi seluruh semesta.",
      "kbmUrl": "https://kbm.id/ratna-maharani/istri-kedua?ref=homebase",
      "showArrow": true
    },
    {
      "workSlug": "istri-kedua-musim-2",
      "title": "Istri Kedua: Musim 2",
      "badge": "2 · SPIN-OFF",
      "badgeBg": "#F4E3DE",
      "badgeColor": "#7A3341",
      "border": "rgba(122,51,65,.2)",
      "coverBg": "linear-gradient(160deg,#7A3341,#A05055)",
      "desc": "Lanjutan dari sudut baru — baca setelah kisah utama.",
      "kbmUrl": "https://kbm.id/ratna-maharani/istri-kedua-musim-2?ref=homebase",
      "showArrow": false
    }
  ],
  "readingSide": [
    {
      "title": "Menantu Pilihan Ibu",
      "desc": "9 juta pembaca · tamat",
      "coverBg": "linear-gradient(160deg,#6E3B33,#94574C)",
      "kbmUrl": "https://kbm.id/ratna-maharani/menantu-pilihan-ibu?ref=homebase"
    },
    {
      "title": "Jodoh untuk Laras",
      "desc": "5 juta pembaca · tamat",
      "coverBg": "linear-gradient(160deg,#8A5A52,#B07E71)",
      "kbmUrl": "https://kbm.id/ratna-maharani/jodoh-untuk-laras?ref=homebase"
    }
  ],
  "collab": {
    "stats": [
      { "value": "32 jt+", "label": "total dibaca di KBM" },
      { "value": "4", "label": "karya · 1 seri semesta" },
      { "value": "#1", "label": "Penulis Terlaris KBM 2024" }
    ],
    "openTo": [
      "Penerbitan cetak & digital",
      "Adaptasi film / series",
      "Kolaborasi brand & endorsement",
      "Wawancara media & podcast"
    ],
    "kitNote": "PDF 2 halaman · bio, statistik, katalog karya · 1,4 MB"
  },
  "demoReaders": [
    { "name": "Dewi Anggraini", "wa": "0812-3456-7801", "source": "Beranda", "date": "7 Jul 2026", "when": "2 jam lalu", "initials": "DA" },
    { "name": "Siti Rahmawati", "wa": "0857-2210-4432", "source": "Beranda", "date": "7 Jul 2026", "when": "5 jam lalu", "initials": "SR" },
    { "name": "Fitri Handayani", "wa": "0813-9987-2210", "source": "Beranda", "date": "6 Jul 2026", "when": "kemarin", "initials": "FH" },
    { "name": "Maya Kusuma", "wa": "0821-5567-8890", "source": "Beranda", "date": "6 Jul 2026", "when": "kemarin", "initials": "MK" }
  ],
  "universe": {
    "name": "Istri Kedua",
    "blurb": "Semesta rumah tangga Arini — tentang pilihan, diam, dan pintu yang tak pernah benar-benar tertutup.",
    "characters": [
      {
        "slug": "arini",
        "name": "Arini",
        "role": "Protagonis",
        "quote": "Aku tidak pergi karena lemah. Aku pergi karena masih ingin utuh.",
        "bio": "Istri yang belajar membedakan sabar dan menyerah.",
        "relations": ["Bram", "Ibu"]
      },
      {
        "slug": "bram",
        "name": "Bram",
        "role": "Suami",
        "quote": "Aku melihat semuanya. Justru karena itu aku diam.",
        "bio": "Lelaki yang menunda kata sampai terlambat.",
        "relations": ["Arini"]
      },
      {
        "slug": "laras",
        "name": "Laras",
        "role": "Tokoh silang karya",
        "quote": "Surat ini hanya berani sampai di halaman resep.",
        "bio": "Perempuan yang menulis lebih berani daripada ia berbicara.",
        "relations": []
      }
    ],
    "storyTimeline": [
      { "id": "st1", "title": "Akad yang terburu", "spoiler": false, "body": "Arini menikah dengan janji rumah yang tenang." },
      { "id": "st2", "title": "Meja makan yang sunyi", "spoiler": true, "body": "Diam Bram di Bab 23 mengubah segalanya." },
      { "id": "st3", "title": "Pintu belakang", "spoiler": true, "body": "Musim 2 membuka sisi rumah yang dulu dikunci." }
    ],
    "locations": [
      { "id": "loc1", "name": "Rumah di Gang Melati", "blurb": "Rumah kecil tempat seluruh retakan dimulai." },
      { "id": "loc2", "name": "Dapur Ibu", "blurb": "Tempat nasehat dan tekanan datang bersamaan." }
    ],
    "trivia": [
      { "q": "Kenapa judulnya Istri Kedua?", "a": "Bukan soal poligami semata — soal urutan prioritas di hati." },
      { "q": "Apakah Musim 2 wajib setelah tamat?", "a": "Ya, agar spoiler kisah utama tidak bocor." }
    ],
    "playlistUrl": "https://open.spotify.com/"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add tiers/homebase-starter/src
git commit -m "feat(starter): author data, types, demo-store"
```

---

### Task 6: Starter layouts + public one-page

**Files:**
- Create: `tiers/homebase-starter/src/layouts/BaseLayout.astro`
- Create: `tiers/homebase-starter/src/components/public/SiteHeader.astro`
- Create: `tiers/homebase-starter/src/components/public/HeroIdentity.astro`
- Create: `tiers/homebase-starter/src/components/public/Bookshelf.astro`
- Create: `tiers/homebase-starter/src/components/public/AuthorTimeline.astro`
- Create: `tiers/homebase-starter/src/components/public/ReaderForm.astro`
- Create: `tiers/homebase-starter/src/components/public/CollabBlurb.astro`
- Create: `tiers/homebase-starter/src/components/public/SiteFooter.astro`
- Create: `tiers/homebase-starter/src/pages/index.astro`

- [ ] **Step 1: `BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Rumah digital penulis di KBM App.' } = Astro.props;
---
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div class="min-h-screen flex justify-center bg-[var(--color-shell)]">
      <div class="w-full max-w-[430px] min-h-screen bg-[var(--color-paper)] shadow-[0_0_44px_rgba(59,42,40,.18)] flex flex-col md:max-w-[960px]">
        <slot />
      </div>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Port section components from prototype**

Implement each component using **inline styles / Tailwind with exact prototype colors**. Match:
- Hero: photo placeholder circle, H1 Playfair 36px, tagline italic, KBM badge `#5C2430`, bio, CTA WA green + optional secondary
- Bookshelf: 2-col grid covers with gradient + title + “Baca di KBM →”
- Timeline: vertical dots
- Reader form: dark rose card `#5C2430`, name + WA, consent line
- Collab blurb: short bio + stats row (3 cards) — Starter has no PDF button required; optional “Hubungi” only
- Footer: dark `#3B2A28`, MarkasAuthor badge link `#`

`SiteHeader.astro` for Starter: logo pen name only (no multi-page menu). Add small text links to `/dashboard` and `/untuk-penulis` in footer ops line for demo (“Area penulis (demo)”).

- [ ] **Step 3: `ReaderForm.astro` client script**

On submit: validate name non-empty and WA digits length ≥ 9; on success show inline success (“Terdaftar (simulasi) — di production masuk Google Sheet milikmu”). Use `unlockReader` only on hero/signature bonus pages later; Starter form does **not** need bonus unlock.

```html
<script>
  const form = document.getElementById('reader-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = /** @type {HTMLInputElement} */ (document.getElementById('nama')).value.trim();
    const wa = /** @type {HTMLInputElement} */ (document.getElementById('wa')).value.replace(/[^0-9+]/g, '');
    const err = document.getElementById('form-error');
    const ok = document.getElementById('form-ok');
    if (!nama || wa.length < 9) {
      if (err) err.textContent = 'Mohon isi nama dan nomor WhatsApp yang benar, ya.';
      return;
    }
    if (err) err.textContent = '';
    if (ok) ok.hidden = false;
    form.reset();
  });
</script>
```

- [ ] **Step 4: `index.astro` assemble one-page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SiteHeader from '../components/public/SiteHeader.astro';
import HeroIdentity from '../components/public/HeroIdentity.astro';
import Bookshelf from '../components/public/Bookshelf.astro';
import AuthorTimeline from '../components/public/AuthorTimeline.astro';
import ReaderForm from '../components/public/ReaderForm.astro';
import CollabBlurb from '../components/public/CollabBlurb.astro';
import SiteFooter from '../components/public/SiteFooter.astro';
import author from '../data/author.json';
---
<BaseLayout title={`${author.penName} — Homebase Starter`} description={author.bioShort}>
  <SiteHeader penName={author.penName} />
  <main>
    <HeroIdentity author={author} showChapterCard={false} showReadingCta={false} />
    <Bookshelf works={author.works} />
    <AuthorTimeline items={author.timeline} />
    <ReaderForm author={author} />
    <CollabBlurb collab={author.collab} managementWa={author.managementWa} full={false} />
  </main>
  <SiteFooter author={author} />
</BaseLayout>
```

- [ ] **Step 5: Visual check**

```bash
cd tiers/homebase-starter && npm run dev
```

Open `http://localhost:4321` — compare section order/colors to prototype home (minus bonus/peta/chapter card).

- [ ] **Step 6: Commit**

```bash
git add tiers/homebase-starter
git commit -m "feat(starter): public one-page from Ratna prototype"
```

---

### Task 7: Starter Dashboard mock

**Files:**
- Create: `tiers/homebase-starter/src/layouts/OpsLayout.astro`
- Create: `tiers/homebase-starter/src/components/ops/OpsNav.astro`
- Create: `tiers/homebase-starter/src/components/ops/TabRingkasan.astro`
- Create: `tiers/homebase-starter/src/components/ops/TabRilis.astro`
- Create: `tiers/homebase-starter/src/components/ops/TabDatabase.astro`
- Create: `tiers/homebase-starter/src/components/ops/TabTema.astro`
- Create: `tiers/homebase-starter/src/components/ops/UpgradeLock.astro`
- Create: `tiers/homebase-starter/src/pages/dashboard.astro`

- [ ] **Step 1: Port Dashboard chrome from `Dashboard Penulis.dc.html`**

`OpsLayout`: full-width (not phone shell), cream paper, sidebar nav rose theme. Include banner: `Simulasi demo — perubahan tidak ke server`.

Starter nav tabs (enabled): Ringkasan, Kabar Rilis, Database, Tema.  
Locked tabs with `UpgradeLock`: Ruang Bonus, Peta Baca, (and hide Universe).

- [ ] **Step 2: `TabRilis` publish flow**

Fields: select work, chapter title, teaser (max 140), date default today. Buttons: Preview, Publikasikan (simulasi), Salin pesan WA.

Client script:

```js
import { publishChapter, buildWaMessage, loadDemoState } from '../lib/demo-store';
// Note: in Astro, put this in <script> using global functions inlined or import from /src/lib via bundling.

document.getElementById('btn-publish')?.addEventListener('click', () => {
  const workTitle = /** @type {HTMLSelectElement} */ (document.getElementById('work')).value;
  const title = /** @type {HTMLInputElement} */ (document.getElementById('chapter')).value.trim();
  const teaser = /** @type {HTMLTextAreaElement} */ (document.getElementById('teaser')).value.trim();
  if (!title) return alert('Isi judul bab');
  // map workTitle → slug/url from data-attributes on options
  const opt = /** @type {HTMLSelectElement} */ (document.getElementById('work')).selectedOptions[0];
  const chapter = {
    workSlug: opt.dataset.slug,
    workTitle,
    title,
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    kbmUrl: opt.dataset.url,
    teaser,
  };
  publishChapter('starter', chapter, JSON.parse(document.getElementById('fallback-chapters').textContent));
  document.getElementById('wa-box').textContent = buildWaMessage(chapter);
  document.getElementById('publish-ok').hidden = false;
});
```

Because Astro `<script>` can import TS modules, prefer:

```astro
<script>
  import { publishChapter, buildWaMessage } from '../lib/demo-store';
  // ...
</script>
```

- [ ] **Step 3: Ringkasan + Database + Tema**

- Ringkasan: show pen name, last chapter from `loadDemoState`, CTA “+ Umumkan Bab Baru” switches tab via `?tab=rilis` or client state.
- Database: table of `demoReaders`, button “Buka Google Sheet →” `#`.
- Tema: 5 swatches from prototype `temaDefs` (maroon default); selecting updates CSS variables on `document.documentElement` for demo.

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Open `/dashboard`, publish bab, confirm success UI + WA draft text.

- [ ] **Step 5: Commit**

```bash
git add tiers/homebase-starter
git commit -m "feat(starter): dashboard mock with tier locks"
```

---

### Task 8: Starter `/untuk-penulis` Telegram mock

**Files:**
- Create: `tiers/homebase-starter/src/pages/untuk-penulis.astro`
- Create: `tiers/homebase-starter/src/components/ops/TelegramMock.astro`

- [ ] **Step 1: Build chat UI**

Phone-width column, header “MarkasAuthor Assistant · Simulasi”, bubbles:

1. Bot: menu `Update Bab` / `Riwayat` / `Bantuan`
2. User taps Update Bab → bot asks karya → judul → teaser
3. Bot shows preview + buttons ✅ Publikasikan / ❌ Batalkan
4. On publish → call same `publishChapter('starter', …)` + show WA draft bubble

Style chips/buttons with rose `#7A3341` and paper bubbles matching dashboard tokens.

- [ ] **Step 2: Verify parity**

Publish from Telegram mock → open `/dashboard` history area (or re-load ringkasan) → same latest chapter in `localStorage` key `ma-demo-starter`.

- [ ] **Step 3: README**

`tiers/homebase-starter/README.md`:

```markdown
# Homebase Starter (demo)

```bash
npm install
npm run dev   # http://localhost:4321
```

Routes: `/`, `/dashboard`, `/untuk-penulis`
```

- [ ] **Step 4: Build**

```bash
cd tiers/homebase-starter && npm run build
```

Expected: exit 0, `dist/` generated.

- [ ] **Step 5: Commit**

```bash
git add tiers/homebase-starter
git commit -m "feat(starter): Telegram mock + README"
```

---

### Task 9: Scaffold + port Hero `author-homebase`

**Files:**
- Create: `tiers/author-homebase/**` (copy from starter then expand)

- [ ] **Step 1: Clone scaffold**

```bash
cp -R tiers/homebase-starter tiers/author-homebase
# On Windows PowerShell:
# Copy-Item -Recurse tiers/homebase-starter tiers/author-homebase
```

Edit `package.json` name → `author-homebase`, dev port → `4322`.  
Edit `author.json` `"tier": "hero"`.  
Update `demo-store` calls to use `'hero'`.

- [ ] **Step 2: Multi-page public routes**

Create pages by splitting prototype screens:

| Page | Source screen |
|---|---|
| `src/pages/index.astro` | Beranda + chapter card + bonus teaser section + form |
| `src/pages/bonus.astro` | Gate + unlocked list |
| `src/pages/bonus/terima-kasih.astro` | Terima kasih dual CTA |
| `src/pages/peta-baca.astro` | Peta Baca |
| `src/pages/kolaborasi.astro` | Kolaborasi + PDF placeholder link `/assets/collab-kit-placeholder.pdf` |
| `src/pages/karya/index.astro` | list works |
| `src/pages/karya/[slug].astro` | title, hook, KBM button only |

- [ ] **Step 3: Header nav**

Port slide-out menu items: Beranda, Ruang Bonus, Peta Baca, Kolaborasi. Desktop: top nav row.

- [ ] **Step 4: Bonus gate**

Use `unlockReader('hero', name, …)` + `loadDemoState` on bonus page. Unlocked shows excerpts; locked shows form. Thank-you page links “Buka Bonusmu” + WA channel.

- [ ] **Step 5: Chapter card live binding**

On home, `<script>` replaces chapter card fields from `loadDemoState('hero', fallback)`.

- [ ] **Step 6: Dashboard unlocks**

Enable tabs: Bonus, Peta Baca, Karya reorder (client-only). Remove upgrade locks for those. Keep Universe locked with CTA to Signature.

- [ ] **Step 7: Build + commit**

```bash
cd tiers/author-homebase && npm run build
git add tiers/author-homebase
git commit -m "feat(hero): full public multi-page + ops from prototype"
```

---

### Task 10: Scaffold Signature `signature-universe`

**Files:**
- Create: `tiers/signature-universe/**`

- [ ] **Step 1: Clone from hero**

```bash
cp -R tiers/author-homebase tiers/signature-universe
```

Port `4323`, tier `signature`, storage key `signature`.

- [ ] **Step 2: Universe routes**

| Page | Content from `author.universe` |
|---|---|
| `/universe` | Hub cards → tokoh, timeline, peta, trivia, playlist embed link |
| `/universe/tokoh` | character grid |
| `/universe/tokoh/[slug]` | card detail + quote |
| `/universe/timeline` | story timeline; spoiler entries blurred until click |
| `/universe/peta` | location cards on soft map background |
| `/universe/trivia` | Q&A list |

Nav: add “Semesta” entry.

- [ ] **Step 3: Ops universe tab**

Dashboard tab “Semesta”: list characters/trivia counts (read-only mock editors: toggle spoiler flag in `localStorage` optional). Enable all previous hero tabs.

- [ ] **Step 4: Visual depth**

Keep palette; add subtle paper texture CSS on universe hub only (CSS gradient noise OK). Do not invent new brand colors.

- [ ] **Step 5: Build + commit**

```bash
cd tiers/signature-universe && npm run build
git add tiers/signature-universe
git commit -m "feat(signature): universe pages + full ops"
```

---

### Task 11: Root README + acceptance pass

**Files:**
- Create: `tiers/README.md`
- Modify: root `README` only if exists; else `tiers/README.md` is enough

- [ ] **Step 1: `tiers/README.md`**

```markdown
# MarkasAuthor — Tier demos

| App | Command | URL |
|---|---|---|
| Homebase Starter | `cd homebase-starter && npm i && npm run dev` | http://localhost:4321 |
| Author Homebase | `cd author-homebase && npm i && npm run dev` | http://localhost:4322 |
| Signature Universe | `cd signature-universe && npm i && npm run dev` | http://localhost:4323 |

Persona: Ratna Maharani. Mock only — no real Sheet/Telegram/backend.

Demo loop: open site → `/dashboard` or `/untuk-penulis` → publish chapter → home chapter card updates (`localStorage`).
```

- [ ] **Step 2: Run acceptance checklist from spec §10**

Manually verify each box:

```text
[ ] 3 apps run
[ ] Prototype tokens match
[ ] Routes per tier exist
[ ] Forms validate
[ ] Dashboard + Telegram update chapter
[ ] Locks on Starter (and Hero universe)
[ ] No full story chapters hosted
[ ] PRDs updated
[ ] README per tier
```

- [ ] **Step 3: Final commit**

```bash
git add tiers docs
git commit -m "docs: tiers demo README + acceptance"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|---|---|
| 3 folders under `tiers/` | 4, 9, 10 |
| Astro static + Tailwind | 4 |
| Visual = prototype | 6, 7, 9 |
| Ratna data | 5 |
| Starter one-page | 6 |
| Hero multi-page + bonus/peta/kolab | 9 |
| Signature universe | 10 |
| `/dashboard` + `/untuk-penulis` | 7, 8, 9, 10 |
| Feature matrix / locks | 7, 9, 10 |
| localStorage chapter loop | 5, 7, 8 |
| PRD Telegram all tiers + dual surface | 1–3 |
| Mock only | entire plan |
| README ports | 8, 11 |

No TBD placeholders. Types consistent: `LatestChapter`, `publishChapter(tier, chapter, fallback)`, keys `ma-demo-{tier}`.

---

## Execution notes

- Prefer implementing **Starter completely** before cloning to Hero/Signature to avoid triple-fixing bugs.
- When porting HTML from `.dc.html`, strip `sc-for` / `sc-if` / `{{ }}` and replace with Astro `.map()` / conditionals.
- Do **not** import or run `support.js`.
- Windows paths: use PowerShell `Copy-Item` if `cp -R` unavailable.

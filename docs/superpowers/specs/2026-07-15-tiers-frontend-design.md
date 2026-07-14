# Design — 3-Tier Frontend Mock + PRD Telegram/Dashboard

| | |
|---|---|
| **Status** | Approved for planning |
| **Date** | 2026-07-15 |
| **Goal** | Presentasi ke penulis: 3 situs demo (Starter / Hero / Signature) + dual ops surface (Dashboard + Telegram mock) |
| **Out of scope** | Backend nyata, Google Sheet wiring, Telegram Bot API, auth, deploy production klien, AI parser |

---

## 1. Decisions (locked)

| Decision | Choice |
|---|---|
| Deliverable | 3 Astro static apps, mock UI only |
| Repo layout | Flat folders under `tiers/` (no monorepo) |
| Persona | Ratna Maharani on all three tiers |
| Visual source of truth | `author-homebase-ratna-maharani/project/*.dc.html` |
| Ops model | Dual surface: `/dashboard` + `/untuk-penulis` (Telegram scripted UI) |
| Feature depth | Ops and public features scale by tier (Starter ⊂ Hero ⊂ Signature) |
| Product policy change | MarkasAuthor Assistant (Telegram) available on **all tiers**; Dashboard is first-class update surface |

---

## 2. Folder layout

```text
markasauthor/
├── docs/
│   ├── prd-homebase-starter.md          # updated
│   ├── prd-author-homebase.md           # updated
│   ├── prd-signature-universe.md        # updated
│   └── superpowers/specs/
│       └── 2026-07-15-tiers-frontend-design.md
├── author-homebase-ratna-maharani/      # design reference only (do not port support.js)
└── tiers/
    ├── homebase-starter/                # port 4321
    ├── author-homebase/                 # port 4322
    └── signature-universe/              # port 4323
```

Each tier app is standalone: own `package.json`, own `src/data/author.json` (duplicated on purpose for presentation independence).

---

## 3. Stack (identical per app)

| Layer | Choice |
|---|---|
| Framework | Astro 5, `output: 'static'` |
| CSS | Tailwind + CSS variables copied from prototype tokens |
| Interactivity | Client-side only (`<script>` / light islands). No backend |
| State demo | `localStorage` key `ma-demo-{tier}` so chapter updates persist and reflect on public pages |
| Fonts | Playfair Display + Lora + system/sans matching prototype |
| Icons | Inline SVG |
| Prototype runtime | **Do not** ship `support.js` or DC compiler |

---

## 4. Visual rules

1. **Prototype wins UI.** Colors, radii, type scale, section order, button styles, and copy patterns come from:
   - `Author Homebase - Ratna Maharani.dc.html` — public mobile
   - `Author Homebase - Desktop.dc.html` — public desktop
   - `Dashboard Penulis.dc.html` — `/dashboard`
2. **Starter** = visual subset of Hero (same skin, fewer sections). Not a cheaper-looking redesign.
3. **Signature** = Hero plus universe layer; keep Ratna palette; richer layout only where PRD requires (hub, characters, story timeline, map, trivia).
4. **`/untuk-penulis`** has no prototype file: match Dashboard tokens (cream/rose, Lora/Playfair, chip/button language). Label UI as **Simulasi Telegram**.
5. Footer on all public pages: badge **Dibangun oleh MarkasAuthor**.
6. Zero hosted story/chapter body text. Titles, hooks, release notices, and bonus *teasers* only.

### Token reference (from prototype)

| Token | Value |
|---|---|
| Ink | `#3B2A28` |
| Soft text | `#5A453F` / `#7A5A50` |
| Rose | `#7A3341` |
| Rose deep | `#5C2430` |
| Paper | `#FBF6EF` |
| Blush | `#F4E3DE` |
| WA green | `#1E7A57` |
| Card radius | ~14–22px |

---

## 5. Public routes by tier

| Route | Starter | Hero | Signature |
|---|:---:|:---:|:---:|
| `/` identity, bookshelf, timeline, WA form, collab blurb, footer | ✓ one-page | ✓ | ✓ |
| Section “Chapter Terbaru” on home | — | ✓ | ✓ |
| `/bonus`, thank-you, gated bonus list | — | ✓ | ✓ |
| `/karya`, `/karya/[slug]` light work pages | — | ✓ | ✓ |
| `/peta-baca` | — | ✓ | ✓ richer |
| `/kolaborasi` + PDF placeholder download | — | ✓ | ✓ |
| `/universe` hub | — | — | ✓ |
| `/universe/tokoh`, `/universe/tokoh/[slug]` | — | — | ✓ |
| `/universe/timeline` (client spoiler blur) | — | — | ✓ |
| `/universe/peta` | — | — | ✓ |
| `/universe/trivia` | — | — | ✓ |
| KBM badge + outbound links with `?ref=homebase` | ✓ | ✓ | ✓ |
| SEO basics (title, meta, JSON-LD Person/Book) | ✓ | ✓ | ✓ |

**Starter public scope (one scroll on `/`):** Hero identity, bookshelf (≤12 works), short author timeline, reader form (name + WA), WA channel CTA, collab blurb, footer. No bonus gate, no reading-order page, no multi-page nav.

---

## 6. Ops surfaces (mock)

### Routes (all tiers)

| Route | Role |
|---|---|
| `/dashboard` | Web console — tabs per tier matrix |
| `/untuk-penulis` | Scripted Telegram chat UI — same commands as dashboard |

Both surfaces are client-side only. Successful **update chapter** writes into `localStorage` and public home “Chapter Terbaru” / latest release card reads that store (with JSON fallback).

### Feature matrix (Starter ⊂ Hero ⊂ Signature)

| Feature | Starter | Hero | Signature |
|---|:---:|:---:|:---:|
| Ringkasan | ✓ | ✓ | ✓ |
| Update bab + KBM URL + date | ✓ | ✓ | ✓ |
| Preview → confirm → undo (mock) | ✓ | ✓ | ✓ |
| Draft Saluran WA + copy button | ✓ | ✓ | ✓ |
| Riwayat rilis | ✓ short | ✓ | ✓ |
| Database pembaca mock + “Buka Sheet” | ✓ basic | ✓ | ✓ + per-universe tabs |
| Chapter Terbaru card control | — | ✓ | ✓ |
| Bonus list/status | 🔒 upgrade | ✓ | ✓ |
| Peta baca edit mock | 🔒 | ✓ | ✓ |
| Collab kit fields | 🔒 | ✓ | ✓ |
| Universe: tokoh / timeline / trivia | 🔒 | 🔒 | ✓ |
| Tema notes (minimal toggle mock) | ✓ | ✓ | ✓ |

🔒 = visible, disabled, CTA “Upgrade ke Author Homebase / Signature Universe”.

### Demo loop (presentation)

1. Open public site → show form / bonus (tier-appropriate).
2. Open `/dashboard` → announce new chapter → confirm.
3. Return home → chapter card updated.
4. Open `/untuk-penulis` → same command path.
5. Show 🔒 locks on lower tiers.

---

## 7. Data shape

Each app: `src/data/author.json`.

```ts
{
  tier: "starter" | "hero" | "signature",
  penName: string,
  tagline: string,
  bioShort: string,
  bioLong: string,
  photo: string,
  kbmProfileUrl: string,
  socials: { label: string, url: string }[],
  waChannelUrl: string,
  works: {
    slug: string,
    title: string,
    genre: string,
    hook: string,
    cover: string,
    kbmUrl: string,
    series?: string,
    order?: number
  }[],
  timeline: { year: string, title: string, detail: string }[],
  latestChapters: { workSlug: string, title: string, date: string, kbmUrl: string }[],
  bonuses: { id: string, title: string, teaser: string, locked: boolean }[],
  readingOrders: {
    universe: string,
    nodes: { workSlug: string, label: string, note?: string }[]
  }[],
  collab: {
    stats: string[],
    openTo: string[],
    contactEmail: string,
    kitPdf: string
  },
  universe?: {
    name: string,
    blurb: string,
    characters: {
      slug: string,
      name: string,
      role: string,
      quote: string,
      bio: string,
      relations: string[]
    }[],
    storyTimeline: { id: string, title: string, spoiler: boolean, body: string }[],
    locations: { id: string, name: string, blurb: string }[],
    trivia: { q: string, a: string }[],
    playlistUrl?: string
  },
  demoReaders: { name: string, wa: string, at: string, universe?: string }[]
}
```

Content is fictional demo data for Ratna Maharani, aligned with prototype copy where present. No real reader PII.

---

## 8. App internal structure (per tier)

```text
tiers/<app>/
  package.json
  astro.config.mjs
  tailwind.config.mjs   # or CSS-first Tailwind 4 setup
  public/assets/
  src/
    data/author.json
    layouts/BaseLayout.astro
    components/         # extracted from prototype sections
    pages/              # routes per tier
    scripts/demo-store.ts
  README.md             # npm i && npm run dev
```

---

## 9. PRD updates (product policy)

Apply to all three PRDs.

### 9.1 Policy changes

1. **Telegram Assistant is available on every tier** (Starter, Author Homebase, Signature Universe), not hero-only.
2. **Dashboard Penulis** is an official ops surface alongside Telegram. Same allowlisted commands; not a free CMS; not HTML/source editing.
3. **Capability is tier-scoped** (matrix in §6). Upgrade unlocks more command types, not “Telegram vs no Telegram”.
4. **Commercial split stays:** site setup = one-time per tier; Assistant = optional monthly add-on (Care / Active / Managed) on any tier.
5. **WhatsApp remains reader-facing** (channel + owned Sheet). Telegram remains author ops. Dashboard is author ops on web.
6. Starter PRD must stop implying “no release tooling at all”. Clarify:
   - Starter **includes** update-bab + draft WA copy via Dashboard/Telegram (mock → later production).
   - Starter **excludes** full managed release system extras that remain hero+ (bonus gate machine, multi-page reading order page, collab PDF, chapter card ecosystem as full product story). Draft WA + basic update still in Starter so the dual-surface story is honest.

### 9.2 Per-file edit map

| File | Edits |
|---|---|
| `prd-homebase-starter.md` | Add Assistant + Dashboard section; scope matrix Starter; monthly add-on pointer; adjust non-goals (“bukan alat kabar rilis” → narrow to exclude full multi-channel release *product story* / bonus-led growth loop, not basic draft WA); upgrade path still Hero for bonus/peta/collab PDF |
| `prd-author-homebase.md` | Reframe Assistant as all-tier add-on; add Dashboard as equal surface; keep security invariants; extend architecture diagram with web dashboard → same action service |
| `prd-signature-universe.md` | Ops for universe entities via Dashboard/Telegram; monthly add-on ref; no free-form CMS except existing Signature CMS add-on exception |

### 9.3 Architecture note (PRD prose, not built this batch)

```text
Author → Telegram bot  OR  Dashboard web
       → auth/membership → allowlisted command
       → validate → preview → confirm
       → action service → version + audit
       → publish worker → public site

Reader → public site → consent form → client-owned Google Sheet
       → WA Channel → KBM
```

AI (later) only fills structured command fields. Never writes HTML or runs deploy tools directly.

---

## 10. Acceptance criteria (this batch)

- [ ] Three runnable Astro apps under `tiers/*`
- [ ] Visuals match prototype tokens and major layouts (Hero pixel-near; Starter subset; Signature = Hero + universe)
- [ ] All public routes in §5 exist and use Ratna demo data
- [ ] Mock forms validate name + WA and show success UI (no real Sheet)
- [ ] Dashboard and Telegram mock can update chapter; home reflects change via `localStorage`
- [ ] Tier locks (🔒) work on Starter (and Hero for universe)
- [ ] No full chapter/story body hosted
- [ ] Three PRDs updated per §9
- [ ] Each tier `README.md` documents install + dev port

---

## 11. Implementation order

1. Commit this design doc.
2. Update three PRDs (§9).
3. Scaffold `tiers/homebase-starter` (public one-page + both ops surfaces).
4. Scaffold `tiers/author-homebase` from prototype (full hero public + ops).
5. Scaffold `tiers/signature-universe` (hero + universe pages + ops).
6. Wire `demo-store` chapter loop across public + ops.
7. Pass acceptance checklist §10.

---

## 12. Risks

| Risk | Mitigation |
|---|---|
| DC prototype ≠ Astro | Port structure/CSS/copy only; rewrite behavior |
| CSS duplication ×3 | Accept for demo; shared package later if needed |
| Scope creep to real backend | Hard gate: mock only this batch |
| PRD vs prototype conflict | Prototype owns pixels; PRD owns product scope |
| Telegram mock misread as live bot | “Simulasi” labeling on `/untuk-penulis` |

---

## 13. Explicit non-goals (this batch)

- Real Telegram webhook / Bot API
- Real Google Sheet / Apps Script
- PostgreSQL, auth, multi-tenant API
- PDF generation pipeline (placeholder file only)
- Deploy to client Cloudflare accounts
- Porting `support.js` design compiler
- Mini App, voice, auto-post WhatsApp

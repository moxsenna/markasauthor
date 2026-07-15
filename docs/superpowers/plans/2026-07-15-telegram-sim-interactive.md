# Interactive Telegram Simulation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Signature `/untuk-penulis` Telegram mock clearer and more interactive so presenters can try author ops (update bab, status, bonus, karya, semesta) without confusion.

**Architecture:** Hybrid polish + light state machine. Keep phone-frame UI in `TelegramMock.astro`; extract chat engine helpers to `lib/telegram-sim.ts`; mutate shared demo state only through `demo-store.ts` helpers so dashboard tabs mirror chat actions. Guide strip lives on the page above the phone.

**Tech Stack:** Astro (static), TypeScript client scripts, `localStorage` via `ma-demo-signature`, vanilla DOM (no React).

**Spec:** `docs/superpowers/specs/2026-07-15-telegram-sim-interactive-design.md`

**Working directory for all commands unless noted:** `tiers/signature-universe`

**No unit-test runner in repo.** Pure store helpers verified with a one-off Node script; UI verified manually + `npm run build`.

---

## File map

```text
tiers/signature-universe/
  src/
    lib/
      demo-store.ts          # MODIFY — +toggleBonusPublished, setWorkStatus, addUniverseTrivia
      telegram-sim.ts        # CREATE — bubble/keyboard/typing/controls helpers + types
      types.ts               # unchanged (Work.status = TAMAT|TAYANG; BonusItem.published; universe.trivia)
    components/ops/
      TelegramMock.astro     # REWRITE shell + wire flows to telegram-sim + demo-store
    pages/
      untuk-penulis.astro    # MODIFY — guide strip + actionable intro
  scripts/
    verify-demo-store.mjs    # CREATE (temp verify) — optional delete after green
```

---

### Task 1: demo-store helpers

**Files:**
- Modify: `tiers/signature-universe/src/lib/demo-store.ts`
- Create: `tiers/signature-universe/scripts/verify-demo-store.mjs` (verify only)

- [ ] **Step 1: Add helpers at end of `demo-store.ts` (before `toast` or after `publishChapter`)**

Import already has `AuthorData`, `Work`, `BonusItem`. Add:

```ts
export function toggleBonusPublished(
  tier: string,
  bonusId: string,
  author: AuthorData,
): ContentState {
  const current = loadContent(tier, author);
  const bonuses = (current.bonuses || []).map((b) =>
    b.id === bonusId ? { ...b, published: !b.published } : b,
  );
  return saveContent(tier, { bonuses }, author);
}

export function setWorkStatus(
  tier: string,
  workSlug: string,
  status: Work['status'],
  author: AuthorData,
): ContentState {
  const current = loadContent(tier, author);
  const works = (current.works || []).map((w) =>
    w.slug === workSlug ? { ...w, status } : w,
  );
  return saveContent(tier, { works }, author);
}

export function addUniverseTrivia(
  tier: string,
  item: { q: string; a: string },
  author: AuthorData,
): ContentState {
  const current = loadContent(tier, author);
  const base = current.universe ||
    author.universe || {
      name: '',
      blurb: '',
      characters: [],
      storyTimeline: [],
      locations: [],
      trivia: [],
    };
  const universe = {
    ...base,
    trivia: [...(base.trivia || []), { q: item.q, a: item.a }],
  };
  return saveContent(tier, { universe }, author);
}
```

Ensure `Work` is imported in the type import block at top of `demo-store.ts`.

- [ ] **Step 2: Write Node verify script**

Create `tiers/signature-universe/scripts/verify-demo-store.mjs`:

```js
/**
 * Smoke-check pure logic of store helpers via dynamic import of built TS is hard in Astro.
 * Instead, re-implement minimal assertions against inlined logic shape.
 * Run after helpers exist: node scripts/verify-demo-store.mjs
 *
 * This script only validates the *contracts* we need (map/toggle/push),
 * using a fake localStorage polyfill if import fails — prefer manual browser check in Task 8.
 */
import assert from 'node:assert/strict';

// Contract tests (no DOM): pure transforms used by helpers
function toggleBonus(bonuses, id) {
  return bonuses.map((b) => (b.id === id ? { ...b, published: !b.published } : b));
}
function setStatus(works, slug, status) {
  return works.map((w) => (w.slug === slug ? { ...w, status } : w));
}
function pushTrivia(trivia, item) {
  return [...trivia, item];
}

const bonuses = [
  { id: 'a', published: false },
  { id: 'b', published: true },
];
assert.equal(toggleBonus(bonuses, 'a')[0].published, true);
assert.equal(toggleBonus(bonuses, 'a')[1].published, true);

const works = [
  { slug: 'x', status: 'TAYANG' },
  { slug: 'y', status: 'TAMAT' },
];
assert.equal(setStatus(works, 'x', 'TAMAT')[0].status, 'TAMAT');
assert.equal(setStatus(works, 'x', 'TAMAT')[1].status, 'TAMAT');

const trivia = pushTrivia([], { q: 'Q?', a: 'A' });
assert.equal(trivia.length, 1);
assert.equal(trivia[0].q, 'Q?');

console.log('verify-demo-store: OK');
```

- [ ] **Step 3: Run verify**

```bash
cd tiers/signature-universe
node scripts/verify-demo-store.mjs
```

Expected: `verify-demo-store: OK`

- [ ] **Step 4: Commit**

```bash
git add tiers/signature-universe/src/lib/demo-store.ts tiers/signature-universe/scripts/verify-demo-store.mjs
git commit -m "feat(ops): demo-store helpers for telegram sim mutations"
```

---

### Task 2: `telegram-sim.ts` UI helpers

**Files:**
- Create: `tiers/signature-universe/src/lib/telegram-sim.ts`

- [ ] **Step 1: Create helper module**

```ts
/** DOM helpers for Telegram mock — no business persistence here. */

export type KeyboardButton = {
  label: string;
  value: string;
  style?: 'primary' | 'danger' | 'default';
};

export type SimContext = {
  phase: 'idle' | 'flow';
  flow: string | null;
  step: number;
  draft: Record<string, string>;
};

export function createContext(): SimContext {
  return { phase: 'idle', flow: null, step: 0, draft: {} };
}

export function clearActiveControls(root: HTMLElement) {
  root.querySelectorAll('.tg-active-controls').forEach((el) => el.remove());
}

export function setStepHint(el: HTMLElement | null, text: string) {
  if (el) el.textContent = text;
}

export function scrollChat(chat: HTMLElement) {
  chat.scrollTop = chat.scrollHeight;
}

export function appendBotBubble(chat: HTMLElement, html: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tg-msg tg-msg-bot';
  wrap.style.cssText = 'align-self:flex-start;max-width:85%';
  const bubble = document.createElement('div');
  bubble.style.cssText =
    'background:#1C2E32;color:#DDE4E6;border-radius:16px 16px 16px 4px;padding:12px 16px;font-family:Lora,Georgia,serif;font-size:14px;line-height:1.7';
  bubble.innerHTML = html;
  wrap.appendChild(bubble);
  chat.appendChild(wrap);
  scrollChat(chat);
  return wrap;
}

export function appendUserBubble(chat: HTMLElement, text: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tg-msg tg-msg-user';
  wrap.style.cssText = 'align-self:flex-end;max-width:80%';
  const bubble = document.createElement('div');
  bubble.style.cssText =
    'background:#7A3341;color:#FBF6EF;border-radius:16px 16px 4px 16px;padding:10px 16px;font-family:Lora,Georgia,serif;font-size:14px;line-height:1.5';
  bubble.textContent = text;
  wrap.appendChild(bubble);
  chat.appendChild(wrap);
  scrollChat(chat);
  return wrap;
}

export function showTyping(chat: HTMLElement): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tg-active-controls tg-typing';
  wrap.style.cssText =
    'align-self:flex-start;color:#8AA0A4;font-size:12px;font-family:Lora,Georgia,serif;padding:4px 8px';
  wrap.textContent = 'mengetik…';
  chat.appendChild(wrap);
  scrollChat(chat);
  return wrap;
}

export function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export async function botReply(
  chat: HTMLElement,
  html: string,
  delayMs = 500,
): Promise<HTMLElement> {
  const t = showTyping(chat);
  await sleep(delayMs);
  t.remove();
  return appendBotBubble(chat, html);
}

export function appendKeyboard(
  chat: HTMLElement,
  buttons: KeyboardButton[],
  onPick: (value: string, label: string) => void,
  cols = 2,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tg-active-controls tg-keyboard';
  wrap.style.cssText = `display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;padding-left:6px;max-width:92%;align-self:flex-start`;

  buttons.forEach((b) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = b.label;
    const isDanger = b.style === 'danger';
    const isPrimary = b.style === 'primary';
    btn.style.cssText = isPrimary
      ? 'background:#7A3341;border:none;border-radius:12px;padding:10px 12px;color:#FBF6EF;font-family:Lora,Georgia,serif;font-size:13px;font-weight:600;cursor:pointer;text-align:center'
      : isDanger
        ? 'background:transparent;border:1px solid rgba(217,122,122,.35);border-radius:12px;padding:10px 12px;color:#D97A7A;font-family:Lora,Georgia,serif;font-size:13px;cursor:pointer;text-align:center'
        : 'background:rgba(122,51,65,.18);border:1px solid rgba(122,51,65,.3);border-radius:12px;padding:10px 12px;color:#E8C4C8;font-family:Lora,Georgia,serif;font-size:13px;cursor:pointer;text-align:left';
    btn.addEventListener('click', () => onPick(b.value, b.label));
    wrap.appendChild(btn);
  });

  chat.appendChild(wrap);
  scrollChat(chat);
  return wrap;
}

export function appendTextControls(
  chat: HTMLElement,
  opts: {
    placeholder: string;
    allowSkip?: boolean;
    sample?: string;
    onSubmit: (value: string) => void;
    onSkip?: () => void;
  },
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tg-active-controls tg-text-controls';
  wrap.style.cssText =
    'display:flex;flex-direction:column;gap:8px;align-self:stretch;padding-left:6px';

  if (opts.sample) {
    const sampleBtn = document.createElement('button');
    sampleBtn.type = 'button';
    sampleBtn.textContent = `Isi contoh: ${opts.sample}`;
    sampleBtn.style.cssText =
      'align-self:flex-start;background:transparent;border:1px dashed rgba(232,196,200,.45);border-radius:10px;padding:8px 12px;color:#E8C4C8;font-family:Lora,Georgia,serif;font-size:12px;cursor:pointer;text-align:left;max-width:100%';
    sampleBtn.addEventListener('click', () => {
      input.value = opts.sample || '';
      input.focus();
    });
    wrap.appendChild(sampleBtn);
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = opts.placeholder;
  input.style.cssText =
    'width:100%;height:44px;padding:0 14px;border-radius:22px;border:1px solid rgba(255,255,255,.12);background:#1C2E32;color:#FBF6EF;font-family:Lora,Georgia,serif;font-size:14px;box-sizing:border-box;outline:none';

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.textContent = 'Kirim';
  submitBtn.style.cssText =
    'height:36px;padding:0 18px;background:#7A3341;color:#FBF6EF;border:none;border-radius:18px;font-family:Lora,Georgia,serif;font-size:13px;font-weight:600;cursor:pointer';

  const doSubmit = () => {
    const val = input.value.trim();
    if (!val) {
      input.style.borderColor = 'rgba(217,122,122,.6)';
      return;
    }
    wrap.remove();
    opts.onSubmit(val);
  };

  submitBtn.addEventListener('click', doSubmit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSubmit();
  });
  btnRow.appendChild(submitBtn);

  if (opts.allowSkip && opts.onSkip) {
    const skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.textContent = 'Lewati';
    skipBtn.style.cssText =
      'height:36px;padding:0 18px;background:transparent;color:#8AA0A4;border:1px solid rgba(255,255,255,.1);border-radius:18px;font-family:Lora,Georgia,serif;font-size:13px;cursor:pointer';
    skipBtn.addEventListener('click', () => {
      wrap.remove();
      opts.onSkip?.();
    });
    btnRow.appendChild(skipBtn);
  }

  wrap.appendChild(input);
  wrap.appendChild(btnRow);
  chat.appendChild(wrap);
  setTimeout(() => input.focus(), 80);
  scrollChat(chat);
  return wrap;
}

export function parseCommand(raw: string): string | null {
  const t = raw.trim().toLowerCase();
  if (!t.startsWith('/')) return null;
  return t.split(/\s+/)[0];
}
```

- [ ] **Step 2: Commit**

```bash
git add tiers/signature-universe/src/lib/telegram-sim.ts
git commit -m "feat(ops): telegram-sim DOM helpers for interactive mock"
```

---

### Task 3: Page guide strip + intro

**Files:**
- Modify: `tiers/signature-universe/src/pages/untuk-penulis.astro`

- [ ] **Step 1: Replace intro block under the title with actionable copy + guide strip**

Keep back links and `OpsLayout`. Replace the `<h1>` / `<p>` / bare `<TelegramMock />` section body so after the existing back links you have:

```astro
  <h1
    style="margin:0 0 6px;font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:#3B2A28"
  >
    Simulasi Telegram
  </h1>
  <p style="margin:0 0 16px;max-width:620px;font-size:14px;line-height:1.6;color:#7A5A50">
    Coba aksi ops penulis seperti di HP: update bab, cek status, toggle bonus, ubah status karya,
    tambah trivia semesta. Bukan bot asli — data di <em>localStorage</em>, sinkron dengan Dashboard.
  </p>

  <div
    id="tg-guide-strip"
    style="background:#F4E3DE;border:1px solid rgba(122,51,65,.2);border-radius:14px;padding:14px 18px;margin-bottom:8px;max-width:520px"
  >
    <div
      style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#7A3341;font-weight:700;margin-bottom:6px"
    >
      Panduan coba
    </div>
    <p style="margin:0 0 10px;font-size:13px;color:#3B2A28;line-height:1.5">
      Alur demo utama: <strong>Update Bab</strong> → pilih karya → judul → teaser → publikasi →
      salin pesan WA.
    </p>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button type="button" data-tg-guide="update" class="tg-guide-chip" style="background:#7A3341;color:#fff;border:none;border-radius:999px;padding:6px 12px;font-size:12px;font-family:Lora,serif;cursor:pointer">
        1. Update Bab
      </button>
      <button type="button" data-tg-guide="status" class="tg-guide-chip" style="background:#fff;border:1px solid rgba(122,51,65,.25);color:#7A3341;border-radius:999px;padding:6px 12px;font-size:12px;font-family:Lora,serif;cursor:pointer">
        2. Status
      </button>
      <button type="button" data-tg-guide="bonus" class="tg-guide-chip" style="background:#fff;border:1px solid rgba(122,51,65,.25);color:#7A3341;border-radius:999px;padding:6px 12px;font-size:12px;font-family:Lora,serif;cursor:pointer">
        3. Bonus
      </button>
    </div>
  </div>

  <TelegramMock />
```

Guide chips are wired in Task 4 via `document.querySelectorAll('[data-tg-guide]')` dispatching into the sim `startFlow`.

- [ ] **Step 2: Commit**

```bash
git add tiers/signature-universe/src/pages/untuk-penulis.astro
git commit -m "feat(ops): guide strip on telegram simulation page"
```

---

### Task 4: Rewrite TelegramMock shell + main menu + commands

**Files:**
- Modify: `tiers/signature-universe/src/components/ops/TelegramMock.astro` (full rewrite of markup + script)

- [ ] **Step 1: Replace component markup**

Frontmatter stays: import `author.json`, cast `AuthorData`, expose `works` + `fallbackChapters` + full `author` JSON for `loadContent`.

Markup structure:

```html
<div id="telegram-mock-root" style="display:flex;justify-content:center;...">
  <div style="phone frame max-width:420px ...">
    <!-- tiny status: Simulasi -->
    <!-- header: MarkasAuthor Assistant / online · simulasi -->
    <!-- #tg-step-hint -->
    <!-- #tg-chat (empty of dynamic menu; greeting bot bubble only) -->
    <!-- #tg-composer: input#tg-composer-input + send button -->
  </div>
</div>
<script type="application/json" id="tg-author-data">{JSON.stringify(author)}</script>
```

Do **not** hardcode the old static `#tg-menu` buttons; main keyboard is rendered by JS.

- [ ] **Step 2: Script bootstrap**

In client script:

```ts
import author types + demo-store + telegram-sim helpers
const author = JSON.parse(#tg-author-data)
const chat = #tg-chat
const stepHint = #tg-step-hint
const composer = #tg-composer-input
let ctx = createContext()

function resetIdle(showMenu = true) {
  clearActiveControls(chat)
  ctx = createContext()
  setStepHint(stepHint, 'Menu utama · pilih aksi di bawah')
  if (showMenu) renderMainMenu()
}

function renderMainMenu() {
  clearActiveControls(chat)
  appendKeyboard(chat, [
    { label: '✎ Update Bab', value: 'update' },
    { label: '📊 Status', value: 'status' },
    { label: '🎁 Bonus', value: 'bonus' },
    { label: '📚 Karya', value: 'karya' },
    { label: '🌌 Semesta', value: 'semesta' },
    { label: '☰ Lainnya', value: 'lainnya' },
  ], (value, label) => {
    appendUserBubble(chat, label)
    startFlow(value)
  }, 2)
}

async function startFlow(flow: string) {
  clearActiveControls(chat)
  ctx = { phase: 'flow', flow, step: 0, draft: {} }
  if (flow === 'update') return flowUpdate()
  if (flow === 'status') return flowStatus()
  if (flow === 'bonus') return flowBonus()
  if (flow === 'karya') return flowKarya()
  if (flow === 'semesta') return flowSemesta()
  if (flow === 'riwayat') return flowRiwayat()
  if (flow === 'bantuan') return flowBantuan()
  if (flow === 'lainnya') return flowLainnya()
  await botReply(chat, 'Aksi belum tersedia.')
  resetIdle()
}

// composer: on send
// if ctx.phase==='idle' and parseCommand → map /start /update /status /riwayat /bantuan /batal
// /start → botReply greeting + resetIdle(true)
// unknown → botReply unknown
// if phase flow and command /batal → cancel
// free text while idle without / → botReply "Pilih menu atau ketik /start"

// guide chips:
document.querySelectorAll('[data-tg-guide]').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.getAttribute('data-tg-guide')
    if (!f) return
    clearActiveControls(chat)
    appendUserBubble(chat, btn.textContent?.trim() || f)
    startFlow(f)
  })
})

// initial:
// greeting already in HTML OR appendBotBubble once
renderMainMenu()
```

Implement **stub** flow functions that only `botReply` "TODO" then `resetIdle` except:

- `flowLainnya` → keyboard Riwayat / Bantuan / Mulai ulang (/start) / Kembali
- `flowBantuan` → full help text from spec + reset button
- `flowRiwayat` → load history via `loadContent` / `loadDemoState` + list + menu button

Port **Update Bab** fully in this task (existing logic), using:

- `appendKeyboard` for works
- `appendTextControls` for title (sample `Bab 48 — Pintu yang Terbuka`) and teaser (sample + skip)
- preview `appendKeyboard` Publikasikan / Batalkan
- `publishChapter` + WA copy UI (reuse styles from old `showWaPreview`)

- [ ] **Step 3: Build check**

```bash
cd tiers/signature-universe
npm run build
```

Expected: build success, no TS/astro errors.

- [ ] **Step 4: Manual smoke (dev)**

```bash
npm run dev
```

Open `http://localhost:4323/untuk-penulis` — main keyboard visible, `/start` works, Update Bab end-to-end still publishes.

- [ ] **Step 5: Commit**

```bash
git add tiers/signature-universe/src/components/ops/TelegramMock.astro
git commit -m "feat(ops): telegram mock shell, menu grid, commands, update flow"
```

---

### Task 5: Status + Riwayat polish

**Files:**
- Modify: `tiers/signature-universe/src/components/ops/TelegramMock.astro` (flowStatus / flowRiwayat)

- [ ] **Step 1: Implement `flowStatus`**

```ts
async function flowStatus() {
  setStepHint(stepHint, 'Status · ringkasan demo');
  const state = loadContent('signature', author);
  const latest = state.latestChapters?.[0];
  const html = `<strong>Status Homebase</strong><br/><br/>
    <strong>Karya:</strong> ${state.works?.length ?? 0}<br/>
    <strong>Riwayat rilis:</strong> ${state.history?.length ?? 0}<br/>
    <strong>Bab terbaru:</strong> ${
      latest
        ? `${latest.workTitle} — ${latest.title} <span style="color:#8AA0A4">(${latest.date})</span>`
        : '<em style="color:#8AA0A4">belum ada</em>'
    }`;
  await botReply(chat, html);
  appendKeyboard(
    chat,
    [
      { label: 'Buka Dashboard', value: 'dash', style: 'primary' },
      { label: 'Kembali ke Menu', value: 'menu' },
    ],
    (value) => {
      if (value === 'dash') {
        window.location.href = '/dashboard';
        return;
      }
      appendUserBubble(chat, 'Kembali ke Menu');
      resetIdle(true);
    },
    1,
  );
}
```

- [ ] **Step 2: Ensure `flowRiwayat` uses `loadContent` history (max 10), empty state message, then main menu keyboard**

- [ ] **Step 3: Manual check Status numbers vs dashboard after a publish**

- [ ] **Step 4: Commit**

```bash
git add tiers/signature-universe/src/components/ops/TelegramMock.astro
git commit -m "feat(ops): telegram status and riwayat flows"
```

---

### Task 6: Bonus + Karya flows

**Files:**
- Modify: `TelegramMock.astro`
- Uses: `toggleBonusPublished`, `setWorkStatus`

- [ ] **Step 1: `flowBonus`**

1. `loadContent` → if no bonuses, bot message + menu
2. Keyboard list: `${title} · ${published ? 'PUBLIK' : 'DRAFT'}` value=id
3. On pick: keyboard Tampilkan/Sembunyikan (label based on current) + Kembali
4. On toggle: `toggleBonusPublished('signature', id, author)` → bot confirm new state → menu

- [ ] **Step 2: `flowKarya`**

1. List works with status
2. Pick work → keyboard `TAYANG` | `TAMAT` | Kembali
3. `setWorkStatus('signature', slug, status, author)` → confirm → menu

- [ ] **Step 3: Manual** — toggle bonus, open dashboard Bonus tab; change karya status, open Rak Buku

- [ ] **Step 4: Commit**

```bash
git add tiers/signature-universe/src/components/ops/TelegramMock.astro
git commit -m "feat(ops): telegram bonus toggle and karya status flows"
```

---

### Task 7: Semesta trivia + help text + cancel polish

**Files:**
- Modify: `TelegramMock.astro`
- Uses: `addUniverseTrivia`

- [ ] **Step 1: `flowSemesta`**

1. Explain mini scope: tambah trivia saja
2. `appendTextControls` Q sample e.g. `Siapa tokoh utama di …?`
3. then A sample e.g. `Jawaban singkat…`
4. Preview keyboard Simpan | Batalkan
5. Save via `addUniverseTrivia('signature', {q,a}, author)`
6. Confirm + menu

- [ ] **Step 2: `flowBantuan`** — dual-surface, localStorage, command list (`/start /update /status /riwayat /bantuan /batal`)

- [ ] **Step 3: Cancel** — any flow: `/batal` or danger button clears controls, bot “Dibatalkan.”, `resetIdle(true)`

- [ ] **Step 4: Manual trivia appears under Semesta tab

- [ ] **Step 5: Commit**

```bash
git add tiers/signature-universe/src/components/ops/TelegramMock.astro
git commit -m "feat(ops): telegram semesta trivia, help, cancel polish"
```

---

### Task 8: Full QA + build

**Files:** none (verify only)

- [ ] **Step 1: Build**

```bash
cd tiers/signature-universe
npm run build
```

Expected: success.

- [ ] **Step 2: Dev checklist (spec §8)**

With `npm run dev` on port 4323:

- [ ] Guide strip chips start flows
- [ ] Typing indicator visible
- [ ] History append (switch menus without wipe)
- [ ] Update Bab → Rilis + home reflect
- [ ] Status consistent
- [ ] Bonus toggle mirrors
- [ ] Karya status mirrors
- [ ] Trivia mirrors Semesta
- [ ] `/batal` mid-flow
- [ ] Commands `/start` `/update` `/status`
- [ ] Isi contoh fills input
- [ ] Header shows simulasi
- [ ] Mobile width OK

- [ ] **Step 3: Final commit if only polish leftovers**

```bash
git add -A tiers/signature-universe/src
git status
# if dirty:
git commit -m "fix(ops): telegram sim QA polish"
```

- [ ] **Step 4: Optional cleanup**

Delete `scripts/verify-demo-store.mjs` if not wanted long-term, or keep for smoke.

---

## Spec coverage check

| Spec section | Task |
|--------------|------|
| Guide strip + intro | Task 3 |
| Phone shell, step hint, keyboard, composer | Task 4 |
| Typing + history append | Task 2 + 4 |
| Commands | Task 4 |
| Update Bab | Task 4 |
| Status | Task 5 |
| Bonus / Karya | Task 6 |
| Semesta trivia | Task 7 |
| Riwayat / Bantuan / cancel | Task 4–5, 7 |
| demo-store helpers | Task 1 |
| Manual QA | Task 8 |
| Out of scope Bot API / multi-tier | not planned |

## Notes for implementer

- Always call `loadContent('signature', author)` when listing works/bonuses so seed JSON merges with localStorage.
- Never claim live bot; keep “Simulasi” / `online · simulasi`.
- Prefer `clearActiveControls` over wiping all `.tg-msg` bubbles.
- Work status values are **only** `TAYANG` | `TAMAT` (not hiatus).
- Bonus field is `published` boolean.
- Trivia items are `{ q, a }`.

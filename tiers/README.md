# MarkasAuthor — Tier demos

| App | Command | URL |
|---|---|---|
| Homebase Starter | `cd homebase-starter && npm i && npm run dev` | http://localhost:4321 |
| Author Homebase | `cd author-homebase && npm i && npm run dev` | http://localhost:4322 |
| Signature Universe | `cd signature-universe && npm i && npm run dev` | http://localhost:4323 |

Persona: **Ratna Maharani** (sama di 3 tier). Mock only — no real Sheet/Telegram/backend.

## Demo loop (3 menit)

1. Buka situs publik tier
2. `/dashboard` atau `/untuk-penulis` → Umumkan bab baru → konfirmasi
3. Kembali ke beranda → kartu chapter / state ter-update (`localStorage` key `ma-demo-{tier}`)
4. Bandingkan 🔒 upgrade lock di Starter vs fitur penuh Hero/Signature

## Docs

- Spec: `docs/superpowers/specs/2026-07-15-tiers-frontend-design.md`
- Plan: `docs/superpowers/plans/2026-07-15-tiers-frontend.md`
- PRD: `docs/prd-*.md`

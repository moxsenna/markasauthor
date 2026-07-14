# MarkasAuthor — Tier demos

| App | Local | Cloudflare Pages |
|---|---|---|
| Homebase Starter | `cd homebase-starter && npm i && npm run dev` → :4321 | https://ma-homebase-starter.pages.dev |
| Author Homebase | `cd author-homebase && npm i && npm run dev` → :4322 | https://ma-author-homebase.pages.dev |
| Signature Universe | `cd signature-universe && npm i && npm run dev` → :4323 | https://ma-signature-universe.pages.dev |

Persona: **Ratna Maharani** (sama di 3 tier). Mock only — no real Sheet/Telegram/backend.

## Demo loop (3 menit)

1. Buka situs publik tier
2. `/dashboard` atau `/untuk-penulis` → Umumkan bab baru → konfirmasi
3. Kembali ke beranda → kartu chapter / state ter-update (`localStorage` key `ma-demo-{tier}`)
4. Bandingkan 🔒 upgrade lock di Starter vs fitur penuh Hero/Signature

## Redeploy

```bash
cd homebase-starter && npm run build && npx wrangler pages deploy dist --project-name=ma-homebase-starter
cd ../author-homebase && npm run build && npx wrangler pages deploy dist --project-name=ma-author-homebase
cd ../signature-universe && npm run build && npx wrangler pages deploy dist --project-name=ma-signature-universe
```

## Docs

- Spec: `docs/superpowers/specs/2026-07-15-tiers-frontend-design.md`
- Plan: `docs/superpowers/plans/2026-07-15-tiers-frontend.md`
- PRD: `docs/prd-*.md`

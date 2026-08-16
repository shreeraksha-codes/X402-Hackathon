# DDP-X — frontend

A working React + Vite + TypeScript + Tailwind frontend for DDP-X, the
Digital Product Passport verification demo. Everything runs client-side —
hashing via `crypto.subtle`, "Algorand" and "x402" flows are simulated with
scripted timers so the whole thing works with `npm run dev` and no backend.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Pages

- `/` — landing page: hero, how-it-works, and a cinematic CTA + footer section
- `/demo` — the judge-facing hub: two live products, a "trigger tamper" toggle,
  the provenance hash-chain visual, an x402 request/response terminal, and an
  AI-agent accept/reject decision
- `/verify/:productId` — the consumer QR destination (try
  `/verify/PX-2026-7F92A18D` for the authentic sample and
  `/verify/PX-2026-C41B7E90` for the one that ships tampered)
- `/products` — manufacturer dashboard
- `/products/new` — create a passport: hashes a pasted "certificate," mints a
  mock Algorand asset ID, and renders a scannable QR code
- `/products/:productId/passport` — full manufacturer-facing passport with
  raw hashes and the chain visualization
- any unmatched route — a full-viewport 404

## What came from where

This was assembled from three separate specs:

1. **The DDP-X architecture writeup** shaped the whole product: the
   passport/QR/verify flow, the hash-chain provenance model, the Algorand
   anchor, and the x402 pay-per-verification API. That's the app itself —
   `src/lib/verify.ts` and `src/lib/x402.ts` simulate the engine and payment
   cycle it describes.
2. **The "CTA + Footer" component spec** (liquid-glass buttons, Instrument
   Serif / Barlow pairing, HLS video background) became `CTAFooter.tsx` on
   the landing page. The copy and links were rewritten for DDP-X — the
   original was for an unrelated design-studio site.
3. **The 404 page spec** (full-bleed video, Geist Mono numerals, gradient
   text, no chrome) became `NotFound.tsx`, kept close to the original layout
   spec. Geist Mono's Figma-hosted font file isn't reliably fetchable outside
   Figma, so it's swapped for JetBrains Mono (Google Fonts) — same
   compact, semibold mono character.

## Notes

- Product data lives in `src/data/products.ts`. Two seed products ship
  built in; anything created via `/products/new` is kept in
  `localStorage` for the session.
- There's no real backend, Algorand node, or x402 facilitator here — asset
  IDs, transaction hashes, and payment confirmations are generated
  client-side to demonstrate the flow. Wiring this to a real FastAPI +
  PostgreSQL + Algorand TestNet backend is the natural next step.

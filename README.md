# DDP-X — Decentralized Digital Passport (x402)

Give every physical product a **cryptographically verifiable digital passport** anchored to Algorand, and turn verification into a **machine-payable service** via x402.

Built for the X402 Hackathon. Live demos **22nd & 23rd**.

---

## The Loop

```
Physical product → QR → Digital Passport (PostgreSQL)
  → Provenance events (hash-chained) + documents (SHA-256)
  → Trust anchor: Algorand TestNet (asset per product + hash anchors)
  → Verification engine (explainable score; states: AUTHENTIC / SUSPICIOUS / TAMPERED / INVALID / RECALLED / UNKNOWN)
  → x402-protected endpoint  GET /api/v1/verify/{product_id}
  → HTTP 402 → client pays (Base Sepolia USDC testnet, official x402 SDK)
  → payment receipt hash anchored to Algorand (settlement evidence)
  → 200 OK verification report
  → Human (QR scan) AND AI agent (Python CLI + TS demo) consume it
```

## Why This Matters — The Regulation Is Live

- EU **ESPR (EU) 2024/1781** — legal basis for Digital Product Passports
- **EU DPP Registry went live 20 July 2026**
- Mandatory rollout: **Feb 2027 batteries** → 2027 textiles/tyres/aluminium → 2028 furniture → 2029 mattresses/ICT

> "The EU DPP Registry went live this month. DDP-X is the machine-verifiable, machine-payable trust layer for it."

## Key Features

- **Digital Passport** — per-product passport with provenance events, documents, and ownership records
- **Cryptographic Provenance** — hash-chained event log (`previous_event_hash`) + SHA-256 document hashes
- **Algorand Anchoring** — ASA per product + note-transaction anchors on TestNet; never raw serials or PII on-chain
- **x402 Pay-per-Verify** — official Coinbase x402 SDK; `GET /api/v1/verify/{product_id}` returns `402` until paid, then `200`; free-first-3 per IP
- **AI Agent Client** — Python CLI + TypeScript browser demo that verifies and pays autonomously with spending limits
- **Explainable Verification** — human-readable trust score with states: `AUTHENTIC` / `SUSPICIOUS` / `TAMPERED` / `INVALID` / `RECALLED` / `UNKNOWN`
- **Tamper Evidence** — modify a document after anchoring → re-verify → `TAMPERED`

## Use Cases

1. **Consumer trust** — scan QR → passport → AUTHENTIC vs TAMPERED
2. **EU compliance readiness** — manufacturers get DPP infrastructure before mandates hit
3. **AI procurement** — agent verifies + pays per request, spending limits enforced
4. **Recalls** — batch `RECALLED` propagates to all passports (AUTHENTIC ≠ SAFE)
5. **Anti-counterfeit** — tamper detection via document hash mismatch + event-chain verification

## Tech Stack

| Layer | Tech |
|---|---|
| Web | Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + React Three Fiber (3D landing) |
| API | FastAPI + SQLAlchemy (async) + Pydantic v2 + Alembic |
| DB / Cache | PostgreSQL (Neon) · Redis (Upstash) |
| Storage | Cloudflare R2 (S3-compatible) / local disk |
| Blockchain | Algorand TestNet (algokit-utils, Nodely free endpoints) |
| Payments | x402 (official Coinbase SDK) on Base Sepolia USDC testnet |
| Deploy | Docker Compose → Vercel + Fly.io |

## Repo Layout

```
apps/
├── web/          # Next.js frontend (3D landing + 2D app)
├── api/          # FastAPI backend (services, blockchain, payments, security)
└── agent/        # x402 AI client (Python CLI + TS demo)
packages/{shared-types, crypto, config}/
infra/docker/
scripts/{setup_algorand.py, seed.py, demo.py, check_ports.sh}
docs/{architecture, api, security, threat-model, deployment}.md
tests/{integration, e2e, security}/
```

## Quickstart (local)

```bash
cp .env.example .env
docker compose up -d
# web:  http://localhost:3000
# api:  http://localhost:8000  (Swagger: /docs)
```

Run `scripts/check_ports.sh` first — ports 5432 / 6379 / 8000 / 3000 must be free.

## Verify with curl

```bash
# 1. Unpaid verification → HTTP 402
curl -i http://localhost:8000/api/v1/verify/PX-2026-7F92A18D

# 2. Paid verification (via agent/demo wallet) → HTTP 200 AUTHENTIC
python apps/agent/verify.py PX-2026-7F92A18D
```

## Honesty Rules

- No "Payment successful" without real facilitator verification
- No "Blockchain verified" without a confirmed round
- Mocks only in unit tests / CI / offline dev — never in live demo
- Documented limitation: blockchain verifies record integrity, not physical truth

## Docs

- `docs/architecture.md` · `docs/api.md` · `docs/security.md` · `docs/threat-model.md` · `docs/deployment.md`
- `PATENT.md` — invention disclosure + prior-art notes (not legal advice)

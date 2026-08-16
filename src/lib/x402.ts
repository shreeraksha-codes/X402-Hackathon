export type X402Step = {
  text: string;
  delay: number;
  tone?: "default" | "muted" | "success" | "warn";
};

/** The exact request/response cycle the DDP-X plan describes:
 *  GET -> 402 Payment Required -> client pays -> GET (retried) -> 200 OK. */
export function buildX402Script(productId: string, price = "$0.01"): X402Step[] {
  return [
    { text: `GET /api/v1/verify/${productId}`, delay: 250 },
    { text: `HTTP/1.1 402 Payment Required`, delay: 500, tone: "warn" },
    { text: `x-payment-required: ${price} on Base Sepolia (USDC)`, delay: 250, tone: "muted" },
    { text: `x402 client: signing payment...`, delay: 650, tone: "muted" },
    { text: `payment submitted, awaiting confirmation...`, delay: 700, tone: "muted" },
    { text: `payment confirmed`, delay: 400, tone: "success" },
    { text: `GET /api/v1/verify/${productId}  (retry, X-PAYMENT attached)`, delay: 350 },
    { text: `HTTP/1.1 200 OK`, delay: 450, tone: "success" },
  ];
}

export async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

export function randomAssetId() {
  return Math.floor(800000000 + Math.random() * 99999999).toString();
}

export function generateProductId() {
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `PX-2026-${rand}`;
}

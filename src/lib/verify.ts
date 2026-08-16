import type { Product } from "../data/products";

export type VerificationResult = {
  status: "AUTHENTIC" | "TAMPERED";
  score: number;
  checks: { label: string; pass: boolean; detail: string }[];
  brokenAt: number | null; // index of the provenance event where the hash chain breaks
};

/** Simulates the DDP-X verification engine described in the DDP-X plan:
 *  it compares each document's anchored hash against its current hash,
 *  and walks the provenance hash chain looking for a break. */
export function verifyProduct(product: Product): VerificationResult {
  const tampered = product.tamperedOverride ?? false;

  const docChecks = product.documents.map((d) => {
    const pass = !tampered && d.anchoredHash === d.currentHash;
    return {
      label: `Document integrity — ${d.name}`,
      pass,
      detail: pass
        ? "Current hash matches the anchored fingerprint."
        : "Current hash does not match the anchor. This file was replaced after anchoring.",
    };
  });

  let brokenAt: number | null = null;
  if (tampered && product.events.length > 1) {
    brokenAt = Math.min(1, product.events.length - 1);
  }

  const chainCheck = {
    label: "Provenance chain integrity",
    pass: brokenAt === null,
    detail:
      brokenAt === null
        ? "Every event links correctly to the one before it."
        : `Event "${product.events[brokenAt].label}" no longer matches its previous_hash reference.`,
  };

  const anchorCheck = {
    label: "Algorand anchor",
    pass: true,
    detail: `Asset ${product.algorandAssetId} confirmed on Algorand TestNet.`,
  };

  const checks = [...docChecks, chainCheck, anchorCheck];
  const failed = checks.filter((c) => !c.pass).length;
  const score = Math.max(0, 100 - failed * 22 - (tampered ? 6 : 0));

  return {
    status: tampered || failed > 0 ? "TAMPERED" : "AUTHENTIC",
    score,
    checks,
    brokenAt,
  };
}

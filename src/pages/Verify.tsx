import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "../data/products";
import { verifyProduct } from "../lib/verify";
import { buildX402Script } from "../lib/x402";
import StatusBadge from "../components/StatusBadge";
import Terminal from "../components/Terminal";
import { CheckCircle2, XCircle, FileText } from "lucide-react";

export default function Verify() {
  const { productId } = useParams();
  const product = productId ? getProduct(productId) : undefined;
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const result = useMemo(() => (product ? verifyProduct(product) : null), [product]);
  const script = useMemo(() => (product ? buildX402Script(product.id) : []), [product]);

  if (!product || !result) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="mb-3 font-heading text-3xl italic text-paper">
          No passport found
        </h1>
        <p className="mb-6 font-body text-paper/60">
          We couldn't find a product with ID{" "}
          <span className="hash-text">{productId}</span>.
        </p>
        <Link to="/demo" className="font-mono text-sm text-anchor hover:underline">
          ← Back to the demo
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <div className="rounded-2xl border border-line bg-panel p-8 text-center">
        <div className="mb-6 flex justify-center">
          <StatusBadge status={result.status} size="lg" />
        </div>

        <h1 className="mb-1 font-heading text-2xl italic text-paper">
          {product.name}
        </h1>
        <p className="mb-6 font-mono text-xs text-paper/40">{product.id}</p>

        <dl className="mb-6 grid grid-cols-2 gap-4 text-left font-body text-sm">
          <div>
            <dt className="text-paper/40">Manufacturer</dt>
            <dd className="text-paper/85">{product.manufacturer}</dd>
          </div>
          <div>
            <dt className="text-paper/40">Batch</dt>
            <dd className="text-paper/85">{product.batch}</dd>
          </div>
          <div>
            <dt className="text-paper/40">Origin</dt>
            <dd className="text-paper/85">{product.origin}</dd>
          </div>
          <div>
            <dt className="text-paper/40">Manufactured</dt>
            <dd className="text-paper/85">{product.manufacturedOn}</dd>
          </div>
        </dl>

        <div className="mb-6 rounded-lg border border-line bg-ink/60 p-4 text-left">
          <p className="mb-3 font-body text-xs uppercase tracking-wide text-paper/40">
            Supply-chain history
          </p>
          <p className="font-mono text-xs text-paper/70">
            {product.events.map((e) => e.label).join("  →  ")}
          </p>
        </div>

        <div className="mb-6 space-y-2 text-left">
          <p className="font-body text-xs uppercase tracking-wide text-paper/40">
            Documents
          </p>
          {product.documents.map((d) => (
            <div key={d.name} className="flex items-center gap-2 font-body text-sm text-paper/75">
              <FileText className="h-4 w-4 text-paper/40" />
              {d.name}
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-lg border border-line bg-ink/60 p-4 text-left font-body text-sm">
          <p className="mb-1 text-paper/40">Blockchain integrity</p>
          <p className="font-mono text-anchor">
            Algorand TestNet asset: {product.algorandAssetId}
          </p>
          <p className="mt-3 text-paper/40">Verification score</p>
          <p
            className={`font-mono text-2xl ${
              result.status === "AUTHENTIC" ? "text-verified" : "text-tampered"
            }`}
          >
            {result.score} / 100
          </p>
        </div>

        {!paid ? (
          <>
            <button
              onClick={() => {
                setPaying(true);
              }}
              disabled={paying}
              className="w-full rounded-full bg-paper py-3 font-body text-sm font-medium text-ink hover:bg-paper/90 disabled:opacity-60"
            >
              {paying ? "Verifying…" : "Verify independently — $0.01"}
            </button>
            {paying && (
              <div className="mt-4">
                <Terminal
                  script={script}
                  running={paying}
                  onDone={() => setPaid(true)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3 text-left">
            <p className="font-body text-xs uppercase tracking-wide text-paper/40">
              Independent check results
            </p>
            {result.checks.map((c) => (
              <div key={c.label} className="flex items-start gap-2 font-body text-sm">
                {c.pass ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-tampered" />
                )}
                <div>
                  <p className="text-paper/85">{c.label}</p>
                  <p className="text-xs text-paper/45">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        to={`/products/${product.id}/passport`}
        className="mt-6 block text-center font-mono text-xs text-paper/40 hover:text-paper/70"
      >
        View full manufacturer passport →
      </Link>
    </main>
  );
}

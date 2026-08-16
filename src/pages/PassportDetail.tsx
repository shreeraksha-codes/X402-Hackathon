import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { getProduct } from "../data/products";
import { verifyProduct } from "../lib/verify";
import StatusBadge from "../components/StatusBadge";
import HashChain from "../components/HashChain";

export default function PassportDetail() {
  const { productId } = useParams();
  const product = productId ? getProduct(productId) : undefined;
  const result = useMemo(() => (product ? verifyProduct(product) : null), [product]);

  if (!product || !result) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-heading text-3xl italic text-paper">Passport not found</h1>
        <Link to="/products" className="mt-4 inline-block font-mono text-sm text-anchor hover:underline">
          ← Back to dashboard
        </Link>
      </main>
    );
  }

  const verifyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/${product.id}`
      : `/verify/${product.id}`;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="mb-3">
            <StatusBadge status={result.status} />
          </div>
          <h1 className="mb-1 font-heading text-3xl italic text-paper">{product.name}</h1>
          <p className="font-mono text-xs text-paper/40">{product.id}</p>
        </div>
        <div className="rounded-xl border border-line bg-panel p-4 text-center">
          <QRCodeSVG value={verifyUrl} size={120} bgColor="transparent" fgColor="#F5F5F0" />
          <p className="mt-2 font-mono text-[10px] text-paper/40">scan to verify</p>
        </div>
      </div>

      <section className="mb-10 grid gap-6 md:grid-cols-3">
        <Field label="Manufacturer" value={product.manufacturer} />
        <Field label="Batch" value={product.batch} />
        <Field label="Origin" value={product.origin} />
        <Field label="Manufactured" value={product.manufacturedOn} />
        <Field label="Algorand asset" value={product.algorandAssetId} mono />
        <Field label="Verification score" value={`${result.score}/100`} mono />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-body text-sm uppercase tracking-wide text-paper/40">
          Provenance chain
        </h2>
        <div className="overflow-x-auto rounded-xl border border-line bg-panel p-4">
          <HashChain events={product.events} brokenAt={result.brokenAt} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-body text-sm uppercase tracking-wide text-paper/40">
          Documents &amp; anchored hashes
        </h2>
        <div className="space-y-3">
          {product.documents.map((d) => {
            const match = d.anchoredHash === d.currentHash && !product.tamperedOverride;
            return (
              <div key={d.name} className="rounded-lg border border-line bg-panel p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-body text-sm text-paper">{d.name}</span>
                  <span className={`font-mono text-xs ${match ? "text-verified" : "text-tampered"}`}>
                    {match ? "matches anchor" : "mismatch"}
                  </span>
                </div>
                <p className="hash-text text-xs text-paper/50">anchored: {d.anchoredHash}</p>
                <p className={`hash-text text-xs ${match ? "text-paper/50" : "text-tampered"}`}>
                  current:&nbsp;&nbsp;{d.currentHash}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-line bg-panel p-6">
        <h2 className="mb-3 font-body text-sm uppercase tracking-wide text-paper/40">
          Checks run by the verification engine
        </h2>
        <ul className="space-y-2 font-body text-sm text-paper/75">
          {result.checks.map((c) => (
            <li key={c.label}>
              <span className={c.pass ? "text-verified" : "text-tampered"}>
                {c.pass ? "✓" : "✕"}
              </span>{" "}
              {c.label} — <span className="text-paper/45">{c.detail}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <p className="mb-1 font-body text-xs text-paper/40">{label}</p>
      <p className={mono ? "hash-text text-sm text-paper" : "font-body text-sm text-paper"}>
        {value}
      </p>
    </div>
  );
}

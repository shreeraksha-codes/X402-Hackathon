import { useMemo } from "react";
import { Link } from "react-router-dom";
import { loadProducts } from "../data/products";
import { verifyProduct } from "../lib/verify";
import StatusBadge from "../components/StatusBadge";

export default function Products() {
  const products = useMemo(() => loadProducts(), []);
  const results = useMemo(() => products.map((p) => ({ p, r: verifyProduct(p) })), [products]);

  const authentic = results.filter((x) => x.r.status === "AUTHENTIC").length;
  const suspicious = results.filter((x) => x.r.status === "TAMPERED").length;

  const stats = [
    { label: "Products", value: products.length },
    { label: "Authentic", value: authentic },
    { label: "Suspicious", value: suspicious },
    { label: "Verification price", value: "$0.01" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 font-heading text-4xl italic text-paper">Dashboard</h1>
          <p className="font-body text-paper/60">Every passport your organization has issued.</p>
        </div>
        <Link
          to="/products/new"
          className="liquid-glass rounded-full px-5 py-2.5 font-body text-sm text-paper hover:bg-white/10"
        >
          + New Passport
        </Link>
      </header>

      <section className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-panel p-5">
            <p className="mb-1 font-mono text-2xl text-paper">{s.value}</p>
            <p className="font-body text-xs text-paper/40">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-line">
        <table className="w-full text-left font-body text-sm">
          <thead className="bg-panel text-paper/40">
            <tr>
              <th className="px-5 py-3 font-normal">Product</th>
              <th className="px-5 py-3 font-normal">Batch</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Score</th>
              <th className="px-5 py-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {results.map(({ p, r }) => (
              <tr key={p.id} className="border-t border-line hover:bg-panel/50">
                <td className="px-5 py-4">
                  <div className="text-paper">{p.name}</div>
                  <div className="font-mono text-xs text-paper/40">{p.id}</div>
                </td>
                <td className="px-5 py-4 text-paper/70">{p.batch}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-5 py-4 font-mono text-paper/70">{r.score}/100</td>
                <td className="px-5 py-4 text-right">
                  <Link
                    to={`/products/${p.id}/passport`}
                    className="font-mono text-xs text-anchor hover:underline"
                  >
                    View passport →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

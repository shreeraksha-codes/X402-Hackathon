import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SEED_PRODUCTS } from "../data/products";
import { verifyProduct } from "../lib/verify";
import { buildX402Script } from "../lib/x402";
import StatusBadge from "../components/StatusBadge";
import HashChain from "../components/HashChain";
import Terminal from "../components/Terminal";

export default function Demo() {
  const [tamperedB, setTamperedB] = useState(true); // product B ships tampered by default
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentTarget, setAgentTarget] = useState(SEED_PRODUCTS[0].id);
  const [agentDecision, setAgentDecision] = useState<null | "ACCEPT" | "REJECT">(null);

  const products = useMemo(() => {
    return SEED_PRODUCTS.map((p) =>
      p.id === SEED_PRODUCTS[1].id ? { ...p, tamperedOverride: tamperedB } : p
    );
  }, [tamperedB]);

  const results = useMemo(() => products.map((p) => ({ p, r: verifyProduct(p) })), [products]);

  const script = useMemo(() => buildX402Script(agentTarget), [agentTarget]);

  function runAgent(productId: string) {
    setAgentTarget(productId);
    setAgentDecision(null);
    setAgentRunning(true);
  }

  function onAgentDone() {
    setAgentRunning(false);
    const target = results.find((x) => x.p.id === agentTarget);
    if (!target) return;
    setAgentDecision(target.r.score >= 90 ? "ACCEPT" : "REJECT");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-12">
        <h1 className="mb-3 font-heading text-4xl italic text-paper md:text-5xl">
          Live demo
        </h1>
        <p className="max-w-2xl font-body text-paper/60">
          Two real passports, one verification engine. Scan either one, break
          a certificate on purpose, and watch an AI purchasing agent pay to
          find out what you already know.
        </p>
      </header>

      <section className="mb-16 grid gap-6 md:grid-cols-2">
        {results.map(({ p, r }) => (
          <div key={p.id} className="rounded-xl border border-line bg-panel p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-body text-lg text-paper">{p.name}</h2>
                <p className="font-mono text-xs text-paper/40">{p.id}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>

            <div className="mb-4 flex items-center gap-6 font-mono text-sm">
              <div>
                <div className="text-paper/40">score</div>
                <div className={r.status === "AUTHENTIC" ? "text-verified" : "text-tampered"}>
                  {r.score}/100
                </div>
              </div>
              <div>
                <div className="text-paper/40">batch</div>
                <div className="text-paper/70">{p.batch}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/verify/${p.id}`}
                className="rounded-full border border-line px-4 py-2 font-body text-xs text-paper/80 hover:border-paper/40 hover:text-paper"
              >
                Scan → open passport
              </Link>
              {p.id === SEED_PRODUCTS[1].id && (
                <button
                  onClick={() => setTamperedB((v) => !v)}
                  className="liquid-glass rounded-full px-4 py-2 font-body text-xs text-paper hover:bg-cream/10"
                >
                  {tamperedB ? "Restore certificate" : "Trigger tamper"}
                </button>
              )}
              <button
                onClick={() => runAgent(p.id)}
                className="rounded-full bg-paper px-4 py-2 font-body text-xs font-medium text-ink hover:bg-paper/90"
              >
                Run AI agent
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-16 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 font-body text-sm uppercase tracking-wide text-paper/40">
            Provenance chain — {results.find((x) => x.p.id === agentTarget)?.p.name}
          </h3>
          <div className="rounded-xl border border-line bg-panel p-4">
            {(() => {
              const target = results.find((x) => x.p.id === agentTarget);
              if (!target) return null;
              return <HashChain events={target.p.events} brokenAt={target.r.brokenAt} />;
            })()}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-body text-sm uppercase tracking-wide text-paper/40">
            x402 test API — GET /api/v1/verify/{agentTarget}
          </h3>
          <Terminal script={script} running={agentRunning} onDone={onAgentDone} />
          {agentDecision && (
            <div
              className={`mt-3 font-mono text-sm ${
                agentDecision === "ACCEPT" ? "text-verified" : "text-tampered"
              }`}
            >
              agent decision: {agentDecision}
              {agentDecision === "REJECT" && " (score below 90 threshold)"}
            </div>
          )}
          <p className="mt-3 font-body text-xs text-paper/40">
            Spending policy: max $0.01/request, $1.00/day, accept only scores ≥ 90.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-panel p-6">
        <h3 className="mb-2 font-body text-sm uppercase tracking-wide text-paper/40">
          View on Algorand
        </h3>
        <p className="font-mono text-sm text-anchor">
          Asset {results.find((x) => x.p.id === agentTarget)?.p.algorandAssetId} · TestNet
        </p>
        <p className="mt-2 max-w-2xl font-body text-xs text-paper/50">
          In production this links out to the Algorand TestNet explorer for
          the anchored transaction. The anchor proves the certificate hash
          existed at a point in time — it is a record-integrity proof, not a
          claim that the physical product itself is genuine.
        </p>
      </section>
    </main>
  );
}

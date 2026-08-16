import type { ProvenanceEvent } from "../data/products";

export default function HashChain({
  events,
  brokenAt,
}: {
  events: ProvenanceEvent[];
  brokenAt: number | null;
}) {
  return (
    <div className="hash-text overflow-x-auto">
      <div className="flex min-w-max items-stretch">
        {events.map((e, i) => {
          const isBroken = brokenAt === i;
          return (
            <div key={e.id} className="flex items-stretch">
              <div
                className={`w-52 rounded-lg border px-4 py-3 text-xs ${
                  isBroken
                    ? "border-tampered/50 bg-tampered/10"
                    : "border-line bg-panel"
                }`}
              >
                <div className="mb-1 text-[11px] uppercase tracking-wide text-paper/40">
                  {e.timestamp}
                </div>
                <div className="mb-2 font-body text-sm text-paper">{e.label}</div>
                <div className="text-paper/50">actor: {e.actor}</div>
                <div className={isBroken ? "text-tampered" : "text-anchor"}>
                  hash: {e.hash}
                </div>
                {e.previousHash && (
                  <div className={isBroken ? "text-tampered" : "text-paper/40"}>
                    prev: {e.previousHash}
                  </div>
                )}
              </div>
              {i < events.length - 1 && (
                <div className="flex w-10 items-center justify-center">
                  <span
                    className={`h-px w-full origin-left ${
                      brokenAt !== null && i === brokenAt - 1
                        ? "crack bg-tampered"
                        : "bg-line"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

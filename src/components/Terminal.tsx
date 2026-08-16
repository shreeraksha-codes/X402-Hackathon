import { useEffect, useState } from "react";
import type { X402Step } from "../lib/x402";

export default function Terminal({
  script,
  running,
  onDone,
  prompt = "$",
}: {
  script: X402Step[];
  running: boolean;
  onDone?: () => void;
  prompt?: string;
}) {
  const [lines, setLines] = useState<X402Step[]>([]);

  useEffect(() => {
    if (!running) {
      setLines([]);
      return;
    }
    let cancelled = false;
    setLines([]);

    (async () => {
      for (const step of script) {
        await new Promise((r) => setTimeout(r, step.delay));
        if (cancelled) return;
        setLines((prev) => [...prev, step]);
      }
      if (!cancelled) onDone?.();
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const toneClass: Record<string, string> = {
    default: "text-paper/80",
    muted: "text-paper/40",
    success: "text-verified",
    warn: "text-tampered",
  };

  return (
    <div className="hash-text rounded-lg border border-line bg-black/60 p-4 text-xs leading-relaxed">
      {lines.length === 0 && !running && (
        <div className="text-paper/30">awaiting request...</div>
      )}
      {lines.map((l, i) => (
        <div key={i} className={toneClass[l.tone ?? "default"]}>
          <span className="text-paper/30">{prompt} </span>
          {l.text}
        </div>
      ))}
      {running && lines.length < script.length && (
        <div className="text-paper/30">
          <span className="animate-pulse">▊</span>
        </div>
      )}
    </div>
  );
}

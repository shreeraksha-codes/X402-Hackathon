import { Link } from "react-router-dom";
import { ScanLine, Link2, ShieldCheck, Bot } from "lucide-react";
import CTAFooter from "../components/CTAFooter";

const steps = [
  {
    icon: ScanLine,
    title: "Scan",
    body: "Every physical product carries a QR code pointing at its own passport — no app to install.",
  },
  {
    icon: Link2,
    title: "Anchor",
    body: "Certificates and provenance events are hashed and chained; a fingerprint of that chain is anchored on Algorand.",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    body: "The verification engine recomputes the chain and compares it against the anchor. A single altered document breaks it visibly.",
  },
  {
    icon: Bot,
    title: "Pay & trust",
    body: "Verification is an x402 endpoint: $0.01 per check, payable by a person or an autonomous purchasing agent.",
  },
];

export default function Landing() {
  return (
    <main>
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-24 text-center md:pt-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-xs text-paper/50">
          <span className="h-1.5 w-1.5 rounded-full bg-verified" />
          Algorand TestNet · x402 on Base Sepolia
        </div>
        <h1 className="mx-auto max-w-3xl font-heading text-5xl italic leading-[0.95] text-paper md:text-7xl">
          Every product deserves a verifiable history.
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-body text-base text-paper/60 md:text-lg">
          DDP-X turns a physical product into a Digital Passport: a
          cryptographically chained history that anyone — human or AI — can
          independently check for a cent.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/demo"
            className="liquid-glass rounded-full px-6 py-3 font-body text-sm font-medium text-paper hover:bg-black/5"
          >
            Explore the live demo
          </Link>
          <Link
            to="/verify/PX-2026-7F92A18D"
            className="rounded-full border border-line px-6 py-3 font-body text-sm font-medium text-paper/80 hover:border-paper/40 hover:text-paper"
          >
            View a sample passport
          </Link>
        </div>
      </section>

      <section className="border-y border-line bg-panel/40">
        <div className="mx-auto grid max-w-6xl gap-px bg-line px-0 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.title} className="bg-ink px-6 py-10">
              <s.icon className="mb-4 h-5 w-5 text-anchor" />
              <h3 className="mb-2 font-body text-base font-medium text-paper">
                {s.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-paper/55">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-4 font-heading text-3xl italic text-paper md:text-4xl">
              One broken hash tells the whole story.
            </h2>
            <p className="font-body text-sm leading-relaxed text-paper/60 md:text-base">
              Each provenance event links to the one before it through its
              hash. Swap a certificate after it's been anchored, and the
              chain no longer reconciles — visibly, immediately, without
              anyone needing to trust a claim.
            </p>
            <Link
              to="/demo"
              className="mt-6 inline-block font-mono text-sm text-anchor hover:underline"
            >
              See it break in the demo →
            </Link>
          </div>
          <div className="hash-text rounded-xl border border-line bg-panel p-6 text-xs text-paper/50">
            <div className="mb-2 text-paper/70">certificate.pdf</div>
            <div>SHA256 (anchored): 3F2A9C1E7B0D5A44...</div>
            <div className="mt-1 text-tampered">
              SHA256 (current): 8E71C0A2B4D6F9E1...
            </div>
            <div className="mt-4 border-t border-line pt-4 text-tampered">
              status: TAMPERED — document replaced after anchoring
            </div>
          </div>
        </div>
      </section>

      <CTAFooter />
    </main>
  );
}

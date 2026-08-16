import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { generateProductId, randomAssetId, sha256Hex } from "../lib/x402";
import { saveProduct, type Product } from "../data/products";

const STAGES = ["Manufactured", "Transferred to distributor", "Received by carrier", "Delivered to retailer"];

export default function NewProduct() {
  const [form, setForm] = useState({
    name: "AstraSense Industrial Sensor",
    manufacturer: "Astra Industrial Systems",
    batch: "",
    origin: "India",
    manufacturedOn: new Date().toISOString().slice(0, 10),
    certificateText: "",
  });
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<Product | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function createPassport(e: FormEvent) {
    e.preventDefault();
    if (!form.batch.trim()) return;
    setCreating(true);

    const id = generateProductId();
    const certHash = await sha256Hex(form.certificateText || `${id}-${form.batch}-${Date.now()}`);
    const assetId = randomAssetId();

    let prev: string | null = null;
    const events = await Promise.all(
      STAGES.map(async (label, i) => {
        const hash = (await sha256Hex(`${id}-${label}-${i}`)).slice(0, 24);
        const evt = {
          id: `evt-${i}`,
          label,
          actor: i === 0 ? form.manufacturer : `Logistics partner ${i}`,
          timestamp: form.manufacturedOn,
          hash,
          previousHash: prev,
        };
        prev = hash;
        return evt;
      })
    );

    const product: Product = {
      id,
      name: form.name,
      manufacturer: form.manufacturer,
      batch: form.batch,
      origin: form.origin,
      manufacturedOn: form.manufacturedOn,
      algorandAssetId: assetId,
      events,
      documents: [
        {
          name: "certificate-of-manufacture.pdf",
          anchoredHash: certHash.slice(0, 32),
          currentHash: certHash.slice(0, 32),
        },
      ],
    };

    saveProduct(product);
    setCreated(product);
    setCreating(false);
  }

  if (created) {
    const verifyUrl =
      typeof window !== "undefined" ? `${window.location.origin}/verify/${created.id}` : "";
    return (
      <main className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="mb-2 font-mono text-xs text-verified">passport created</p>
        <h1 className="mb-6 font-heading text-3xl italic text-paper">{created.name}</h1>

        <div className="mx-auto mb-6 inline-block rounded-xl border border-line bg-panel p-6">
          <QRCodeSVG value={verifyUrl} size={180} bgColor="transparent" fgColor="#F5F5F0" />
        </div>

        <p className="mb-1 font-mono text-xs text-paper/50">{created.id}</p>
        <p className="mb-6 font-mono text-xs text-anchor">
          Algorand asset {created.algorandAssetId}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to={`/verify/${created.id}`}
            className="rounded-full bg-paper px-5 py-2.5 font-body text-sm font-medium text-ink hover:bg-paper/90"
          >
            Open passport
          </Link>
          <Link
            to={`/products/${created.id}/passport`}
            className="liquid-glass rounded-full px-5 py-2.5 font-body text-sm text-paper hover:bg-white/10"
          >
            View manufacturer view
          </Link>
        </div>
        <p className="mt-8">
          <Link to="/products/new" className="font-mono text-xs text-paper/40 hover:text-paper/70">
            Create another →
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="mb-2 font-heading text-3xl italic text-paper">Create Digital Passport</h1>
      <p className="mb-8 font-body text-sm text-paper/60">
        This generates a product ID, hashes the certificate text below, mints
        a mock Algorand asset, and produces a QR code pointing at the
        passport.
      </p>

      <form onSubmit={createPassport} className="space-y-5">
        <Field label="Product name">
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="input"
            required
          />
        </Field>
        <Field label="Manufacturer">
          <input
            value={form.manufacturer}
            onChange={(e) => set("manufacturer", e.target.value)}
            className="input"
            required
          />
        </Field>
        <Field label="Batch">
          <input
            value={form.batch}
            onChange={(e) => set("batch", e.target.value)}
            placeholder="AS-2026-004"
            className="input"
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Origin">
            <input
              value={form.origin}
              onChange={(e) => set("origin", e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="Manufactured on">
            <input
              type="date"
              value={form.manufacturedOn}
              onChange={(e) => set("manufacturedOn", e.target.value)}
              className="input"
              required
            />
          </Field>
        </div>
        <Field label="Certificate text (stand-in for an uploaded PDF)">
          <textarea
            value={form.certificateText}
            onChange={(e) => set("certificateText", e.target.value)}
            placeholder="Paste or type the certificate contents to hash…"
            rows={4}
            className="input resize-none"
          />
        </Field>

        <button
          type="submit"
          disabled={creating}
          className="w-full rounded-full bg-paper py-3 font-body text-sm font-medium text-ink hover:bg-paper/90 disabled:opacity-60"
        >
          {creating ? "Anchoring…" : "Create Passport"}
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-body text-xs text-paper/50">{label}</span>
      {children}
    </label>
  );
}

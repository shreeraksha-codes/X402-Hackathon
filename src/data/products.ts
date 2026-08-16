export type ProvenanceEvent = {
  id: string;
  label: string;
  actor: string;
  timestamp: string;
  hash: string;
  previousHash: string | null;
};

export type PassportDocument = {
  name: string;
  anchoredHash: string;
  // In the demo, product B's certificate has been swapped after anchoring —
  // currentHash differs from anchoredHash, which is exactly what the
  // verification engine is designed to catch.
  currentHash: string;
};

export type Product = {
  id: string;
  name: string;
  manufacturer: string;
  batch: string;
  origin: string;
  manufacturedOn: string;
  algorandAssetId: string;
  events: ProvenanceEvent[];
  documents: PassportDocument[];
  tamperedOverride?: boolean;
};

const STORAGE_KEY = "ddpx:products";

function chainHash(seed: string, i: number) {
  return (
    seed.slice(0, 6) +
    i.toString(16).padStart(2, "0") +
    Math.abs(hashCode(seed + i)).toString(16).slice(0, 6)
  ).toUpperCase();
}

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function buildEvents(productId: string): ProvenanceEvent[] {
  const stages = [
    { label: "Manufactured", actor: "Astra Industrial Systems" },
    { label: "Transferred to distributor", actor: "Astra Logistics Co." },
    { label: "Received by carrier", actor: "Meridian Freight" },
    { label: "Delivered to retailer", actor: "Northpoint Supply" },
  ];
  let prev: string | null = null;
  return stages.map((s, i) => {
    const hash = chainHash(productId + s.label, i);
    const event: ProvenanceEvent = {
      id: `evt-${i}`,
      label: s.label,
      actor: s.actor,
      timestamp: `2026-08-${(10 + i).toString().padStart(2, "0")}`,
      hash,
      previousHash: prev,
    };
    prev = hash;
    return event;
  });
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: "PX-2026-7F92A18D",
    name: "AstraSense Industrial Sensor",
    manufacturer: "Astra Industrial Systems",
    batch: "AS-2026-001",
    origin: "India",
    manufacturedOn: "2026-08-15",
    algorandAssetId: "884213709",
    events: buildEvents("PX-2026-7F92A18D"),
    documents: [
      {
        name: "certificate-of-manufacture.pdf",
        anchoredHash: "3F2A9C1E7B0D5A44C9F1E2B3A7D6C0F1",
        currentHash: "3F2A9C1E7B0D5A44C9F1E2B3A7D6C0F1",
      },
      {
        name: "quality-certificate.pdf",
        anchoredHash: "9B1D4E6F0A2C8B7D3E5F1A9C0B2D4E6F",
        currentHash: "9B1D4E6F0A2C8B7D3E5F1A9C0B2D4E6F",
      },
    ],
  },
  {
    id: "PX-2026-C41B7E90",
    name: "AstraSense Industrial Sensor",
    manufacturer: "Astra Industrial Systems",
    batch: "AS-2026-003",
    origin: "India",
    manufacturedOn: "2026-08-15",
    algorandAssetId: "884213742",
    events: buildEvents("PX-2026-C41B7E90"),
    documents: [
      {
        name: "certificate-of-manufacture.pdf",
        anchoredHash: "3F2A9C1E7B0D5A44C9F1E2B3A7D6C0F1",
        currentHash: "8E71C0A2B4D6F9E1A3C5B7D9F0E2A4C6",
      },
      {
        name: "quality-certificate.pdf",
        anchoredHash: "9B1D4E6F0A2C8B7D3E5F1A9C0B2D4E6F",
        currentHash: "9B1D4E6F0A2C8B7D3E5F1A9C0B2D4E6F",
      },
    ],
  },
];

export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_PRODUCTS;
    const parsed = JSON.parse(raw) as Product[];
    return [...SEED_PRODUCTS, ...parsed];
  } catch {
    return SEED_PRODUCTS;
  }
}

export function saveProduct(product: Product) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const custom: Product[] = raw ? JSON.parse(raw) : [];
    custom.push(product);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
  } catch {
    // ignore storage failures — demo still works in-memory for this session
  }
}

export function getProduct(id: string): Product | undefined {
  return loadProducts().find((p) => p.id === id);
}

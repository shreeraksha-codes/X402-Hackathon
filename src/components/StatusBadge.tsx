import { ShieldCheck, ShieldAlert } from "lucide-react";

export default function StatusBadge({ status, size = "md" }: { status: "AUTHENTIC" | "TAMPERED"; size?: "md" | "lg" }) {
  const authentic = status === "AUTHENTIC";
  const Icon = authentic ? ShieldCheck : ShieldAlert;
  const big = size === "lg";
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 ${
        big ? "py-2 text-base" : "py-1.5 text-sm"
      } font-mono ${
        authentic
          ? "border-verified/40 bg-verified/10 text-verified"
          : "border-tampered/40 bg-tampered/10 text-tampered"
      }`}
    >
      <Icon className={big ? "h-5 w-5" : "h-4 w-4"} />
      {status}
    </div>
  );
}

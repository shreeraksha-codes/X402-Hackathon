import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0B",
        panel: "#111113",
        line: "rgba(245,245,240,0.10)",
        paper: "#F5F5F0",
        verified: "#34D399",
        tampered: "#F0563D",
        anchor: "#5FC7E8",
      },
      fontFamily: {
        heading: ["'Instrument Serif'", "serif"],
        body: ["'Barlow'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glass: "4px 4px 4px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#F5F5F0",       // Light background
        panel: "#FFFFFF",     // White panels
        line: "rgba(10, 10, 11, 0.10)", // Dark line
        paper: "#0A0A0B",     // Dark text
        verified: "#059669",  // Darker green for light theme
        tampered: "#DC2626",  // Darker red for light theme
        anchor: "#0284C7",    // Darker blue for light theme
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Lora'", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glass: "4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.4)",
      },
    },
  },
  plugins: [],
} satisfies Config;

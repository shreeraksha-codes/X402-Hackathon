import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A192F",       // Navy Blue
        panel: "#E5E4E2",     // Platinum
        line: "rgba(10, 25, 47, 0.15)", // Navy with opacity for lines
        paper: "#F9F6EE",     // Cream
        verified: "#0A192F",  // Navy Blue
        tampered: "#E5E4E2",  // Platinum
        anchor: "#0A192F",    // Navy Blue
        
        navy: "#0A192F",
        cream: "#F9F6EE",
        platinum: "#E5E4E2",
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Lora'", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glass: "4px 4px 4px rgba(10, 25, 47, 0.05), inset 0 1px 1px rgba(255,255,255,0.4)",
      },
    },
  },
  plugins: [],
} satisfies Config;

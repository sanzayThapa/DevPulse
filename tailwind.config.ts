import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "hsl(var(--canvas))",
        panel: "hsl(var(--panel))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        foreground: "hsl(var(--foreground))",
        subtle: "hsl(var(--subtle))",
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22"
        },
        ink: {
          800: "#1f2937",
          900: "#111827",
          950: "#030712"
        }
      },
      boxShadow: {
        soft: "0 16px 40px -28px rgba(0, 0, 0, 0.55)",
        elevated: "0 24px 70px -42px rgba(0, 0, 0, 0.7)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;

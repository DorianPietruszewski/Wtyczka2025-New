import type { Config } from "tailwindcss";

const config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./public/**/*.svg",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "arrow-move": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(4px)" },
        },
        "neon-glow": {
          "0%": { boxShadow: "0 0 32px 4px #22d3ee, 0 0 64px 8px #22d3ee44" },
          "75%": { boxShadow: "0 0 32px 4px #22d3ee, 0 0 64px 8px #22d3ee44" },
          "88%": { boxShadow: "0 0 64px 12px #22d3ee, 0 0 128px 24px #22d3ee88" },
          "100%": { boxShadow: "0 0 32px 4px #22d3ee, 0 0 64px 8px #22d3ee44" },
        },
      },
      animation: {
        "arrow-move": "arrow-move 1s ease-in-out infinite",
        "glow": "neon-glow 4.5s cubic-bezier(0.77,0,0.18,1) infinite",
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "1.5rem",
        md: "1rem",
        sm: "0.5rem",
        full: "9999px",
      },
      boxShadow: {
        'neon-cyan': '0 0 16px 2px rgba(34,211,238,0.7), 0 0 32px 6px rgba(34,211,238,0.4)',
      },
    },
  },
  plugins: [
    function (pluginApi: any) {
      pluginApi.addUtilities({
        '.neon-border': {
          border: '2px solid #22d3ee',
          boxShadow: '0 0 16px 2px rgba(34,211,238,0.7), 0 0 32px 6px rgba(34,211,238,0.4)',
        },
      })
    },
  ],
} satisfies Config;

export default config;

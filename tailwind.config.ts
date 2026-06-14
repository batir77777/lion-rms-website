import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060e1f",
          900: "#0c1f3f",
          800: "#102a57",
          700: "#163370",
          600: "#1e4285",
          500: "#2a5ba6",
          400: "#4278c4",
          300: "#7aa3d6",
          200: "#b3cce8",
          100: "#ddeaf8",
          50:  "#eef4fb",
        },
        mws: {
          950: "#070c18",
          900: "#0a0f1e",
          800: "#111827",
          700: "#161e32",
          600: "#1e2a44",
          teal: "#0ea5a0",
          green: "#10b981",
        },
        brand: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#ffdba8",
          300: "#ffc070",
          400: "#ff9d36",
          500: "#f97f11",
          600: "#ea6507",
          700: "#c24b08",
          800: "#9a3c0f",
          900: "#7c3310",
          950: "#431806",
        },
        ink: {
          50: "#f8f6f2",
          100: "#efebe4",
          200: "#ded7cc",
          300: "#c0b6a8",
          400: "#9c9183",
          500: "#7d7265",
          600: "#5f5749",
          700: "#4a443a",
          800: "#2e2a24",
          900: "#1c1915",
          950: "#0e0c09",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      letterSpacing: { tightest: "-0.045em" },
      boxShadow: {
        lift: "0 12px 32px -12px rgba(14, 12, 9, 0.18)",
        ember: "0 0 0 1px rgba(249, 127, 17, 0.35), 0 16px 40px -16px rgba(249, 127, 17, 0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slow-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "slow-zoom": "slow-zoom 18s ease-out forwards",
        kenburns: "slow-zoom 26s ease-in-out infinite alternate",
        marquee: "marquee 36s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

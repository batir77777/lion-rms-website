import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd3ff",
          300: "#8eb5ff",
          400: "#5b8cff",
          500: "#3b6cf6",
          600: "#244ee8",
          700: "#1d3fd1",
          800: "#1e36a8",
          900: "#1f3285",
          950: "#161e4d",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef3",
          200: "#d4d8e2",
          300: "#aab2c5",
          400: "#828ca6",
          500: "#5b6883",
          600: "#46506a",
          700: "#3a4258",
          800: "#262c3d",
          900: "#161a26",
          950: "#0b0e16",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
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
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "slow-zoom": "slow-zoom 18s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;

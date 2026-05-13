import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAFAF7",
          100: "#F5F1EB",
          200: "#EDE8E1",
          300: "#E2DDD6",
          400: "#D4CEC6",
        },
        forest: {
          50: "#EAF3DE",
          100: "#C0DD97",
          200: "#97C459",
          300: "#639922",
          400: "#3D6B47",
          500: "#2D5A3D",
          600: "#27500A",
          700: "#1C3D28",
          800: "#173404",
        },
        ink: {
          50: "#F5F4F0",
          100: "#E8E4DC",
          200: "#C8C2BB",
          300: "#9A9590",
          400: "#6A6560",
          500: "#4A4540",
          600: "#2C2820",
          700: "#1C1A17",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
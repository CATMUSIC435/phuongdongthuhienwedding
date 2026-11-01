import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: "#8C0000",
          deep: "#5A0000",
          dark: "#2F0000",
          bright: "#990000",
          ruby: "#920002",
        },
        gold: {
          light: "#FFE8A4",
          rose: "#FDCB9C",
          cream: "#FFF9E6",
        },
      },
      fontFamily: {
        script: ["var(--font-carattere)", "cursive"],
        madi: ["var(--font-ms-madi)", "cursive"],
        nautigal: ["var(--font-nautigal)", "cursive"],
        fraunces: ["var(--font-fraunces)", "serif"],
        lora: ["var(--font-lora)", "serif"],
        serif: ["var(--font-lora)", "Times New Roman", "serif"],
        sans: ["var(--font-be-vietnam)", "Helvetica Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0E0C0A",
        /** Product cards / panels (design spec) */
        "shop-surface": "#1A1410",
        /** Light-mode card / panel surfaces */
        cream: "#EDE6D8",
        "cream-deep": "#E0D6C8",
        "obsidian-light": "#1A1714",
        "obsidian-mid": "#2C2520",
        gold: "#C9A96E",
        "gold-light": "#E8C98A",
        "gold-muted": "#8A6E47",
        ivory: "#F5EDD8",
        "ivory-muted": "#C4B89A",
        walnut: "#3D2B1F",
        "walnut-light": "#7A5C3C",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

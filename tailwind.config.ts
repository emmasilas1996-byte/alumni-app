import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#10213f",
        "navy-deep": "#0a1730",
        gold: "#c8992e",
        "gold-light": "#e6c878",
        ivory: "#f7f4ec",
        ink: "#1c2130",
        line: "#e7e2d4",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

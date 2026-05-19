import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        unkhair: {
          DEFAULT: "#0d7a3f",
          dark: "#075c2f",
          light: "#1ea15a",
          gold: "#d4a017",
          cream: "#fdf6e3",
        },
      },
      fontFamily: {
        serif: ["ui-serif", "Georgia", "Cambria", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;

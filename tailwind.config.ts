import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        darkBg: "var(--color-bg-dark)",
        surface: "var(--color-surface)",
        overlay: "var(--color-overlay)"
      },
      fontSize: {
        largeScore: "4rem",
        caption: "0.8rem",
      },
      borderRadius: {
        medium: "var(--border-radius-medium)"
      },
      opacity: {
        medium: "0.5",
      },
    },
  },
  plugins: [],
} satisfies Config;

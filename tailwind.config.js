/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Dynamic color classes used in budget sliders & badges
    "bg-accent/15", "bg-danger/15", "bg-amber/15",
    "text-accent", "text-danger", "text-amber", "text-success", "text-muted",
    "border-accent", "border-danger", "border-amber",
    "bg-indigo/15", "text-indigo",
  ],
  theme: {
    extend: {
      colors: {
        bg:      "#060b18",
        s1:      "#0d1526",
        s2:      "#131f35",
        border:  "#1e2d45",
        accent:  "#00e5b8",
        indigo:  "#5b5ef4",
        amber:   "#f5a623",
        text:    "#e8edf5",
        muted:   "#5a6a84",
        danger:  "#f04060",
        success: "#00c98d",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "18px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

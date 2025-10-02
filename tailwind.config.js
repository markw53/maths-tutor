// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // optional if you want light/dark switching
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ensures Tailwind scans all components
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0, 0%, 100%)", // white
        foreground: "hsl(222, 47%, 11%)", // near-black
        primary: {
          DEFAULT: "hsl(239, 84%, 67%)", // indigo (brand)
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          foreground: "hsl(215, 16%, 47%)", // gray text
        },
        border: "hsl(214, 32%, 91%)",
      },
    },
  },
  plugins: [],
};
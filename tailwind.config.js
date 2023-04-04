/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        header: "3.5rem",
        "side-menu": "min(100%, 20rem)",
        chat: "min(100%, 50rem)",
      },
      colors: {
        primary: "var(--clr-primary)",
        accent: "var(--clr-accent)",
        background: "var(--clr-background)",
        contrast: "var(--clr-contrast)",
        highlight: "var(--clr-highlight)",
        divider: "var(--clr-divider)",
      },
      keyframes: {
        appear: {
          "0%": { opacity: 0 },
          "30%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        appear: "appear 1s forwards",
      },
      opacity: {
        hover: "0.2",
      },
    },
  },
  plugins: [],
};

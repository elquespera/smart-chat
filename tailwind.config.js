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
        background: "var(--clr-background)",
        contrast: "var(--clr-contrast)",
        highlight: "var(--clr-highlight)",
        divider: "var(--clr-divider)",
        user: "var(--clr-user)",
        assistant: "var(--clr-assistant)",
      },
    },
  },
  plugins: [],
};

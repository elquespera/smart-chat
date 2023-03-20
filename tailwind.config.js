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
        header: "3rem",
      },
      colors: {
        primary: "#000",
        background: "#fff",
        "background-tranparent": "#fff0",
        user: "#fff",
        assistant: "#eee",
      },
    },
  },
  plugins: [],
};

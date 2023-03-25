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
        primary: "#000",
        background: "#fff",
        contrast: "#fff",
        "background-tranparent": "#fff0",
        divider: "#bbb",
        user: "#fff",
        assistant: "#eee",
      },
    },
  },
  plugins: [],
};

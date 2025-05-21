
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          darkblue: "#0e395f",
          yellow: "#FFCB3C",
          sky: "#96b4c7",
          dark: "#222222",
          white: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
}

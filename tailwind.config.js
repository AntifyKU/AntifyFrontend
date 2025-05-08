/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#0A9D5C',
        secondary: '#5DC7A7',
        background: '#e6f0d8',
        detailBg: '#f5f7e8',
      },
    },
  },
  plugins: [],
}
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // adjust if needed
  ],
  theme: {
    extend: {
      colors: {
        brand: "oklch(55% 0.21 265)", // indigo-ish
      },
    },
  },
  plugins: [],
};

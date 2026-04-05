/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cherry-red': '#D32F2F',
        'cherry-dark': '#8B1A1A',
        'cherry-mid': '#B22222',
      }
    },
  },
  plugins: [],
}

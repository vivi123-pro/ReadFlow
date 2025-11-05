/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#C6B8A6', // Warm Taupe Gray
        accent1: '#E9C8A7', // Blush Gold
        accent2: '#E8B7B7', // Soft Rose Dust
        background: '#FDFBF9', // Porcelain Cream
        text: '#2C2A26', // Deep Charcoal
        border: '#E7E2DC', // Mist Beige
        highlight: '#F3D69C', // Muted Honey
      },
      fontFamily: {
        serif: ['Playfair Display', 'DM Serif Display', 'serif'],
        sans: ['Inter', 'Nunito Sans', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

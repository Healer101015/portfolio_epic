/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        background: '#050505',
        surface: 'rgba(20, 20, 20, 0.6)',
        primary: '#38bdf8', // Sky 400
      }
    },
  },
  plugins: [],
}
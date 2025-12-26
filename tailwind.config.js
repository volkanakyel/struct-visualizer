/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        secondary: '#1e293b',
        primary: '#334155',
        accent: '#64748b',
        text: '#f8fafc',
        yellow: '#fbbf24',
        orange: '#fb923c',
        green: '#4ade80',
        red: '#f87171',
        blue: '#60a5fa',
        purple: '#a78bfa'
      }
    },
  },
  plugins: [],
}

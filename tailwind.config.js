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
        // Light mode palette - high contrast, minimal
        background: '#fafafa',
        surface: '#ffffff',
        secondary: '#f5f5f5',
        primary: '#0a0a0a',
        accent: '#737373',
        muted: '#a3a3a3',
        border: '#e5e5e5',
        borderDark: '#0a0a0a',
        text: '#0a0a0a',
        textMuted: '#525252',
        // Semantic colors - refined for light mode
        yellow: '#ca8a04',
        orange: '#ea580c',
        green: '#16a34a',
        red: '#dc2626',
        blue: '#2563eb',
        purple: '#7c3aed'
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'cardHover': '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

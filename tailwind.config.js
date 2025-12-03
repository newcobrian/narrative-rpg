/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        'nes-navy': '#0D1B2A',
        'nes-panel': '#1B263B',
        'nes-border': '#415A77',
        'nes-text': '#E0E1DD',
        'nes-gold': '#C4A962',
        'nes-hp-lost': '#BF616A',
        'nes-hp-remaining': '#A3BE8C',
      },
    },
  },
  plugins: [],
}


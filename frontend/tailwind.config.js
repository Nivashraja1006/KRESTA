/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#2f533c',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        kresta: {
          gold: '#d4af37',
          'gold-light': '#f3e5ab',
          'gold-dark': '#aa820a',
          'gold-metallic': '#c59b27',
          cream: '#fcfaf6',
          'cream-muted': '#eae5d9',
          emerald: '#10b981',
          'emerald-light': '#34d399',
          'emerald-dark': '#064e3b',
        },
        navy: {
          800: '#141d33',
          850: '#0f172a',
          900: '#0b1122',
          950: '#070b16',
          975: '#04070d',
        },
        slate: {
          850: '#151f32',
          900: '#0f172a',
          950: '#080d1a',
          975: '#05070f',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cinzel', 'Georgia', 'serif'],
        display: ['Cinzel', '"Playfair Display"', 'Georgia', 'serif'],
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(212, 175, 55, 0.25)',
        'glow-gold-lg': '0 0 50px rgba(212, 175, 55, 0.22)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.25)',
        'glow-emerald-lg': '0 0 50px rgba(16, 185, 129, 0.22)',
        'glass-edge': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
      }
    },
  },
  plugins: [],
}

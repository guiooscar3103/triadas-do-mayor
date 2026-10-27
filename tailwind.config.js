/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        music: ['Noto Music', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        studio: {
          bg: '#0A0A0B',
          panel: '#151516',
          surface: '#202022',
          border: '#303034',
          'border-subtle': '#242428',
          'border-gold': 'rgba(198, 161, 91, 0.4)',
          text: '#F1F0EC',
          muted: '#A09FA3',
          faint: '#68676B',
          gold: '#C6A15B',
          'gold-hover': '#D4B06A',
          'gold-subtle': 'rgba(198, 161, 91, 0.12)'
        },
        triad: {
          root: '#C6A15B',     // Fundamental: Dorado sobrio
          third: '#2DD4BF',    // Tercera: Turquesa suave
          fifth: '#818CF8',    // Quinta: Lavanda / Azul grisáceo
          passing: '#202024',  // Nota de paso
          'passing-text': '#8A898D'
        }
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.6))' },
          '100%': { filter: 'drop-shadow(0 0 14px rgba(239, 68, 68, 0.9))' },
        }
      }
    },
  },
  plugins: [],
}

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
        fretboard: {
          wood: '#1e1b18',
          fret: '#94a3b8',
          inlay: '#475569',
          nut: '#cbd5e1',
        },
        triad: {
          root: '#ef4444',
          third: '#0ea5e9',
          fifth: '#f59e0b',
          passing: '#334155',
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

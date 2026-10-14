/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tw: {
          bg: '#0B0D0C',
          'surface-1': '#111413',
          'surface-2': '#171B19',
          'surface-3': '#1E2320',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-subtle': 'rgba(255, 255, 255, 0.14)',
          accent: '#E8A33D',
          'accent-dim': 'rgba(232, 163, 61, 0.15)',
          text: {
            primary: '#E8EAE6',
            secondary: '#9AA09A',
            tertiary: '#5E655F',
          },
          severity: {
            low: '#7A9E7E',
            medium: '#D9B44A',
            high: '#E07B39',
            critical: '#D64545',
          },
          data: {
            veg: '#6FA06B',
            water: '#4A8FA3',
            soil: '#A88663',
          }
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}

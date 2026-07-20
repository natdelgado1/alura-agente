/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta BimBam Buy × Platzi: fondo azul marino casi negro + acento verde vibrante.
        ink: {
          950: '#060912',
          900: '#0a0f1e',
          800: '#111728',
          700: '#1a2238',
          600: '#252f4a',
          500: '#3a4565',
          400: '#5a6485',
          300: '#8a93b3',
        },
        accent: {
          DEFAULT: '#22c55e',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34, 197, 94, 0.25), 0 8px 24px -8px rgba(34, 197, 94, 0.35)',
        bubble: '0 6px 20px -10px rgba(0, 0, 0, 0.6)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'typing-dot': {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-4px)', opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-up': 'fade-up 240ms ease-out both',
        'typing-dot': 'typing-dot 1.2s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

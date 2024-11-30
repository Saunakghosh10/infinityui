const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          secondary: 'var(--background-secondary)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          secondary: 'var(--foreground-secondary)',
        },
        border: {
          DEFAULT: 'var(--border)',
          secondary: 'var(--border-secondary)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
      },
      animation: {
        'theme-switch': 'theme-switch 0.5s ease-in-out',
      },
      keyframes: {
        'theme-switch': {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(0.95)', opacity: 0.5 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}; 
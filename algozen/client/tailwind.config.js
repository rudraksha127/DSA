import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AlgoZen brand colors
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        dark: {
          900: '#0a0a0f',
          800: '#111118',
          700: '#1a1a27',
          600: '#22223a',
          500: '#2d2d4a',
        },
        success: '#10b981',
        danger:  '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'float':     'float 3s ease-in-out infinite',
        'glow':      'glow 2s ease-in-out infinite alternate',
        'level-up':  'levelUp 0.6s ease-out',
        'xp-fill':   'xpFill 1s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px #6366f1' },
          to:   { boxShadow: '0 0 20px #8b5cf6, 0 0 30px #6366f1' },
        },
        levelUp: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        xpFill: {
          from: { width: '0%' },
          to:   { width: 'var(--xp-percent)' },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
}

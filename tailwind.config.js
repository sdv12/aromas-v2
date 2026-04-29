/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand blue — matches logo (#1285B5 range)
        primary: {
          50:  '#eff7fd',
          100: '#d8edf8',
          200: '#b0d9f2',
          300: '#77bde9',
          400: '#3d9cdc',
          500: '#1a84c9',
          600: '#1285b5',
          700: '#0f6b93',
          800: '#115879',
          900: '#144a64',
          950: '#0c3346',
        },
        // Deep navy — used for dark mode backgrounds
        navy: {
          700: '#1a4570',
          800: '#0f3050',
          850: '#0d2840',
          900: '#0a2038',
          950: '#061428',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Aura brand navy (#1B2A4A range)
        primary: {
          50:  '#edf0f6',
          100: '#d0d8e8',
          200: '#a1b1d1',
          300: '#728aba',
          400: '#4363a3',
          500: '#243c8c',
          600: '#1B2A6B',
          700: '#152155',
          800: '#0F1840',
          900: '#0A102B',
          950: '#050918',
        },
        // Aura accent gold
        accent: {
          50:  '#fdf8ec',
          100: '#f9edd0',
          200: '#f2d9a1',
          300: '#ebc572',
          400: '#d4ac5a',
          500: '#c4973a',
          600: '#a07830',
          700: '#7d5c25',
          800: '#5a421a',
          900: '#38280f',
        },
        // Warm cream palette (light mode backgrounds)
        cream: {
          50:  '#fdfaf5',
          100: '#faf6ef',
          200: '#f5edd8',
          300: '#edd9b8',
          400: '#e0c898',
        },
        // Deep navy — dark mode backgrounds
        navy: {
          700: '#1a2f50',
          800: '#102038',
          850: '#0d1a2e',
          900: '#091424',
          950: '#05091A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
}

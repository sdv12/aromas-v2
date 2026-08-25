/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Primary: navy. Anchor #273145
        primary: {
          50:  '#ecf0f8',
          100: '#d4ddee',
          200: '#a9bbdd',
          300: '#7e99cc',
          400: '#5377bb',
          500: '#3a5aa8',
          600: '#2e3d5a',   // feature strips, mid-dark sections
          700: '#273145',   // ← CTA buttons, active states
          800: '#1e2636',   // button hover
          900: '#141c2a',   // footer, deepest dark
          950: '#0a0e16',
        },
        // ── Accent: warm tan. Anchor #b6a183
        accent: {
          50:  '#faf7f3',
          100: '#f2ece0',
          200: '#e4d8c3',
          300: '#d0bc9d',
          400: '#c4ae92',
          500: '#b6a183',   // ← prices, badges, dark-mode CTAs
          600: '#9a8568',
          700: '#7e6a53',
          800: '#604f3e',
          900: '#3e3429',
        },
        // ── Cream: warm tints. Used in sections, NOT as base background
        cream: {
          50:  '#faf8f5',   // barely warm — input focus rings
          100: '#f5f0e9',   // subtle section bg (testimonials, categories)
          200: '#ede5d8',   // warm section bg (callouts, wholesale banner)
          300: '#ded4c4',   // brand beige — borders, accent strips
          400: '#cfc0ae',   // dividers, card borders
          500: '#b6a183',   // ≡ accent-500
        },
        // ── Navy: dark-mode depth
        navy: {
          700: '#273145',
          800: '#1e2a3e',
          850: '#192030',
          900: '#141c2a',   // ← dark-mode page bg
          950: '#0c1018',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        serif:   ['Cormorant Garamond', 'Georgia', 'Cambria', 'serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

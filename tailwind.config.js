/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        newspaper: ['"Chomsky"', '"Old English Text MT"', '"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Courier New"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        cursive: ['"Great Vibes"', '"Dancing Script"', 'cursive'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}


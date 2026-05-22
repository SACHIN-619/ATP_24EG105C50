content: ["./index.html", "./src/**/*.{js,jsx}"]

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        accent: '#4F46E5',
        'accent-light': '#EEF2FF',
        'accent-hover': '#4338CA',
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        anton: ['Anton', 'sans-serif'],
      },
      colors: {
        'background': '#252a34',
        'background-light': '#323945',
        'blue': '#007bff',
        'white': '#ffffff',
        'black': '#000000',
        'gray': {
          '400': '#9ca3af',
        },
        'primary': '#22d3ee',
        'cyan': {
          '400': '#22d3ee',
        },
      },
    },
  },
  plugins: [],
}

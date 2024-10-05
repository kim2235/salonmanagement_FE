/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '2p': '2%',
        '5p': '5%',
        '10p': '10%', // Custom class name for 10% margin
      },
      width: {
        '48.5p': '48.5%',
        '70p': '70%',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],variants: {
    scrollbar: ['rounded'],
  },
}

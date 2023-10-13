/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fadeInOut': {
          '0%, 100%': { opacity: '0' },
          '30%, 70%': { opacity: '1' },
        },
      },
      animation: {
        'fadeInOut': 'fadeInOut 7s ease-in-out 1',
      },
    },
    plugins: [],
  },
};

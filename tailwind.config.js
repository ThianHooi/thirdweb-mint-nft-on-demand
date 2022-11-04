/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-100': '#EDDAFD',
        'primary-200': '#D8B6FC',
        'primary-300': '#BE90F7',
        'primary-400': '#A673EF',
        'primary-500': '#8247E5',
        'primary-600': '#6433C4',
        'primary-700': '#4A23A4',
        'primary-800': '#331684',
        'primary-900': '#220D6D',
        background: '#1F1F1F',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        black : '#080D18',
        darkBlue : '#141A28',
        navy : '#1B2537',
        purple : '#6464F6',
        green : '#42C6A3',
        yellow : '#E49F2F',
        red : '#CA3030',
        gray : '#585884',
        blue: '#0577FF',
      },
      fontFamily : {
        'lato' : ['Lato', 'sans-serif'],
        'bebas' : ['Bebas Neue', 'sans-serif'],
        'oswald' : ['Oswald', 'sans-serif']
      },
      animation: {
        // 'slide-in-right': 'slide-in-right 1s ease-out',
        // 'opacity-right': 'opacity-right 3s ease-out',
        'opacity-from-left': 'opacity-from-left 1s ease-out',
      },
      keyframes: {
        // 'slide-in-right': {
        //   '0%': { transform: 'translateX(-20%)', opacity: '0' },
        //   '100%': { transform: 'translateX(0)', opacity: '1' },
        // },
        // 'opacity-right': {
        //   '0%': { opacity: '0'},
        //   '100%': { opacity: '1'},
        // },
        'opacity-from-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-100%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
      // transitionProperty: {
      //   'opacity': 'opacity',
      // },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    })
  ],
}
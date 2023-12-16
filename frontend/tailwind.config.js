/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  darkMode: 'media',
  theme: {
    // add basic colors for the application
    color : {
      'white': '#ffffff',
      'dark-sidebar': '#333333',
      'dark': '#1e1e1e',
      'blue': '#9adbff',
      'light-gray': '#eeeeee',
      'dark-gray': '#ababad',
    },

    // breakpoint
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },

    // set necessary fonts
    fontFamily: {
    }
  },
}




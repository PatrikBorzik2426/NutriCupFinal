/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}', './components/**/*.{html,js,ts,jsx,tsx}', './pages/**/*.{html,js,ts,jsx,tsx}', './nuxt.config.ts'
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],  // Add Manrope font family
      },
      colors: {
        // Midnight Dark blue theme
        primary: {
         '50': '#fcf3f7',
        '100': '#f9eaf2',
        '200': '#f5d5e5',
        '300': '#f0bcd5',
        '400': '#e284af',
        '500': '#d65e92',
        '600': '#c33f72',
        '700': '#a72f5a',
        '800': '#8b294b',
        '900': '#742741',
        '950': '#461123',
      },
        positive:{
          '50': '#f4fcf1',
        '100': '#e3fade',
        '200': '#c0f1b6',
        '300': '#9be88d',
        '400': '#67d454',
        '500': '#42ba2d',
        '600': '#329920',
        '700': '#2a781d',
        '800': '#265f1c',
        '900': '#1f4f18',
        '950': '#0c2b08',
        },
        negative:{
          '50': '#fff0f0',
          '100': '#ffdddd',
          '200': '#ffc1c1',
          '300': '#ff9595',
          '400': '#ff5959',
          '500': '#ff2626',
          '600': '#fc0606',
          '700': '#e00000',
          '800': '#af0505',
          '900': '#900c0c',
          '950': '#500000',
        },
        dark:{
          50: '#f0f0f0',
          100: '#d9d9d9',
          200: '#bfbfbf',
          300: '#a3a3a3',
          400: '#8a8a8a',
          500: '#707070',
          600: '#5c5c5c',
          700: '#484848',
          800: '#363636',
          900: '#242424',
          950: '#111111',
        }
      }
    },
  },
  plugins: [
    require('tailwindcss-animated'),
    require('tailwind-scrollbar')
  ],
}


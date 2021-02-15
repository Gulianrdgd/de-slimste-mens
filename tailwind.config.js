module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      margin: {
        'auto': 'auto',
      },
      colors:{
        'primary' : '#0085FF',
        'dsm' :'#C76B2C',
        'dsm-bg' : '#85090E',
      }
    },
  },
  variants: {
    extend: {

    },
  },
  plugins: [],
}

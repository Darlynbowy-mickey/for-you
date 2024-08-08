/** @type {import('tailwindcss').Config} */
module.exports = {
  content:  [ './src/**/*.{js,jsx,ts,tsx}',],
  theme: {
    extend: {
      colors:{
        customPeach: '#FCD9C2',
        customDeepPeach: '#FF9149',
        customLB: "#E5F3FC"
        ,
        customL : "#47CCDF"

      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/Component/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'default': "url('/src/assets/background.JPG')"
      },
    },
    fontFamily: {
      heading: ['Londrina Outline', 'cursive'],
      body: ['Shrikhand', 'cursive'],
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [],
  darkMode: 'class',
}


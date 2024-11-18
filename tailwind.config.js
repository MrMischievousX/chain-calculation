/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        home: "url('/src/assets/pngs/home_bg.png')",
      },
      colors: {
        label: '#E29A2D',
        success_label: '#4CAF79',
        label_light: '#FFEED5',
        success_label_light: '#C5F2DA',
        light_grey: '#DBDBDB',
        dot: '#0066FF',
        grey_text: '#A5A5A5',
        card_border: '#DFDFDF',
        input_border: '#D3D3D3',
        initial_input: '#FFC267',
        final_output: '#2DD179',
      },
    },
  },
  plugins: [],
};

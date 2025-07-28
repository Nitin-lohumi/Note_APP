module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      height: {
        'screen-minus-100': 'calc(100vh - 100px)',
      },
      maxWidth: {
        '1100': '1100px',
      },
      maxHeight: {
        '1000': '1000px',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'loading-bar': 'loadingBar 2s ease-in-out infinite',
      },
      keyframes: {
        loadingBar: {
          '0%': { left: '-100%', width: '100%' },
          '50%': { left: '0%', width: '100%' },
          '100%': { left: '100%', width: '100%' },
        },
      },
    },
  },
  plugins: [],
}

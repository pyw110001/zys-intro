/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        panel: '#191919',
        paper: '#ffffff',
        muted: '#7d8187',
        sunset: '#ff7a17',
        line: '#212327',
      },
      scale: {
        102: '1.02',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        heading: ['Syncopate', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

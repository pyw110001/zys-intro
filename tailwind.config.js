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
        ink: '#050706',
        panel: '#0b1110',
        paper: '#f3f0e8',
        muted: '#8d928d',
        mint: '#9de8cf',
        line: 'rgba(255,255,255,0.08)',
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

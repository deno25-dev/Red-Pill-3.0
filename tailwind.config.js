/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        rpc: {
          950: '#020617', // Deep background
          900: '#0f172a', // Panel background
          800: '#1e293b', // Border/Hover
          700: '#334155', // Secondary Border
          accent: '#3b82f6', // Primary Action
          text: '#e2e8f0', // Primary Text
          muted: '#64748b' // Muted Text
        }
      }
    },
  },
  plugins: [],
}
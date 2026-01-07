import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ayur: {
          dark: '#133215',   // Deep Forest
          accent: '#92B775', // Sage
          cream: '#F3E8D3',  // Parchment
        }
      },
    },
  },
  plugins: [tailwindcss(),react()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_BASE_URL = 'http://localhost:5000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: API_BASE_URL,
        changeOrigin: true
      }
    }
  }
})

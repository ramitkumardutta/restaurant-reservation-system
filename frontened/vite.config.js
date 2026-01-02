import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests under /api/* to backend
      '/api/user': 'http://localhost:3000',
      '/api/reservation': 'http://localhost:3000',
      '/api/menu': 'http://localhost:3000',
      '/api/order': 'http://localhost:3000',
      '/api/table': 'http://localhost:3000',
    }
  }
})

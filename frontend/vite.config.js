import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api ile başlayan istekler localhost:3010 adresine yönlendirilir
      '/api': 'http://localhost:3010',
    },
  },
})

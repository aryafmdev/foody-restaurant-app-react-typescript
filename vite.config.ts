import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': {
        target:
          process.env.VITE_API_PROXY_TARGET ||
          'https://be-restaurant-api-889893107835.asia-southeast2.run.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})

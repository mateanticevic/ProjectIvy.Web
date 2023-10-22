import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://api.anticevic.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/auth': {
        target: 'http://10.0.1.6:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ''),
      },
    }
  }
})

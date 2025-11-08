import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /^\/track\/.*/, to: '/index.html' },
        { from: /./, to: '/index.html' }
      ]
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    assetsDir: 'assets',
    copyPublicDir: true,
    // Ensure index.html is copied to 404.html for proper SPA routing
    emptyOutDir: true,
    write: true,
    cssCodeSplit: false
  },
  preview: {
    host: true,
    port: 3000
  },
})

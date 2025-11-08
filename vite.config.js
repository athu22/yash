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
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
    assetsDir: 'assets',
    copyPublicDir: true,
    emptyOutDir: true,
    write: true,
    cssCodeSplit: false
  },
  preview: {
    host: true,
    port: 3000
  },
})

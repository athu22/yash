import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
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
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
      },
    },
    assetsDir: 'assets',
    copyPublicDir: true,
    emptyOutDir: true,
    write: true,
    manifest: true,
    cssCodeSplit: false
  },
  preview: {
    host: true,
    port: 3000
  },
})

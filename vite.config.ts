// https://vitest.dev/config/
/// <reference types="vitest" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js'
      }
    }
  },
  envDir: 'environment',
  plugins: [vue()],
  test: {
    globals: true,
    setupFiles: ['vitest-localstorage-mock'], // https://github.com/Mitscherlich/vitest-localstorage-mock#setup-file
    mockReset: true
  }
})
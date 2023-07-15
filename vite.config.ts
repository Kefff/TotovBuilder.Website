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
    coverage: {
      exclude: [
        '**/src/__mocks__/**',
        '**/src/plugins/**',
        'ExportService.ts', // Requires access to the file system
      ]
    },
    environment: 'happy-dom', // Required for browser components like "document" to be accessible during tests
    globals: true,
    mockReset: false, // Required for local storage mock to work
    setupFiles: [
      'src/__mocks__/setup.ts', // Global configuration for all mocks
      'vitest-localstorage-mock' // https://github.com/Mitscherlich/vitest-localstorage-mock#setup-file
    ],
  }
})
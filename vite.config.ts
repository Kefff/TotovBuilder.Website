// https://vitest.dev/config/
/// <reference types="vitest" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'

export default defineConfig({
  build: {
    minify: true
  },
  envDir: 'environment',
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**') // https://vue-i18n.intlify.dev/guide/advanced/optimization.html#how-to-configure
    })
  ],
  test: {
    coverage: {
      exclude: [
        '**/src/__tests__/**',
        '**/src/plugins/**',
        'ExportService.ts' // Because it requires access to the file system
      ]
    },
    environment: 'happy-dom', // Required for browser components like "document" to be accessible during tests
    globals: true,
    mockReset: false, // Required for local storage mock to work
    setupFiles: [
      'src/__tests__/__mocks__/setup.ts', // Global configuration for all mocks
      'vitest-localstorage-mock' // https://github.com/Mitscherlich/vitest-localstorage-mock#setup-file
    ]
  }
})
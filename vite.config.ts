// https://vitest.dev/config/
/// <reference types="vitest" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import AbortControllePolyfill from 'abortcontroller-polyfill/dist/polyfill-patch-fetch'

export default defineConfig({
  build: {
    minify: true,
    rollupOptions: {
      output: {
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'images/[name]-[hash][extname]'
          } else if (/\.(css|js)$/.test(name ?? '')) {
            return 'src/[name]-[hash][extname]'
          } else if (/\.(eot|otf|ttf|woff|woff2)$/.test(name ?? '')) {
            return 'fonts/[name]-[hash][extname]'
          }

          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'src/[name]-[hash].js',
        entryFileNames: 'src/[name]-[hash].js'
      }
    }
  },
  envDir: 'environment',
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**') // https://vue-i18n.intlify.dev/guide/advanced/optimization.html#how-to-configure
    }),
    AbortControllePolyfill
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
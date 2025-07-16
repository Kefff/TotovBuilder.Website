// https://vitest.dev/config/
/// <reference types="vitest" />

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  return {
    build: {
      minify: mode === 'production',
      rollupOptions: {
        output: {
          assetFileNames: ({ name }): string => {
            if (/\.(gif|jpeg|png|svg|webp)$/.test(name ?? '')) {
              return 'images/[name]-[hash][extname]'
            } else if (/\.(css|js)$/.test(name ?? '')) {
              return 'src/[name]-[hash][extname]'
            } else if (/\.(eot|otf|ttf|woff|woff2)$/.test(name ?? '')) {
              return 'fonts/[name]-[hash][extname]'
            }

            return '[name]-[hash][extname]'
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
      })
    ],
    test: {
      coverage: {
        exclude: [
          '**/*.d.ts',
          'dist/*',
          'scripts/*',
          'src/__tests__/*',
          'src/components/*',
          'src/main.ts',
          'src/models/utils/UI/*',
          'src/polyfill.ts',
          'src/plugins/*',
          'src/services/FileService.ts', // Requires access to the file system
          'src/servicesConfiguration.ts',
          'vite.config.ts'
        ],
        thresholds: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100
        }
      },
      environment: 'happy-dom', // Required for browser components like "document" to be accessible during tests
      globals: true,
      mockReset: false, // Required for local storage mock to work
      setupFiles: [
        'src/__tests__/__mocks__/setup.ts', // Global configuration for all mocks
        'vitest-localstorage-mock' // https://github.com/Mitscherlich/vitest-localstorage-mock#setup-file
      ]
    }
  }
})
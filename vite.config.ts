import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

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
  envDir: 'configuration',
  plugins: [
    vue(),
    vueI18n({
      include: path.resolve('src/assets/messages.json'),
      runtimeOnly: false // https://github.com/intlify/vite-plugin-vue-i18n/issues/91
    })
  ]
})
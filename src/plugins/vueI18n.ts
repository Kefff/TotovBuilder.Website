import { App } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from '../assets/data/messages.json'
import Configuration from '../../test-data/configuration.json'

const vueI18n = createI18n({
  fallbackLocale: 'en',
  globalInjection: true,
  legacy: false,
  locale: 'en',
  messages,
  mode: 'composition',
  silentFallbackWarn: true
})

export function useI18n(app: App<Element>): void {
  app.use(vueI18n)
  vueI18n.global.fallbackWarn = Configuration.VITE_DEBUG === 'true'
}

export default vueI18n.global
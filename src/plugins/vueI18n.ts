import { App } from 'vue'
import { createI18n } from 'vue-i18n'
import en from '../assets/data/messages.en.json'
import fr from '../assets/data/messages.fr.json'

const vueI18n = createI18n({
  fallbackLocale: 'en',
  globalInjection: true,
  legacy: false,
  locale: 'en',
  messages: {
    en,
    fr
  },
  mode: 'composition',
  silentFallbackWarn: true
})

export function useI18n(app: App<Element>): void {
  app.use(vueI18n)
  vueI18n.global.fallbackWarn = import.meta.env.VITE_DEBUG === 'true'
}

export default vueI18n.global
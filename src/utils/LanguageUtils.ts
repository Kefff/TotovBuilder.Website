import vueI18n from '../plugins/vueI18n'
import Services from '../services/repository/Services'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'

/**
 * Represents an utility class for managing language changes.
 */
export default class LanguageUtils {
  /**
   * Sets the current language.
   * @param language - Language.
   */
  public static setLanguage(language: string): void {
    const languageExists = vueI18n.availableLocales.some(l => l === language)

    if (!languageExists) {
      language = vueI18n.fallbackLocale.value as string
    }

    vueI18n.locale.value = language as 'en' | 'fr'
    localStorage.setItem(Services.get(WebsiteConfigurationService).configuration.languageStorageKey, language)
    this.setMeta()
  }

  /**
   * Sets meta tags according to the current language.
   */
  public static setMeta(): void {
    document.title = vueI18n.t('caption.metaTitle')
    document.head.querySelector('meta[name=description]')?.setAttribute('content', vueI18n.t('caption.metaDescription'))
  }
}
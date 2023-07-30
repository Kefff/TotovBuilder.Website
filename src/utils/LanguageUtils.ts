import vueI18n from '../plugins/vueI18n'
import Services from '../services/repository/Services'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'

/**
 * Represents an utility class for managing language changes.
 */
export default class LanguageUtils {
  /**
   * Gets the language stored for the user or the browser language if not found.
   * @returns language - Stored language or browser language.
   */
  public static getLanguage(): string {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    let language = localStorage.getItem(websiteConfigurationService.configuration.languageStorageKey)

    if (language == null) {
      language = navigator.language.substring(0, navigator.language.indexOf('-'))
    }

    return language
  }

  /**
   * Sets the current language.
   * @param language - Language.
   */
  public static setLanguage(language: string): void {
    const languageExists = vueI18n.availableLocales.some(l => l === language)

    if (!languageExists) {
      language = vueI18n.fallbackLocale.value as string
    }

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    vueI18n.locale.value = language as 'en' | 'fr'
    localStorage.setItem(websiteConfigurationService.configuration.languageStorageKey, language)

    // Setting metadata
    document.title = vueI18n.t('caption.metaTitle')
    document.head.querySelector('meta[name=description]')?.setAttribute('content', vueI18n.t('caption.metaDescription'))
  }
}
import { TinyEmitter } from 'tiny-emitter'
import vueI18n from '../plugins/vueI18n'
import { ItemService } from './ItemService'
import { SeoService } from './SeoService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import Services from './repository/Services'

/**
 * Represents a service for managing language changes.
 */
export default class LanguageService {
  /**
   * Name of the event fired when the items language has changed.
   */
  public static itemsLanguageChangedEvent = 'itemsLanguageChanged'

  /**
   * Event emitter used to indicate that the items language has changed.
   */
  public emitter = new TinyEmitter()

  /**
   * Items language.
   */
  private _itemsLanguage: string | undefined | null

  /**
   * Gets the application language stored for the user or the browser language if not found.
   * @returns Stored application language or browser language.
   */
  public getItemsLanguage(): string {
    if (this._itemsLanguage == null) {
      this._itemsLanguage = localStorage.getItem(Services.get(WebsiteConfigurationService).configuration.itemsLanguageStorageKey)
    }

    if (this._itemsLanguage == null) {
      this._itemsLanguage = this.getStoredOrBrowserApplicationLanguage()
    }

    return this._itemsLanguage
  }

  /**
   * Gets the application language stored for the user or the browser language if not found.
   * @returns Stored application language or browser language.
   */
  public getStoredOrBrowserApplicationLanguage(): string {
    let language = localStorage.getItem(Services.get(WebsiteConfigurationService).configuration.languageStorageKey)

    if (language == null) {
      language = navigator.language.substring(0, navigator.language.indexOf('-'))
    }

    return language
  }

  /**
   * Sets the application language, stores it in the local storage and updates SEO metadata.
   * @param language - Language.
   */
  public setApplicationLanguage(language: string): void {
    vueI18n.locale.value = language as 'en' | 'fr'
    localStorage.setItem(Services.get(WebsiteConfigurationService).configuration.languageStorageKey, language)
    Services.get(SeoService).updateSeoMetadata()
  }

  /**
   * Sets the items language, stores it in the local storage, invalidates items and prices cache and emits an event indicating the items language has changed.
   * @param language - Language.
   */
  public setItemsLanguage(language: string): void {
    this._itemsLanguage = language
    localStorage.setItem(Services.get(WebsiteConfigurationService).configuration.itemsLanguageStorageKey, language)

    const itemService = Services.get(ItemService)
    itemService.invalidatedItemsCache()
    itemService.invalidatedPricesCache()

    this.emitter.emit(LanguageService.itemsLanguageChangedEvent)
  }
}
import { instance, mock, verify } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import vueI18n from '../../plugins/vueI18n'
import LanguageService from '../../services/LanguageService'
import { SeoService } from '../../services/SeoService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('LanguageService', () => {
  describe('getItemsLanguage', () => {
    it('should get the stored items language', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      localStorage.setItem(websiteConfigurationService.configuration.itemsLanguageStorageKey, 'zh')

      const service = new LanguageService()

      // Act
      const language = service.getItemsLanguage()

      // Assert
      expect(language).toBe('zh')
    })

    it('should get the application language when items language is stored', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      localStorage.setItem(websiteConfigurationService.configuration.languageStorageKey, 'fr')

      const service = new LanguageService()

      // Act
      const language = service.getItemsLanguage()

      // Assert
      expect(language).toBe('fr')
    })
  })

  describe('getStoredOrBrowserApplicationLanguage', () => {
    it('should get the stored application language', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      localStorage.setItem(websiteConfigurationService.configuration.languageStorageKey, 'fr')

      const service = new LanguageService()

      // Act
      const language = service.getStoredOrBrowserApplicationLanguage()

      // Assert
      expect(language).toBe('fr')
    })

    it('should get the browser language when no application language is stored', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const service = new LanguageService()

      // Act
      const language = service.getStoredOrBrowserApplicationLanguage()

      // Assert
      expect(language).toBe('en')
    })
  })

  describe('setApplicationLanguage', () => {
    it('should change the application language and update SEO metadata', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)

      const seoServiceMock = mock<SeoService>()
      Services.configure(SeoService, undefined, instance(seoServiceMock))

      const service = new LanguageService()

      // Act
      service.setApplicationLanguage('fr')

      // Assert
      const storedApplicationLanguage = localStorage.getItem(websiteConfigurationService.configuration.languageStorageKey)

      expect(vueI18n.locale.value).toBe('fr')
      expect(storedApplicationLanguage).toBe('fr')
      verify(seoServiceMock.updateSeoMetadata()).once()
    })
  })

  describe('setItemsLanguage', () => {
    it.each([[true], [false]])('should change the items language, store it, invalidate items and prices cache and emit an event', (emitEvent: boolean) => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)

      let emitted = false

      const service = new LanguageService()
      service.emitter.on(LanguageService.itemsLanguageChangedEvent, () => emitted = true)

      // Act
      service.setItemsLanguage('fr', emitEvent)

      // Assert
      const itemsLanguage = service.getItemsLanguage()
      const storedItemsLanguage = localStorage.getItem(websiteConfigurationService.configuration.itemsLanguageStorageKey)

      expect(itemsLanguage).toBe('fr')
      expect(storedItemsLanguage).toBe('fr')
      expect(emitted).toBe(emitEvent)
    })

    it('should do nothing when called with the same items language as the current one', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      let emittedCount = 0

      const service = new LanguageService()
      service.emitter.on(LanguageService.itemsLanguageChangedEvent, () => emittedCount += 1)

      // Act
      service.setItemsLanguage('fr')
      service.setItemsLanguage('fr')

      // Assert
      expect(emittedCount).toBe(1)
    })
  })
})
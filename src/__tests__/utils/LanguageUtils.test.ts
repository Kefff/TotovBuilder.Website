import { describe, expect, it } from 'vitest'
import vueI18n from '../../plugins/vueI18n'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'
import LanguageUtils from '../../utils/LanguageUtils'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('getLanguage', () => {
  it('should get the stored language', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    localStorage.setItem(websiteConfigurationService.configuration.languageStorageKey, 'fr')

    // Act
    const language = LanguageUtils.getLanguage()

    // Assert
    expect(language).toBe('fr')
  })

  it('should get the browser language when no language is stored', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    // Act
    const language = LanguageUtils.getLanguage()

    // Assert
    expect(language).toBe('en')
  })
})

describe('setLanguage', () => {
  it.each([
    ['fr', 'fr'],
    ['invalid', 'en']
  ])('should change the language', (language: string, expectedLanguage: string) => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    // Act
    LanguageUtils.setLanguage(language)

    // Assert
    expect(vueI18n.locale.value).toBe(expectedLanguage)
  })
})
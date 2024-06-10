import { describe, expect, it, vi } from 'vitest'
import vueI18n from '../../plugins/vueI18n'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'
import LanguageUtils from '../../utils/LanguageUtils'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('getLanguage()', () => {
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

describe('setLanguage()', () => {
  it.each([
    ['fr', 'fr', 'Configurateur d\'armes et d\'équipement pour Escape From Tarkov', 'Totov Builder aide à créer des configurations d\'armes et choisir vos mods et équipement entier en fonction des niveaux de marchands. Visualisez le prix et les stats de équipement.'],
    ['invalid', 'en', 'Gun modding and loadout builder for Escape From Tarkov', 'Totov Builder helps you create weapon builds and choose all of your gear based on merchant levels. View the price and stats of your loadout.']
  ])('should change the language', async (language: string, expectedLanguage: string, expectedTitle: string, expectedMetaDescription: string) => {
    // Arrange
    vi.mock('unhead')
    const unheadMock = await import('unhead')
    const useSeoMetaMock = unheadMock.useSeoMeta = vi.fn()

    useWebsiteConfigurationServiceMock()

    // Act
    LanguageUtils.setLanguage(language)

    // Assert
    expect(vueI18n.locale.value).toBe(expectedLanguage)
    expect(useSeoMetaMock).toHaveBeenCalledWith({
      title: expectedTitle,
      description: expectedMetaDescription
    })
  })
})
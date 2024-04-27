import { anything, spy, when } from 'ts-mockito'
import vueI18n from '../../plugins/vueI18n'
import LanguageUtils from '../../utils/LanguageUtils'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'
import { describe, expect, it } from 'vitest'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'

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
  ])('should change the language', (language: string, expectedLanguage: string, expectedTitle: string, expectedMetaDescription: string) => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    let metaDescription = ''
    const element = document.createElement('test')
    const elementSpy = spy(element)
    const documentHeadSpy = spy(document.head)
    when(elementSpy.setAttribute(anything(), anything())).thenCall((qualifiedName: string, value: string) => metaDescription = value)
    when(documentHeadSpy.querySelector(anything())).thenReturn(element)

    // Act
    LanguageUtils.setLanguage(language)

    // Assert
    expect(vueI18n.locale.value).toBe(expectedLanguage)
    expect(document.title).toBe(expectedTitle)
    expect(metaDescription).toBe(expectedMetaDescription)
  })

  it('should not update the description metadata when it is not found', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const element = null
    const documentHeadSpy = spy(document.head)
    when(documentHeadSpy.querySelector(anything())).thenReturn(element)

    // Act
    LanguageUtils.setLanguage('fr')

    // Assert
    expect(vueI18n.locale.value).toBe('fr')
  })
})
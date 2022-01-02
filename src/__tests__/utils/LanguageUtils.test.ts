import { anything, spy, when } from 'ts-mockito'
import vueI18n from '../../plugins/vueI18n'
import LanguageUtils from '../../utils/LanguageUtils'

describe('setLanguage()', () => {
  it.each([
    ['fr', 'fr', 'Totov Builder : Outil d\'équipement pour Escape From Tarkov', 'Totov Builder vous aide à créer des configurations d\'armes, choisir l\'équipement de votre PMC et visualiser facilement les prix, poids et statistiques de votre équipement entier avant de partir en raid. Gérez efficacement votre budget en suivant chaque rouble que vous dépensez.'],
    ['invalid', 'en', 'Totov Builder : Loadout tool for Escape From Tarkov', 'Totov Builder helps you create your weapon builds, choose your PMC equipment and easily visualize the price, weight and stats of your entire loadout before going into a raid. Manage your budget efficiently by tracing every ruble that you spend.']
  ])('should change the language', (language: string, expectedLanguage: string, expectedTitle: string, expectedMetaDescription: string) => {
    // Arrange
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
    const element = null
    const documentHeadSpy = spy(document.head)
    when(documentHeadSpy.querySelector(anything())).thenReturn(element)

    // Act
    LanguageUtils.setLanguage('fr')

    // Assert
    expect(vueI18n.locale.value).toBe('fr')
  })
})
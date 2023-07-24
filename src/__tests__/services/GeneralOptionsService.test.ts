import { describe, expect, it } from 'vitest'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { GeneralOptionsService } from '../../services/GeneralOptionsService'

describe('getAllowCookiesIndicator()', () => {
  it.each([
    [true, false],
    [false, true]
  ])('should get the no cookies indicator', (hasSavedValue: boolean, expected: boolean) => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    if (hasSavedValue) {
      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      localStorage.setItem(websiteConfigurationService.configuration.allowCookiesStorageKey, 'false')
    }

    const service = new GeneralOptionsService()

    // Act
    const allowCookies = service.getAllowCookiesIndicator()

    // Assert
    expect(allowCookies).toBe(expected)
  })
})

describe('setAllowCookiesIndicator()', () => {
  it.each([
    [true, 'true'],
    [false, 'false']
  ])('should set the no cookies indicator', (allowCookies: boolean, expected: string) => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    const service = new GeneralOptionsService()

    // Act
    service.setAllowCookiesIndicator(allowCookies)
    const result = localStorage.getItem(websiteConfigurationService.configuration.allowCookiesStorageKey)

    // Assert
    expect(result).toBe(expected)
  })
})
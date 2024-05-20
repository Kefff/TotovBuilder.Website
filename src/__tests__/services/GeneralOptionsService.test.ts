import { anything, spy, verify } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { GeneralOptionsService } from '../../services/GeneralOptionsService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('getAllowCookiesIndicator()', () => {
  it.each([
    [true, false],
    [false, true]
  ])('should get the allow cookies indicator and notify the user to make a choice if not set', (hasSavedValue: boolean, expected: boolean) => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const notificationServiceSpy = spy(Services.get(NotificationService))

    if (hasSavedValue) {
      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      localStorage.setItem(websiteConfigurationService.configuration.allowCookiesStorageKey, 'false')
    }

    const service = new GeneralOptionsService()

    // Act
    const allowCookies = service.getAllowCookiesIndicator()

    // Assert
    expect(allowCookies).toBe(expected)

    if (hasSavedValue) {
      verify(notificationServiceSpy.notify(
        anything(),
        anything(),
        anything(),
        anything())).never()
    } else {
      verify(notificationServiceSpy.notify(
        NotificationType.information,
        'Totov Builder uses cookies only to anonymously detect errors that may occur during your visit.\nAccepting cookies is not necessary but helps to improve the website.',
        0,
        anything())).once()
    }
  })
})

describe('setAllowCookiesIndicator()', () => {
  it.each([
    [true, 'true'],
    [false, 'false']
  ])('should set the allow cookies indicator', (allowCookies: boolean, expected: string) => {
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
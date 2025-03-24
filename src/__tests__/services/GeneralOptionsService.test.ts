import { anything, spy, verify } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { GeneralOptionsService } from '../../services/GeneralOptionsService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('getAllowCookiesOption', () => {
  it.each([
    [true, false],
    [false, true]
  ])('should get the allow cookies option and notify the user to make a choice if not set', (hasSavedValue: boolean, expected: boolean) => {
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
    const allowCookies = service.getAllowCookiesOption()

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
        'Totov Builder uses cookies to anonymously detect errors that may occur during your visit.\nAccepting cookies is not necessary but helps to improve the website.',
        0,
        anything())).once()
    }
  })
})

describe('getExportWarningOption', () => {
  it.each([
    [undefined, true],
    [true, true],
    [false, false]
  ])('should get the export warning option value', (exportWarnigValue: boolean | undefined, expected: boolean) => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    if (exportWarnigValue != null) {
      localStorage.setItem(websiteConfigurationService.configuration.exportWarningStorageKey, exportWarnigValue.toString())
    }

    const service = new GeneralOptionsService()

    // Act
    const exportWarning = service.getExportWarningOption()

    // Assert
    expect(exportWarning).toBe(expected)
  })
})

describe('setAllowCookiesOption', () => {
  it.each([
    [true, 'true'],
    [false, 'false']
  ])('should set the allow cookies option', (allowCookies: boolean, expected: string) => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    const service = new GeneralOptionsService()

    // Act
    service.setAllowCookiesOption(allowCookies)
    const result = localStorage.getItem(websiteConfigurationService.configuration.allowCookiesStorageKey)

    // Assert
    expect(result).toBe(expected)
  })
})
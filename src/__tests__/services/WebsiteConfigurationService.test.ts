import { anyString, instance, mock, spy, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IWebsiteConfiguration } from '../../models/configuration/IWebsiteConfiguration'
import { FetchService } from '../../services/FetchService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'
import Result, { FailureType } from '../../utils/Result'
import WebsiteConfigurationMock from '../__data__/websiteConfigurationMock'
import { useFetchServiceMock } from '../__mocks__/FetchServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('initialize', () => {
  it('should fetch the website configuration', async () => {
    // Arrange
    useFetchServiceMock(WebsiteConfigurationMock)

    const service = new WebsiteConfigurationService()

    // Act
    const result = await service.initialize()

    // Assert
    expect(result).toBe(true)
    expect(service.configuration.buildSharingUrl).toBe('s/')
  })

  it('should notify when the post update period flag is set', async () => {
    // Arrange
    useFetchServiceMock({
      allowCookiesStorageKey: 'allow_cookies',
      bugReportUrl: 'https://discord.gg/bugreport',
      buildSharingUrl: 's/',
      buildsSortFieldStorageKey: 'builds_sort_field',
      buildsSortOrderStorageKey: 'builds_sort_order',
      buildStorageKeyPrefix: 'build_',
      cacheDuration: 3600,
      contactAddress: 'contact@address.com',
      discordUrl: 'https://discord.gg/server',
      endpointChangelog: 'data/changelog.json',
      endpointItemCategories: 'data/item-categories.json',
      endpointItems: 'data/items.ts',
      endpointPresets: 'data/presets.ts',
      endpointPrices: 'data/prices.ts',
      endpointTarkovValues: 'data/tarkov-values.json',
      exportFileExtension: '.ttb',
      exportFileNamePrefix: 'TotovBuilder',
      exportWarningShowedStorageKey: 'export_warning',
      fetchMaxTries: 3,
      fetchTimeout: 30,
      fetchWaitTimeBetweenRetries: 2,
      githubUrl: 'https://github.com/User/Reposiory',
      globalFilterStorageKey: 'global_filter',
      languageStorageKey: 'language',
      notificationErrorDuration: 10,
      notificationInformationDuration: 5,
      notificationSuccessDuration: 5,
      notificationWarningDuration: 10,
      postUpdatePeriod: true,
      version: '1.6.0',
      versionStorageKey: 'version'
    } as IWebsiteConfiguration)
    Services.configure(NotificationService)

    const notificationServiceSpy = spy(Services.get(NotificationService))

    const service = new WebsiteConfigurationService()

    // Act
    const result = await service.initialize()

    // Assert
    expect(result).toBe(true)
    verify(notificationServiceSpy.notify(
      NotificationType.information,
      'As we are in a post Tarkov update period, items and prices may not be up to date yet.\nThey are progressively being updated by the Tarkov.dev team.',
      0)).once()
  })

  it('should do nothing when fetching fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.get(anyString())).thenResolve(Result.fail<void>(FailureType.error, 'FetchService.get()', 'Fetch error'))
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const service = new WebsiteConfigurationService()

    // Act
    const result = await service.initialize()

    // Assert
    expect(result).toBe(false)
    expect(service.configuration.buildSharingUrl).toBe('')
  })
})

describe('initializationState setter', () => {
  it.each([
    [ServiceInitializationState.error],
    [ServiceInitializationState.initialized]
  ])('should set the initialization state and emit the initialization finished event', (state: ServiceInitializationState) => {
    // Arrange
    const service = new WebsiteConfigurationService()

    let hasEmitted = false
    service.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, () => hasEmitted = true)

    // Act
    service.initializationState = state as ServiceInitializationState.error | ServiceInitializationState.initialized

    // Assert
    expect(service.initializationState).toBe(state)
    expect(hasEmitted).toBe(true)
  })
})
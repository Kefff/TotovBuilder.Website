import { IWebsiteConfiguration } from '../../models/configuration/IWebsiteConfiguration'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import WebsiteConfigurationMock from '../__data__/website-configuration.json'
import { useApiServiceMock } from '../__mocks__/ApiServiceMock'
import { ApiService } from '../../services/ApiService'
import { anyString, instance, mock, spy, verify, when } from 'ts-mockito'
import Result, { FailureType } from '../../utils/Result'
import Services from '../../services/repository/Services'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'
import { describe, expect, it } from 'vitest'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'

describe('initialize', () => {
  it('should fetch the website configuration from the API', async () => {
    // Arrange
    useApiServiceMock(WebsiteConfigurationMock as IWebsiteConfiguration)

    const service = new WebsiteConfigurationService()

    // Act
    const result = await service.initialize()

    // Assert
    expect(result).toBe(true)
    expect(service.configuration.buildSharingUrl).toBe('localhost:3000/s/')
  })

  it('should notify when the post update period flag is set', async () => {
    // Arrange
    useApiServiceMock({
      allowCookiesStorageKey: 'allow_cookies',
      bugReportUrl: 'https://discord.gg/bugreport',
      buildSharingUrl: 'localhost:3000/s/',
      buildsSortFieldStorageKey: 'builds_sort_field',
      buildsSortOrderStorageKey: 'builds_sort_order',
      buildStorageKeyPrefix: 'build_',
      cacheDuration: 3600,
      changelogApi: 'changelog',
      contactAddress: 'contact@address.com',
      discordUrl: 'https://discord.gg/server',
      exportFileExtension: '.ttb',
      exportFileNamePrefix: 'TotovBuilder',
      exportWarningShowedStoregeKey: 'export_warning',
      fetchMaxTries: 3,
      fetchTimeout: 30,
      fetchWaitTimeBetweenRetries: 2,
      githubUrl: 'https://github.com/User/Reposiory',
      globalFilterStorageKey: 'global_filter',
      itemCategoriesApi: 'itemcategories',
      itemsApi: 'items',
      languageStorageKey: 'language',
      notificationErrorDuration: 10,
      notificationInformationDuration: 5,
      notificationSuccessDuration: 5,
      notificationWarningDuration: 10,
      postUpdatePeriod: true,
      presetsApi: 'presets',
      pricesApi: 'prices',
      questsApi: 'quests',
      tarkovValuesApi: 'tarkovvalues',
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
      true,
      0)).once()
  })

  it('should do nothing when the API returns an error', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const apiServiceMock = mock<ApiService>()
    when(apiServiceMock.get(anyString())).thenReturn(Promise.resolve(Result.fail<void>(FailureType.error, 'ApiService.get()', 'API error')))
    Services.configure(ApiService, undefined, instance(apiServiceMock))

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
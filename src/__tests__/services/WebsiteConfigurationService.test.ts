import { anyString, instance, mock, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { FetchService } from '../../services/FetchService'
import { LogService } from '../../services/LogService'
import { NotificationService } from '../../services/NotificationService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'
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

  it('should log an exception when fetching fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.get(anyString())).thenResolve(undefined)
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const service = new WebsiteConfigurationService()

    // Act
    const result = await service.initialize()

    // Assert
    expect(result).toBe(false)
    expect(service.configuration.buildSharingUrl).toBe('')
    verify(logServiceMock.logException('message.websiteConfigurationNotFetched'))
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
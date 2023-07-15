import { IWebsiteConfiguration } from '../../models/configuration/IWebsiteConfiguration'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import WebsiteConfigurationMock from '../../../test-data/website-configuration.json'
import { useApiServiceMock } from '../../__mocks__/ApiServiceMock'
import { ApiService } from '../../services/ApiService'
import { anyString, instance, mock, when } from 'ts-mockito'
import Result, { FailureType } from '../../utils/Result'
import Services from '../../services/repository/Services'
import { NotificationService } from '../../services/NotificationService'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { describe, expect, it } from 'vitest'

describe('initialize', () => {
  it('should fetch the website configuration from the API', async () => {
    // Arrange
    useApiServiceMock(WebsiteConfigurationMock as IWebsiteConfiguration)

    const service = new WebsiteConfigurationService()

    // Act
    await service.initialize()

    // Assert
    expect(service.configuration.buildSharingUrl).toBe('localhost:3000/s/')
  })

  it('should do nothing when the API returns an error', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const apiServiceMock = mock<ApiService>()
    when(apiServiceMock.get(anyString())).thenReturn(Promise.resolve(Result.fail<void>(FailureType.error, 'ApiItemFetcher.get()', 'API error')))
    Services.configure(ApiService, undefined, instance(apiServiceMock))

    const service = new WebsiteConfigurationService()

    // Act
    await service.initialize()

    // Assert
    expect(service.configuration.buildSharingUrl).toBe('')
  })
})
import { TarkovValuesService } from '../../services/TarkovValuesService'
import TarkovValuesMock from '../../../test-data/tarkov-values.json'
import { ITarkovValues } from '../../models/configuration/ITarkovValues'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { useApiServiceMock } from '../../__mocks__/ApiServiceMock'
import Services from '../../services/repository/Services'
import { NotificationService } from '../../services/NotificationService'
import { anyString, instance, mock, when } from 'ts-mockito'
import Result, { FailureType } from '../../utils/Result'
import { ApiService } from '../../services/ApiService'
import { describe, expect, it } from 'vitest'

describe('initialize', () => {
  it('should fetch the values related to Tarkov gameplay from the API', async () => {
    // Arrange
    useApiServiceMock(TarkovValuesMock as ITarkovValues)
    useWebsiteConfigurationServiceMock()

    const service = new TarkovValuesService()

    // Act
    await service.initialize()

    // Assert
    expect(service.values.chestHp).toBe(85)
  })

  it('should do nothing when the API returns an error', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const apiServiceMock = mock<ApiService>()
    when(apiServiceMock.get(anyString())).thenReturn(Promise.resolve(Result.fail<void>(FailureType.error, 'ApiItemFetcher.get()', 'API error')))
    Services.configure(ApiService, undefined, instance(apiServiceMock))

    const service = new TarkovValuesService()

    // Act
    await service.initialize()

    // Assert
    expect(service.values.chestHp).toBe(0)
  })
})
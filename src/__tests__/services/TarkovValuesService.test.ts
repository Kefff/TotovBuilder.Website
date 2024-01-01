import { TarkovValuesService } from '../../services/TarkovValuesService'
import TarkovValuesMock from '../__data__/tarkov-values.json'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'
import { useFetchServiceMock } from '../__mocks__/FetchServiceMock'
import Services from '../../services/repository/Services'
import { NotificationService } from '../../services/NotificationService'
import { anyString, instance, mock, when } from 'ts-mockito'
import Result, { FailureType } from '../../utils/Result'
import { FetchService } from '../../services/FetchService'
import { describe, expect, it } from 'vitest'

describe('initialize', () => {
  it('should fetch the values related to Tarkov gameplay', async () => {
    // Arrange
    useFetchServiceMock(TarkovValuesMock)
    useWebsiteConfigurationServiceMock()

    const service = new TarkovValuesService()

    // Act
    const result = await service.initialize()

    // Assert
    expect(result).toBe(true)
    expect(service.values.chestHp).toBe(85)
  })

  it('should do nothing when the fetching fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.get(anyString())).thenReturn(Promise.resolve(Result.fail<void>(FailureType.error, 'FetchService.get()', 'Fetch error')))
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const service = new TarkovValuesService()

    // Act
    const result = await service.initialize()

    // Assert
    expect(result).toBe(false)
    expect(service.values.chestHp).toBe(0)
  })
})
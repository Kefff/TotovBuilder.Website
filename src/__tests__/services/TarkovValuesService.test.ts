import { anyString, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import TarkovValuesMock from '../../../public/data/tarkov-values.json'
import { FetchService } from '../../services/FetchService'
import { NotificationService } from '../../services/NotificationService'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import Services from '../../services/repository/Services'
import Result, { FailureType } from '../../utils/Result'
import { useFetchServiceMock } from '../__mocks__/FetchServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

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
    when(fetchServiceMock.get(anyString())).thenResolve(Result.fail<void>(FailureType.error, 'FetchService.get()', 'Fetch error'))
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const service = new TarkovValuesService()

    // Act
    const result = await service.initialize()

    // Assert
    expect(result).toBe(false)
    expect(service.values.chestHp).toBe(0)
  })
})
import { anyString, instance, mock, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import TarkovValuesMock from '../../../public/data/tarkov-values.json'
import { FetchService } from '../../services/FetchService'
import { LogService } from '../../services/LogService'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import Services from '../../services/repository/Services'
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

  it('should return false and log an exception when fetching fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.get(anyString())).thenResolve(undefined)
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const service = new TarkovValuesService()

    // Act
    const result = await service.initialize()

    // Assert
    expect(result).toBe(false)
    verify(logServiceMock.logException('message.tarkovValuesNotFetched')).once()
  })
})

describe('values getter', () => {
  it('should throw when when fetching has failed', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const service = new TarkovValuesService()

    // Act
    const act = () => service.values

    // Assert
    expect(act).toThrowError('No Tarkov value could be fetched.')
  })
})
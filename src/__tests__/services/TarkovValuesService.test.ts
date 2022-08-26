import { TarkovValuesService } from '../../services/TarkovValuesService'
import TarkovValuesMock from '../../../test-data/tarkov-values.json'
import { ITarkovValues } from '../../models/configuration/ITarkovValues'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { useApiServiceMock } from '../../__mocks__/ApiServiceMock'

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
})
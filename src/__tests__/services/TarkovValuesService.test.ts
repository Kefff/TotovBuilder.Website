import { TarkovValuesService } from '../../services/TarkovValuesService'

describe('initialize', () => {
  it('should fetch the values related to Tarkov gameplay from the API', async () => {
    // Arrange
    const service = new TarkovValuesService()

    // Act
    await service.initialize()

    // Assert
    expect(service.values.chestHp).toBe(85)
  })
})
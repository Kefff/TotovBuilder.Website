import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'

describe('initialize', () => {
  it('should fetch the website configuration from the API', async () => {
    // Arrange
    const service = new WebsiteConfigurationService()

    // Act
    await service.initialize()

    // Assert
    expect(service.configuration.buildSharingUrl).toBe('https://localhost:3000/s/')
  })
})
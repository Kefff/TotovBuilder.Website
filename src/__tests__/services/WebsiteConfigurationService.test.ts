import { IWebsiteConfiguration } from '../../models/configuration/IWebsiteConfiguration'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import WebsiteConfigurationMock from '../../../test-data/website-configuration.json'
import { useApiServiceMock } from '../../__mocks__/ApiServiceMock'

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
})
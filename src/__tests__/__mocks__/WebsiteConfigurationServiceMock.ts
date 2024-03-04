import { instance, mock, when } from 'ts-mockito'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import WebsiteConfigurationMock from '../../../public/data/website-configuration.json'

export function useWebsiteConfigurationServiceMock(): void {
  const websiteConfigurationServiceMock = mock<WebsiteConfigurationService>()
  when(websiteConfigurationServiceMock.configuration).thenReturn(WebsiteConfigurationMock)

  Services.configure(WebsiteConfigurationService, undefined, instance(websiteConfigurationServiceMock))
}
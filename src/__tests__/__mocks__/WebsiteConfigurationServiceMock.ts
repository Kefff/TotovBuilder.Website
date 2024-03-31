import { instance, mock, when } from 'ts-mockito'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'
import WebsiteConfigurationMock from '../__data__/websiteConfigurationMock'

export function useWebsiteConfigurationServiceMock(): void {
  const websiteConfigurationServiceMock = mock<WebsiteConfigurationService>()
  when(websiteConfigurationServiceMock.configuration).thenReturn(WebsiteConfigurationMock)

  Services.configure(WebsiteConfigurationService, undefined, instance(websiteConfigurationServiceMock))
}
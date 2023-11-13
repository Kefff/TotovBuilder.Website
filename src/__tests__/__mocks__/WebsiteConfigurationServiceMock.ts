import { instance, mock, when } from 'ts-mockito'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import WebsiteConfigurationMock from '../__data__/website-configuration.json'
import { IWebsiteConfiguration } from '../../models/configuration/IWebsiteConfiguration'

export function useWebsiteConfigurationServiceMock(): void {
  const websiteConfigurationServiceMock = mock<WebsiteConfigurationService>()
  when(websiteConfigurationServiceMock.configuration).thenReturn(WebsiteConfigurationMock as IWebsiteConfiguration)

  Services.configure(WebsiteConfigurationService, undefined, instance(websiteConfigurationServiceMock))
}
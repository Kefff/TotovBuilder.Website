import { IWebsiteConfiguration } from '../models/configuration/IWebsiteConfiguration'
import Configuration from '../../test-data/configuration.json'
import Services from './repository/Services'
import { ApiService } from './ApiService'

/**
 * Represents a service responsible for getting the website configuration.
 */
export class WebsiteConfigurationService {
  /**
   * Website configuration.
   */
  public configuration: IWebsiteConfiguration = {
    bugReportUrl: '',
    buildSharingUrl: '',
    buildsSortFieldStorageKey: '',
    buildsSortOrderStorageKey: '',
    buildStorageKeyPrefix: '',
    cacheDuration: 3600,
    changelogApi: '',
    contactAddress: '',
    discordUrl: '',
    exportFileExtension: '',
    exportFileNamePrefix: '',
    exportWarningShowedStoregeKey: '',
    fetchTimeout: 10,
    githubUrl: '',
    itemCategoriesApi: '',
    itemsApi: '',
    languageStorageKey: '',
    merchantFilterStorageKey: '',
    notificationErrorDuration: 10,
    notificationInformationDuration: 5,
    notificationSuccessDuration: 5,
    notificationWarningDuration: 10,
    presetsApi: '',
    pricesApi: '',
    questsApi: '',
    tarkovValuesApi: '',
    versionStorageKey: ''
  }

  /**
   * Initializes the data used by the service.
   */
  public async initialize(): Promise<void> {
    const apiService = Services.get(ApiService)
    const websiteConfigurationResult = await apiService.get<IWebsiteConfiguration>(Configuration.VITE_WEBSITE_CONFIGURATION_API as string)

    if (!websiteConfigurationResult.success) {
      throw new Error()
    }

    this.configuration = websiteConfigurationResult.value
  }
}
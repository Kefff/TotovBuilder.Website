import { TinyEmitter } from 'tiny-emitter'
import { IWebsiteConfiguration } from '../models/configuration/IWebsiteConfiguration'
import vueI18n from '../plugins/vueI18n'
import { FetchService } from './FetchService'
import { LogService } from './LogService'
import { ServiceInitializationState } from './repository/ServiceInitializationState'
import Services from './repository/Services'

/**
 * Represents a service responsible for getting the website configuration.
 */
export class WebsiteConfigurationService {
  /**
   * Name of the event fired when the website configuration has finised loading.
   */
  public static initializationFinishedEvent = 'websiteConfigurationServiceInitialized'

  /**
   * Website configuration.
   */
  public configuration: IWebsiteConfiguration = {
    allowCookiesStorageKey: 'allow_cookies',
    bugReportUrl: import.meta.env.VITE_DISCORD_URL,
    buildSharingUrl: '',
    buildsSortFieldStorageKey: 'builds_sort_field',
    buildsSortOrderStorageKey: 'builds_sort_order',
    buildStorageKeyPrefix: 'build_',
    cacheDuration: 3600,
    contactAddress: 'totovbuilder@gmail.com',
    discordUrl: import.meta.env.VITE_BUG_REPORT_URL,
    endpointChangelog: '',
    endpointItemCategories: '',
    endpointItems: '',
    endpointPresets: '',
    endpointPrices: '',
    endpointTarkovValues: '',
    exportFileExtension: '',
    exportFileNamePrefix: '',
    exportWarningShowedStorageKey: '',
    fetchMaxTries: 6,
    fetchTimeout: 9,
    fetchWaitTimeBetweenRetries: 1,
    githubUrl: '',
    globalFilterStorageKey: 'global_filter',
    languageStorageKey: 'language',
    notificationErrorDuration: 10,
    notificationInformationDuration: 5,
    notificationSuccessDuration: 5,
    notificationWarningDuration: 10,
    postUpdatePeriod: false,
    version: '',
    versionStorageKey: ''
  }

  /**
   * Event emitter used to initialization state change.
   */
  public emitter = new TinyEmitter()

  /**
   * Initialization state of the service.
   */
  public get initializationState(): ServiceInitializationState {
    return this._initializationState
  }
  public set initializationState(state: ServiceInitializationState.error | ServiceInitializationState.initialized) {
    this._initializationState = state
    this.emitter.emit(WebsiteConfigurationService.initializationFinishedEvent)
  }
  private _initializationState = ServiceInitializationState.initializing

  /**
   * Initializes the data used by the service.
   */
  public async initialize(): Promise<boolean> {
    const websiteConfiguration = await this.fetchWebsiteConfiguration()

    if (websiteConfiguration == null) {
      return false
    }

    this.configuration = websiteConfiguration

    return true
  }

  /**
   * Fetches the website configuration.
   * @returns Website configuration.
   */
  private async fetchWebsiteConfiguration(): Promise<IWebsiteConfiguration | undefined> {
    const fetchService = Services.get(FetchService)
    const websiteConfiguration = await fetchService.get<IWebsiteConfiguration>('/' + import.meta.env.VITE_WEBSITE_CONFIGURATION_ENDPOINT as string)

    if (websiteConfiguration == null) {
      Services.get(LogService).logError(vueI18n.t('message.websiteConfigurationNotFetched'))

      return undefined
    }

    if (import.meta.env.VITE_DEBUG === 'true') {
      Services.get(LogService).logInformation('message.websiteConfigurationFetched')
    }

    return websiteConfiguration
  }
}
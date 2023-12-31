import { IWebsiteConfiguration } from '../models/configuration/IWebsiteConfiguration'
import Services from './repository/Services'
import { FetchService } from './FetchService'
import Result, { FailureType } from '../utils/Result'
import i18n from '../plugins/vueI18n'
import { TinyEmitter } from 'tiny-emitter'
import { ServiceInitializationState } from './repository/ServiceInitializationState'
import { NotificationService, NotificationType } from './NotificationService'
import { LogService } from './LogService'

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
    fetchMaxTries: 5,
    fetchTimeout: 30,
    fetchWaitTimeBetweenRetries: 2,
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
    const websiteConfigurationResult = await this.fetchWebsiteConfiguration()

    if (!websiteConfigurationResult.success) {
      return false
    }

    this.configuration = websiteConfigurationResult.value

    if (this.configuration.postUpdatePeriod) {
      Services.get(NotificationService).notify(NotificationType.information, i18n.t('message.postUpdatePeriod'), 0)
    }

    return true
  }

  /**
   * Fetches the website configuration.
   * @returns Website configuration.
   */
  private async fetchWebsiteConfiguration(): Promise<Result<IWebsiteConfiguration>> {
    const fetchService = Services.get(FetchService)
    const websiteConfigurationResult = await fetchService.get<IWebsiteConfiguration>('/' + import.meta.env.VITE_WEBSITE_CONFIGURATION_ENDPOINT as string)

    if (!websiteConfigurationResult.success) {
      return Result.fail(FailureType.error, 'WebsiteConfigurationService.fetchWebsiteConfiguration()', i18n.t('message.websiteConfigurationNotFetched'))
    }

    Services.get(LogService).logInformation('message.websiteConfigurationFetched')

    return websiteConfigurationResult
  }
}
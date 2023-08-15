import { IWebsiteConfiguration } from '../models/configuration/IWebsiteConfiguration'
import Services from './repository/Services'
import { ApiService } from './ApiService'
import Result, { FailureType } from '../utils/Result'
import i18n from '../plugins/vueI18n'
import { TinyEmitter } from 'tiny-emitter'
import { ServiceInitializationState } from './repository/ServiceInitializationState'
import { NotificationService, NotificationType } from './NotificationService'

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
    changelogApi: '',
    contactAddress: 'totovbuilder@gmail.com',
    discordUrl: import.meta.env.VITE_BUG_REPORT_URL,
    exportFileExtension: '',
    exportFileNamePrefix: '',
    exportWarningShowedStoregeKey: '',
    fetchMaxTries: 5,
    fetchTimeout: 30,
    fetchWaitTimeBetweenRetries: 2,
    githubUrl: '',
    globalFilterStorageKey: 'global_filter',
    itemCategoriesApi: '',
    itemsApi: '',
    languageStorageKey: 'language',
    notificationErrorDuration: 10,
    notificationInformationDuration: 5,
    notificationSuccessDuration: 5,
    notificationWarningDuration: 10,
    postUpdatePeriod: false,
    presetsApi: '',
    pricesApi: '',
    questsApi: '',
    tarkovValuesApi: '',
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
      Services.get(NotificationService).notify(NotificationType.information, i18n.t('message.postUpdatePeriod'), true, 0)
    }

    return true
  }

  /**
   * Fetches the website configuration.
   * @returns Website configuration.
   */
  private async fetchWebsiteConfiguration(): Promise<Result<IWebsiteConfiguration>> {
    const apiService = Services.get(ApiService)
    const websiteConfigurationResult = await apiService.get<IWebsiteConfiguration>(import.meta.env.VITE_WEBSITE_CONFIGURATION_API as string)

    if (!websiteConfigurationResult.success) {
      return Result.fail(FailureType.error, 'WebsiteConfigurationService.fetchWebsiteConfiguration()', i18n.t('message.websiteConfigurationNotFetched'))
    }

    return websiteConfigurationResult
  }
}
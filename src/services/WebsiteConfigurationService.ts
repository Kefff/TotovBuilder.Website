import { TinyEmitter } from 'tiny-emitter'
import { IWebsiteConfiguration } from '../models/configuration/IWebsiteConfiguration'
import baseConfiguration from '../websiteConfiguration'
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
  public get configuration(): IWebsiteConfiguration {
    return this._configuration
  }
  private _configuration = baseConfiguration // Base configuration to be able to fetch the real full configuration

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

    this._configuration = { ...this._configuration, ...websiteConfiguration }

    return true
  }

  /**
   * Fetches the website configuration.
   * @returns Website configuration.
   */
  private async fetchWebsiteConfiguration(): Promise<IWebsiteConfiguration | undefined> {
    const isDebug = import.meta.env.VITE_DEBUG === 'true'
    const fetchService = Services.get(FetchService)

    if (isDebug) {
      Services.get(LogService).logInformation('message.fetchingWebsiteConfiguration', { date: new Date().toISOString() })
    }

    const websiteConfiguration = await fetchService.get<IWebsiteConfiguration>('/' + this._configuration.endpointWebsiteConfiguration)

    if (websiteConfiguration == null) {
      Services.get(LogService).logException('message.websiteConfigurationNotFetched')

      return undefined
    }

    if (isDebug) {
      Services.get(LogService).logInformation('message.websiteConfigurationFetched', { date: new Date().toISOString() })
    }

    return websiteConfiguration
  }
}
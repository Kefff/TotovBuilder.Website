import { ITarkovValues } from '../models/configuration/ITarkovValues'
import vueI18n from '../plugins/vueI18n'
import { FetchService } from './FetchService'
import { LogService } from './LogService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import Services from './repository/Services'

/**
 * Represents a service responsible for getting values related to Tarkov gameplay.
 */
export class TarkovValuesService {
  /**
   * Values related to Tarkov gameplay.
   */
  public get values(): ITarkovValues {
    if (this._values == null) {
      // This should never happen, data should have been loaded or a error message should have been displayed
      throw new Error(vueI18n.t('message.tarkovValuesNotFetched'))
    }

    return this._values
  }
  private _values: ITarkovValues | undefined

  /**
   * Initializes the data used by the service.
   */
  public async initializeAsync(): Promise<boolean> {
    const fetchedValues = await this.fetchTarkovValuesAsync()

    if (fetchedValues == undefined) {
      return false
    }

    this._values = fetchedValues

    return true
  }

  /**
   * Fetches the Tarkov values.
   * @returns Tarkov values.
   */
  private async fetchTarkovValuesAsync(): Promise<ITarkovValues | undefined> {
    const isDebug = import.meta.env.VITE_DEBUG === 'true'
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointTarkovValues

    if (isDebug) {
      Services.get(LogService).logInformation('message.fetchingTarkovValues', { date: new Date().toISOString() })
    }

    const tarkovValues = await fetchService.fetchWithRetryAsync<ITarkovValues>({ endpoint })

    if (tarkovValues == null) {
      Services.get(LogService).logException('message.tarkovValuesNotFetched')

      return undefined
    }

    if (isDebug) {
      Services.get(LogService).logInformation('message.tarkovValuesFetched', { date: new Date().toISOString() })
    }

    return tarkovValues
  }
}
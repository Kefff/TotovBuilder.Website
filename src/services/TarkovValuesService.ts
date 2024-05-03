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
  public values: ITarkovValues = {
    armorPenetrationEfficiencies: [],
    chestHp: 0,
    currencies: [],
    heavyEncumbermentWeight: 0,
    lightEncumbermentWeight: 0,
    merchants: [],
    ricochetChances: []
  }

  /**
   * Initializes the data used by the service.
   */
  public async initialize(): Promise<boolean> {
    const tarkovValues = await this.fetchTarkovValues()

    if (tarkovValues == undefined) {
      return false
    }

    this.values = tarkovValues

    return true
  }

  /**
   * Fetches the Tarkov values.
   * @returns Tarkov values.
   */
  private async fetchTarkovValues(): Promise<ITarkovValues | undefined> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointTarkovValues
    const tarkovValues = await fetchService.get<ITarkovValues>(endpoint)

    if (tarkovValues == null) {
      Services.get(LogService).logError(vueI18n.t('message.tarkovValuesNotFetched'))

      return undefined
    }

    if (import.meta.env.VITE_DEBUG === 'true') {
      Services.get(LogService).logInformation('message.tarkovValuesFetched')
    }

    return tarkovValues
  }
}
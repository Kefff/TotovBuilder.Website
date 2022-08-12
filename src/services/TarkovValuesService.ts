import Services from './repository/Services'
import { ApiService } from './ApiService'
import { ITarkovValues } from '../models/configuration/ITarkovValues'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'

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
  public async initialize(): Promise<void> {
    const apiService = Services.get(ApiService)
    const tarkovValuesResult = await apiService.get<ITarkovValues>(Services.get(WebsiteConfigurationService).configuration.tarkovValuesApi)

    if (!tarkovValuesResult.success) {
      throw new Error()
    }

    this.values = tarkovValuesResult.value
  }
}
import Services from './repository/Services'
import { ApiService } from './ApiService'
import { ITarkovValues } from '../models/configuration/ITarkovValues'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import { NotificationService, NotificationType } from './NotificationService'
import Result, { FailureType } from '../utils/Result'
import i18n from '../plugins/vueI18n'

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
    const tarkovValuesResult = await this.fetchTarkovValues()

    if (!tarkovValuesResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, tarkovValuesResult.failureMessage, true)

      return
    }

    this.values = tarkovValuesResult.value
  }

  /**
   * Fetches the Tarkov values.
   * @returns Tarkov values.
   */
  private async fetchTarkovValues(): Promise<Result<ITarkovValues>> {
    const apiService = Services.get(ApiService)
    const tarkovValuesResult = await apiService.get<ITarkovValues>(Services.get(WebsiteConfigurationService).configuration.tarkovValuesApi)

    if (!tarkovValuesResult.success) {
      return Result.fail(FailureType.error, 'TarkovValuesService.fetchTarkovValues()', i18n.t('message.tarkovValuesNotFetched'))
    }

    return tarkovValuesResult
  }
}
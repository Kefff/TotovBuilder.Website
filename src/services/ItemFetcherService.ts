import Result, { FailureType } from '../utils/Result'
import i18n from '../plugins/vueI18n'
import { ApiService } from './ApiService'
import Services from './repository/Services'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItemCategory } from '../models/configuration/IItemCategory'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'

/**
 * Represents a service responsible for fetching items through a web API.
 */
export class ItemFetcherService {
  /**
   * Fetches all item categories.
   * @returns Item categories.
   */
  public async fetchItemCategories(): Promise<Result<IItemCategory[]>> {
    const apiService = Services.get(ApiService)
    const itemCategoriesResult = await apiService.get<IItemCategory[]>(Services.get(WebsiteConfigurationService).configuration.itemCategoriesApi)

    if (!itemCategoriesResult.success || itemCategoriesResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ItemFetcherService.fetchItemCategories()', i18n.t('message.itemsCategoriesNotFetched'))
    }

    return itemCategoriesResult
  }

  /**
   * Fetches all items.
   * @returns Items.
   */
  public async fetchItems(): Promise<Result<IItem[]>> {
    const apiService = Services.get(ApiService)
    const itemsResult = await apiService.get<IItem[]>(Services.get(WebsiteConfigurationService).configuration.itemsApi)

    if (!itemsResult.success || itemsResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ItemFetcherService.fetchItems()', i18n.t('message.itemsNotFetched'))
    }

    return Result.ok(itemsResult.value)
  }

  /**
   * Fetches all prices.
   * @returns Prices.
   */
  public async fetchPrices(): Promise<Result<IPrice[]>> {
    const apiService = Services.get(ApiService)
    const pricesResult = await apiService.get<IPrice[]>(Services.get(WebsiteConfigurationService).configuration.pricesApi)

    if (!pricesResult.success || pricesResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ItemFetcherService.fetchPrices()', i18n.t('message.pricesNotFetched'))
    }

    return pricesResult
  }

  /**
   * Fetches all presets.
   * @returns Presets.
   */
  public async fetchPresets(): Promise<Result<IInventoryItem[]>> {
    const apiService = Services.get(ApiService)
    const presetsResult = await apiService.get<IInventoryItem[]>(Services.get(WebsiteConfigurationService).configuration.presetsApi)

    if (!presetsResult.success || presetsResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ItemFetcherService.fetchPresets()', i18n.t('message.presetsNotFetched'))
    }

    return presetsResult
  }
}
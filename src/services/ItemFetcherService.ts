import Result, { FailureType } from '../utils/Result'
import i18n from '../plugins/vueI18n'
import { FetchService } from './FetchService'
import Services from './repository/Services'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
import { LogService } from './LogService'

/**
 * Represents a service responsible for fetching items.
 */
export class ItemFetcherService {
  /**
   * Fetches all item categories.
   * @returns Item categories.
   */
  public async fetchItemCategories(): Promise<Result<string[]>> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointItemCategories
    const itemCategoriesResult = await fetchService.get<string[]>(endpoint)

    if (!itemCategoriesResult.success || itemCategoriesResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ItemFetcherService.fetchItemCategories()', i18n.t('message.itemCategoriesNotFetched'))
    }

    Services.get(LogService).logInformation('message.itemCategoriesFetched')

    return itemCategoriesResult
  }

  /**
   * Fetches all items.
   * @returns Items.
   */
  public async fetchItems(): Promise<Result<IItem[]>> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointItems
    const itemsResult = await fetchService.get<IItem[]>(endpoint)

    if (!itemsResult.success || itemsResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ItemFetcherService.fetchItems()', i18n.t('message.itemsNotFetched'))
    }

    Services.get(LogService).logInformation('message.itemsFetched')

    return Result.ok(itemsResult.value)
  }

  /**
   * Fetches all prices.
   * @returns Prices.
   */
  public async fetchPrices(): Promise<Result<IPrice[]>> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointPrices
    const pricesResult = await fetchService.get<IPrice[]>(endpoint)

    if (!pricesResult.success || pricesResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ItemFetcherService.fetchPrices()', i18n.t('message.pricesNotFetched'))
    }

    Services.get(LogService).logInformation('message.pricesFetched')

    return pricesResult
  }

  /**
   * Fetches all presets.
   * @returns Presets.
   */
  public async fetchPresets(): Promise<Result<IInventoryItem[]>> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointPresets
    const presetsResult = await fetchService.get<IInventoryItem[]>(endpoint)

    if (!presetsResult.success || presetsResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ItemFetcherService.fetchPresets()', i18n.t('message.presetsNotFetched'))
    }

    Services.get(LogService).logInformation('message.presetsFetched')

    return presetsResult
  }
}
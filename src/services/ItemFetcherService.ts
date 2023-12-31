import Result, { FailureType } from '../utils/Result'
import i18n from '../plugins/vueI18n'
import { FetchService } from './FetchService'
import Services from './repository/Services'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
import { LogService } from './LogService'
import { ReductionService } from './ReductionService'

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
    const reducedItemsResult = await fetchService.get<Record<string, unknown>[]>(endpoint)

    if (!reducedItemsResult.success || reducedItemsResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ItemFetcherService.fetchItems()', i18n.t('message.itemsNotFetched'))
    }

    const items: IItem[] = []
    const reductionService = Services.get(ReductionService)

    for (const reducedItem of reducedItemsResult.value) {
      const item = reductionService.parseReducedItem(reducedItem)
      items.push(item)
    }

    Services.get(LogService).logInformation('message.itemsFetched')

    return Result.ok(items)
  }

  /**
   * Fetches all prices.
   * @returns Prices.
   */
  public async fetchPrices(): Promise<Result<IPrice[]>> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointPrices
    const reducedPricesResult = await fetchService.get<Record<string, unknown>[]>(endpoint)

    if (!reducedPricesResult.success || reducedPricesResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ItemFetcherService.fetchPrices()', i18n.t('message.pricesNotFetched'))
    }

    const prices: IPrice[] = []
    const reductionService = Services.get(ReductionService)

    for (const reducedPrice of reducedPricesResult.value) {
      const price = reductionService.parseReducedPrice(reducedPrice)
      prices.push(price)
    }

    Services.get(LogService).logInformation('message.pricesFetched')

    return Result.ok(prices)
  }

  /**
   * Fetches all presets.
   * @returns Presets.
   */
  public async fetchPresets(): Promise<Result<IInventoryItem[]>> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointPresets
    const reducedPresetsResult = await fetchService.get<Record<string, unknown>[]>(endpoint)

    if (!reducedPresetsResult.success || reducedPresetsResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ItemFetcherService.fetchPresets()', i18n.t('message.presetsNotFetched'))
    }

    const presets: IInventoryItem[] = []
    const reductionService = Services.get(ReductionService)

    for (const reducedPreset of reducedPresetsResult.value) {
      const preset = reductionService.parseReducedInventoryItem(reducedPreset).value
      presets.push(preset)
    }

    Services.get(LogService).logInformation('message.presetsFetched')

    return Result.ok(presets)
  }
}
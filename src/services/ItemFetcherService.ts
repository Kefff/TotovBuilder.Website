import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
import vueI18n from '../plugins/vueI18n'
import { FetchService } from './FetchService'
import { LogService } from './LogService'
import { ReductionService } from './ReductionService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import Services from './repository/Services'

/**
 * Represents a service responsible for fetching items.
 */
export class ItemFetcherService {
  /**
   * Indicates whether the application is in debug mode.
   */
  private get isDebug(): boolean {
    return import.meta.env.VITE_DEBUG === 'true'
  }

  /**
   * Fetches all item categories.
   * @returns Item categories.
   */
  public async fetchItemCategories(): Promise<string[] | undefined> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointItemCategories
    const itemCategories = await fetchService.get<string[]>(endpoint)

    if (itemCategories == null || itemCategories.length === 0) {
      Services.get(LogService).logError(vueI18n.t('message.itemCategoriesNotFetched'))

      return undefined
    }

    if (this.isDebug) {
      Services.get(LogService).logInformation('message.itemCategoriesFetched')
    }

    return itemCategories
  }

  /**
   * Fetches all items.
   * @returns Items.
   */
  public async fetchItems(): Promise<IItem[] | undefined> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointItems
    const reducedItems = await fetchService.get<Record<string, unknown>[]>(endpoint)

    if (reducedItems == null || reducedItems.length === 0) {
      Services.get(LogService).logError(vueI18n.t('message.itemsNotFetched'))

      return undefined
    }

    const items: IItem[] = []
    const reductionService = Services.get(ReductionService)

    for (const reducedItem of reducedItems) {
      const item = reductionService.parseReducedItem(reducedItem)
      items.push(item)
    }

    if (this.isDebug) {
      Services.get(LogService).logInformation('message.itemsFetched')
    }

    return items
  }

  /**
   * Fetches all prices.
   * @returns Prices.
   */
  public async fetchPrices(): Promise<IPrice[] | undefined> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointPrices
    const reducedPrices = await fetchService.get<Record<string, unknown>[]>(endpoint)

    if (reducedPrices == null || reducedPrices.length === 0) {
      Services.get(LogService).logError(vueI18n.t('message.pricesNotFetched'))

      return undefined
    }

    const prices: IPrice[] = []
    const reductionService = Services.get(ReductionService)

    for (const reducedPrice of reducedPrices) {
      const price = reductionService.parseReducedPrice(reducedPrice)
      prices.push(price)
    }

    if (this.isDebug) {
      Services.get(LogService).logInformation('message.pricesFetched')
    }

    return prices
  }

  /**
   * Fetches all presets.
   * @returns Presets.
   */
  public async fetchPresets(): Promise<IInventoryItem[] | undefined> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointPresets
    const reducedPresets = await fetchService.get<Record<string, unknown>[]>(endpoint)

    if (reducedPresets == null || reducedPresets.length === 0) {
      Services.get(LogService).logError(vueI18n.t('message.presetsNotFetched'))

      return undefined
    }

    const presets: IInventoryItem[] = []
    const reductionService = Services.get(ReductionService)

    for (const reducedPreset of reducedPresets) {
      const preset = reductionService.parseReducedInventoryItem(reducedPreset)

      if (preset != null) {
        presets.push(preset)
      }
    }

    if (this.isDebug) {
      Services.get(LogService).logInformation('message.presetsFetched')
    }

    return presets
  }
}
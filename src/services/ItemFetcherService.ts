import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
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
   * Fetches all items.
   * @returns Items.
   */
  public async fetchItemsAsync(language: string): Promise<IItem[] | undefined> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointItems.replace('{0}', language)

    if (this.isDebug) {
      Services.get(LogService).logInformation('message.fetchingItems', { date: new Date().toISOString() })
    }

    const reducedItems = await fetchService.fetchWithRetryAsync<Record<string, unknown>[]>({ endpoint })

    if (reducedItems == null || reducedItems.length === 0) {
      Services.get(LogService).logException('message.itemsNotFetched')

      return undefined
    }

    const items: IItem[] = []
    const reductionService = Services.get(ReductionService)

    for (const reducedItem of reducedItems) {
      const item = reductionService.parseReducedItem(reducedItem)
      items.push(item)
    }

    if (this.isDebug) {
      Services.get(LogService).logInformation('message.itemsFetched', { date: new Date().toISOString() })
    }

    return items
  }

  /**
   * Fetches all prices.
   * @returns Prices.
   */
  public async fetchPricesAsync(gameMode: string, language: string): Promise<IPrice[] | undefined> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointPrices.replace('{0}', gameMode).replace('{1}', language)

    if (this.isDebug) {
      Services.get(LogService).logInformation('message.fetchingPrices', { date: new Date().toISOString() })
    }

    const reducedPrices = await fetchService.fetchWithRetryAsync<Record<string, unknown>[]>({ endpoint })

    if (reducedPrices == null || reducedPrices.length === 0) {
      Services.get(LogService).logException('message.pricesNotFetched')

      return undefined
    }

    const prices: IPrice[] = []
    const reductionService = Services.get(ReductionService)

    for (const reducedPrice of reducedPrices) {
      const price = reductionService.parseReducedPrice(reducedPrice)
      prices.push(price)
    }

    if (this.isDebug) {
      Services.get(LogService).logInformation('message.pricesFetched', { date: new Date().toISOString() })
    }

    return prices
  }

  /**
   * Fetches all presets.
   * @returns Presets.
   */
  public async fetchPresetsAsync(): Promise<IInventoryItem[] | undefined> {
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointPresets

    if (this.isDebug) {
      Services.get(LogService).logInformation('message.fetchingPresets', { date: new Date().toISOString() })
    }

    const reducedPresets = await fetchService.fetchWithRetryAsync<Record<string, unknown>[]>({ endpoint })

    if (reducedPresets == null || reducedPresets.length === 0) {
      Services.get(LogService).logException('message.presetsNotFetched')

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
      Services.get(LogService).logInformation('message.presetsFetched', { date: new Date().toISOString() })
    }

    return presets
  }
}
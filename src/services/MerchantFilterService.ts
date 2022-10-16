import { IMerchantFilter } from '../models/utils/IMerchantFilter'
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
import { TinyEmitter } from 'tiny-emitter'
import Services from './repository/Services'
import { TarkovValuesService } from './TarkovValuesService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'

/**
 * Represents a service that manages merchant filters.
 */
export class MerchantFilterService {
  /**
   * Change event.
   */
  public static changeEvent = 'merchantFiltersChanged'

  /**
   * Event emitter used to signal compatibility check requests.
   */
  public emitter = new TinyEmitter()

  /**
   * Filters.
   */
  private filters: IMerchantFilter[] = []

  /**
   * Initializes a new instance of the MerchantFilterService class.
   */
  public constructor() {
    this.get()
  }

  /**
   * Gets merchant filters.
   * @returns load
   */
  public get(): IMerchantFilter[] {
    const filters: IMerchantFilter[] = []
    let savedFilters: IMerchantFilter[] = []
    const storageKey = this.getKey()
    const serializedFilters = localStorage.getItem(storageKey)

    if (serializedFilters != undefined) {
      savedFilters = JSON.parse(serializedFilters) as IMerchantFilter[]
    }

    for (const merchant of Services.get(TarkovValuesService).values.merchants.filter(m => m.showInFilter)) {
      const savedFilter = savedFilters.find(sf => sf.merchant === merchant.name)

      filters.push({
        enabled: savedFilter?.enabled ?? true,
        merchantLevel: savedFilter?.merchantLevel ?? merchant.maxLevel,
        merchant: savedFilter?.merchant ?? merchant.name
      })
    }

    this.filters = filters

    return this.filters
  }

  /**
   * Gets the levels of a merchant.
   * @param merchantName - Merchant name.
   * @returns Levels.
   */
  public getMerchantLevels(merchantName: string): number[] {
    const levels: number[] = []
    const merchant = Services.get(TarkovValuesService).values.merchants.find(m => m.name === merchantName)

    if (merchant !== undefined) {
      for (let i = merchant.minLevel; i <= merchant.maxLevel; i++) {
        levels.push(i)
      }
    }

    return levels
  }

  /**
   * Gets the the prices of an item that corresponds to the merchant filters.
   * @param item - Item.
   * @returns Price.
   */
  public getMatchingPrices(item: IItem): IPrice[] {
    const result = item.prices.filter(p => this.isMatchingFilters(p))

    return result
  }

  /**
   * Indicates whether a merchant has multiple levels or not.
   * @param merchantName - Merchant name.
   * @returns true if the merchant has levels ; otherwise false.
   */
  public hasLevels(merchantName: string): boolean {
    const merchant = Services.get(TarkovValuesService).values.merchants.find(m => m.name === merchantName)
    const result = merchant !== undefined ? merchant.maxLevel > merchant.minLevel : false

    return result
  }

  /**
   * Indicates whether an item has prices that match the merchant filters.
   * Also filters out items that have no prices.
   * @param item - Item.
   * @param includeItemsWithouMerchantFilter - Indicates whether "Show items without merchant" filter is taken into consideration.
   * @returns true when the item has prices that match the merchant filters; otherwise false.
   */
  public hasMatchingPrices(item: IItem, includeItemsWithouMerchantFilter: boolean): boolean {
    const result =
      (includeItemsWithouMerchantFilter && item.prices.length === 0 && this.filters.some(f => f.merchant === 'items-without-merchant' && f.enabled))
      || item.prices.some(p => this.isMatchingFilters(p))

    return result
  }

  /**
   * Saves merchant filters.
   * @param filters - Filters.
   */
  public save(filters: IMerchantFilter[]): void {
    this.filters = filters
    const storageKey = this.getKey()
    localStorage.setItem(storageKey, JSON.stringify(this.filters))

    this.emitter.emit(MerchantFilterService.changeEvent)
  }

  /**
   * Gets a storage key.
   * @returns Storage key.
   */
  private getKey(): string {
    const key = Services.get(WebsiteConfigurationService).configuration.merchantFilterStorageKey

    return key
  }

  /**
   * Indicates whether a price matches the merchant filters.
   * @param price - Price.
   * @returns true when price matches the merchant filters; otherwise false.
   */
  private isMatchingFilters(price: IPrice): boolean {
    const result = this.filters.some(f =>
      f.enabled
      && f.merchant === price.merchant
      && f.merchantLevel >= price.merchantLevel
      && price.currencyName !== 'barter') // // TODO : Handling barters - WORKAROUND WAITING FOR BARTERS TO BE HANDLED. REMOVE && price.currencyName !== 'barter' WHEN IT IS DONE -->

    return result
  }
}
import { IMerchantFilter } from '../models/utils/IMerchantFilter'
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
import { TinyEmitter } from 'tiny-emitter'
import Services from './repository/Services'
import { TarkovValuesService } from './TarkovValuesService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import { IGlobalFilter } from '../models/utils/IGlobalFilter'
import { IItemExclusionFilter } from '../models/utils/IItemExclusionFilter'
import { ItemPropertiesService } from './ItemPropertiesService'
import { IModdable } from '../models/item/IModdable'

/**
 * Represents a service that manages merchant filters.
 */
export class GlobalFilterService {
  /**
   * Change event.
   */
  public static changeEvent = 'globalFilterChanged'

  /**
   * Name of the items without merchant filter.
   */
  public static excludeItemsWithoutMerchantFilterName = 'items-without-merchant'

  /**
   * Name of the base preset items filter.
   */
  public static excludePresetBaseItemsFilterName = 'preset-base-items'

  /**
   * Event emitter used to signal compatibility check requests.
   */
  public emitter = new TinyEmitter()

  /**
   * Filter.
   */
  private filter: IGlobalFilter = {
    itemExclusionFilters: [],
    merchantFilters: []
  }

  /**
   * Initializes a new instance of the GlobalFilterService class.
   */
  public constructor() {
    this.initialize()
  }

  /**
   * Gets merchant filters.
   * @returns Merchant filters.
   */
  public get(): IGlobalFilter {
    return this.filter
  }

  /**
   * Gets the levels of a merchant.
   * @param merchantName - Merchant name.
   * @returns Levels.
   */
  public getMerchantLevels(merchantName: string): number[] {
    const levels: number[] = []
    const merchant = Services.get(TarkovValuesService).values.merchants.find(m => m.name === merchantName)

    if (merchant != null) {
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
    const result = item.prices.filter(p => this.isPriceMatchingFilter(this.filter.merchantFilters, p))

    return result
  }

  /**
   * Indicates whether a merchant has multiple levels or not.
   * @param merchantName - Merchant name.
   * @returns true if the merchant has levels ; otherwise false.
   */
  public hasLevels(merchantName: string): boolean {
    const merchant = Services.get(TarkovValuesService).values.merchants.find(m => m.name === merchantName)
    const result = merchant != null ? merchant.maxLevel > merchant.minLevel : false

    return result
  }

  /**
   * Indicates whether an item is not excluded and has prices that match the merchant filters.
   * Also filters out items that have no prices.
   * @param item - Item.
   * @param includeItemsWithoutMerchantFilter - Indicates whether "Show items without merchant" filter is taken into consideration.
   * @returns true when the item has prices that match the merchant filters; otherwise false.
   */
  public isMatchingFilter(item: IItem, includeItemsWithoutMerchantFilter: boolean): boolean {
    const filter: IGlobalFilter = {
      itemExclusionFilters: [...this.filter.itemExclusionFilters], // New list to avoid changing the filter while temporarily including or ignoring the items without merchant filter
      merchantFilters: this.filter.merchantFilters
    }
    const excludeItemsWithoutMerchantFilter = filter.itemExclusionFilters.find(f => f.name == GlobalFilterService.excludeItemsWithoutMerchantFilterName)

    /* istanbul ignore else */
    if (excludeItemsWithoutMerchantFilter != null) {
      // Should always be found
      excludeItemsWithoutMerchantFilter.enabled = !includeItemsWithoutMerchantFilter
    }

    const isExcluded = filter.itemExclusionFilters.some(f => f.enabled && f.exclude(item))
    const hasMatchingPrice = item.prices.some(p => this.isPriceMatchingFilter(filter.merchantFilters, p))

    return !isExcluded && (hasMatchingPrice || (item.prices.length == 0 && includeItemsWithoutMerchantFilter))
  }

  /**
   * Sets the item filters and saves them.
   * @param itemFilters - Merchant filters.
   */
  public setItemFilters(itemFilters: IItemExclusionFilter[]): void {
    this.filter.itemExclusionFilters = itemFilters
    this.save()
  }

  /**
   * Sets the merchant filters and saves them.
   * @param merchantFilters - Merchant filters.
   */
  public setMerchantFilters(merchantFilters: IMerchantFilter[]): void {
    this.filter.merchantFilters = merchantFilters
    this.save()
  }

  /**
   * Gets a storage key.
   * @returns Storage key.
   */
  private getStorageKey(): string {
    const key = Services.get(WebsiteConfigurationService).configuration.globalFilterStorageKey

    return key
  }

  /**
   * Initializes the filter.
   */
  private initialize() {
    const filter: IGlobalFilter = {
      itemExclusionFilters: [],
      merchantFilters: []
    }
    let savedFilter: IGlobalFilter = {
      itemExclusionFilters: [],
      merchantFilters: []
    }
    const storageKey = this.getStorageKey()
    const serializedFilters = localStorage.getItem(storageKey)

    if (serializedFilters != null) {
      savedFilter = JSON.parse(serializedFilters) as IGlobalFilter
    }

    // Merchant filters
    for (const merchant of Services.get(TarkovValuesService).values.merchants.filter(m => m.showInFilter)) {
      const savedMerchantFilter = savedFilter.merchantFilters.find(sf => sf.merchant === merchant.name)

      filter.merchantFilters.push({
        enabled: savedMerchantFilter?.enabled ?? true,
        merchantLevel: savedMerchantFilter?.merchantLevel ?? merchant.maxLevel,
        merchant: savedMerchantFilter?.merchant ?? merchant.name
      })
    }

    // Item filters
    const excludeItemsWithoutMerchantFilter = savedFilter.itemExclusionFilters.find(f => f.name === GlobalFilterService.excludeItemsWithoutMerchantFilterName)
    filter.itemExclusionFilters.push({
      enabled: excludeItemsWithoutMerchantFilter?.enabled ?? true,
      exclude: this.excludeItemWithoutMerchant,
      name: GlobalFilterService.excludeItemsWithoutMerchantFilterName
    })

    const excludePresetBaseItemsFilter = savedFilter.itemExclusionFilters.find(f => f.name === GlobalFilterService.excludePresetBaseItemsFilterName)
    filter.itemExclusionFilters.push({
      enabled: excludePresetBaseItemsFilter?.enabled ?? true,
      exclude: this.excludePresetBaseItem,
      name: GlobalFilterService.excludePresetBaseItemsFilterName
    })

    this.filter = filter
  }

  /**
   * Excludes an item without merchant.
   * @param item - Item.
   * @returns true when the item is excluded; otherwise false.
   */
  private excludeItemWithoutMerchant(item: IItem) {
    const isExcluded = item.prices.length === 0

    return isExcluded
  }

  /**
   * Excludes an item which is the base item of a preset.
   * @param item - Item.
   * @returns true when the item is excluded; otherwise false.
   */
  private excludePresetBaseItem(item: IItem) {
    const canBeModded = Services.get(ItemPropertiesService).canBeModded(item)
    const hasNoBaseItemId = (item as IModdable).baseItemId == null
    const hasDefaultPresetId = (item as IModdable).defaultPresetId != null

    return canBeModded && hasNoBaseItemId && hasDefaultPresetId
  }

  /**
   * Indicates whether a price matches the merchant filters.
   * @param merchantFilters - Merchant filters.
   * @param price - Price.
   * @returns true when price matches the filters; otherwise false.
   */
  private isPriceMatchingFilter(merchantFilters: IMerchantFilter[], price: IPrice): boolean {
    const result = merchantFilters.some(f =>
      f.enabled
      && f.merchant === price.merchant
      && f.merchantLevel >= price.merchantLevel)

    return result
  }

  /**
   * Saves the global filter.
   */
  private save() {
    const storageKey = this.getStorageKey()
    localStorage.setItem(storageKey, JSON.stringify(this.filter))

    this.emitter.emit(GlobalFilterService.changeEvent)
  }
}
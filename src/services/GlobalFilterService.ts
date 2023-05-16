import { IMerchantFilter } from '../models/utils/IMerchantFilter'
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
import { TinyEmitter } from 'tiny-emitter'
import Services from './repository/Services'
import { TarkovValuesService } from './TarkovValuesService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import { IGlobalFilter } from '../models/utils/IGlobalFilter'
import { ItemPropertiesService } from './ItemPropertiesService'
import { IModdable } from '../models/item/IModdable'
import { IItemExclusionFilter } from '../models/utils/IItemExclusionFilter'

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
  public static excludeItemsWithoutMerchantFilterName = 'itemsWithoutMerchant'

  /**
   * Name of the base preset items filter.
   */
  public static excludePresetBaseItemsFilterName = 'presetBaseItems'

  /**
   * Event emitter used to signal compatibility check requests.
   */
  public emitter = new TinyEmitter()

  /**
   * Gets merchant filters.
   * @returns Merchant filters.
   */
  public get(): IGlobalFilter {
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

    if (serializedFilters == null) {
      return {
        itemExclusionFilters: [],
        merchantFilters: []
      }
    }

    savedFilter = JSON.parse(serializedFilters) as IGlobalFilter

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

    return filter
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
    const filter = this.get()
    const result = item.prices.filter(p => this.isPriceMatchingFilter(filter.merchantFilters, p))

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
   * @param forceItemsWithoutMerchantInclusion - Indicates item without merchant are included or the exclusion filter is used.
   * @returns true when the item has prices that match the merchant filters; otherwise false.
   */
  public isMatchingFilter(item: IItem, forceItemsWithoutMerchantInclusion: boolean): boolean {
    const filter: IGlobalFilter = this.get()

    if (forceItemsWithoutMerchantInclusion) {
      const excludeItemsWithoutMerchantFilter = filter.itemExclusionFilters.find(f => f.name == GlobalFilterService.excludeItemsWithoutMerchantFilterName)

      /* istanbul ignore else */
      if (excludeItemsWithoutMerchantFilter != null) {
        // Should always be found
        excludeItemsWithoutMerchantFilter.enabled = false
      }
    }

    const isExcluded = filter.itemExclusionFilters.some(f => f.enabled && f.exclude(item))
    const hasMatchingPrice = item.prices.some(p => this.isPriceMatchingFilter(filter.merchantFilters, p))

    return !isExcluded
      && (hasMatchingPrice
        || item.prices.length == 0) // Items that have no price are marked as excluded when needed, so if they are not excluded we ignore the fact that they have no price matching
  }

  /**
   * Saves the global filter.
   */
  public save(gobalFilter: IGlobalFilter): void {
    const storageKey = this.getStorageKey()
    localStorage.setItem(storageKey, JSON.stringify(gobalFilter))

    this.emitter.emit(GlobalFilterService.changeEvent)
  }

  /**
   * Updates the item exclusion filters and saves the global filter.
   */
  public saveItemExclusionFilters(itemExclusionFilters: IItemExclusionFilter[]): void {
    const globalFilter = this.get()
    globalFilter.itemExclusionFilters = itemExclusionFilters

    this.save(globalFilter)
  }

  /**
   * Updates the merchant filters and saves the global filter.
   */
  public saveMerchantFilters(merchantFilters: IMerchantFilter[]): void {
    const globalFilter = this.get()
    globalFilter.merchantFilters = merchantFilters

    this.save(globalFilter)
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
}
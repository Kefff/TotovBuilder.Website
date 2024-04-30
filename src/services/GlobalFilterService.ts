import { TinyEmitter } from 'tiny-emitter'
import { IItem } from '../models/item/IItem'
import { IModdable } from '../models/item/IModdable'
import { IPrice } from '../models/item/IPrice'
import { IGlobalFilter } from '../models/utils/IGlobalFilter'
import { IItemExclusionFilter } from '../models/utils/IItemExclusionFilter'
import { IMerchantFilter } from '../models/utils/IMerchantFilter'
import { ItemPropertiesService } from './ItemPropertiesService'
import { ItemService } from './ItemService'
import { TarkovValuesService } from './TarkovValuesService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import Services from './repository/Services'

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
   * Event emitter used to signal filter changes.
   */
  public emitter = new TinyEmitter()

  /**
   * Indicates whether the global filter has been initialized.
   */
  private isInitialized = false

  /**
   * Current filter.
   */
  private filter: IGlobalFilter = {
    itemExclusionFilters: [],
    merchantFilters: []
  }

  /**
   * Gets merchant filters.
   * @returns Merchant filters.
   */
  public get(): IGlobalFilter {
    this.initialize()
    const filter = JSON.parse(JSON.stringify(this.filter)) // Creating a copy without reference so the filter can be changed in the UI without changing here until the user saveds it

    return filter
  }

  /**
   * Gets the the prices of an item that corresponds to the merchant filters.
   * @param item - Item.
   * @returns Price.
   */
  public getMatchingPrices(item: IItem): IPrice[] {
    this.initialize()
    const result = item.prices.filter(p => this.isPriceMatchingFilter(this.filter.merchantFilters, p))

    return result
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
   * @returns true when the item has prices that match the merchant filters; otherwise false.
   */
  public isMatchingFilter(item: IItem): boolean {
    this.initialize()
    const isExcluded = this.filter.itemExclusionFilters.some(ief => ief.enabled && this.exclude(ief.name, item))

    if (isExcluded) {
      return false
    }

    if (item.prices.length === 0) {
      // If items without prices should not be included, they would have been excluded in the precedent if.
      // Therefore, we can automatically include them here without checking the merchant filter
      return true
    }

    const hasMatchingPrice = item.prices.some(p => this.isPriceMatchingFilter(this.filter.merchantFilters, p))

    return hasMatchingPrice
  }

  /**
   * Saves the global filter.
   */
  public save(globalFilter: IGlobalFilter): void {
    this.initialize()
    this.filter = globalFilter
    this.saveGlobalFilter()
  }

  /**
   * Updates the item exclusion filters and saves the global filter.
   */
  public saveItemExclusionFilters(itemExclusionFilters: IItemExclusionFilter[]): void {
    this.initialize()
    this.filter.itemExclusionFilters = itemExclusionFilters
    this.saveGlobalFilter()
  }

  /**
   * Updates the merchant filters and saves the global filter.
   */
  public saveMerchantFilters(merchantFilters: IMerchantFilter[]): void {
    this.initialize()
    this.filter.merchantFilters = merchantFilters
    this.saveGlobalFilter()
  }

  /**
   * Executes an item exlusion filter.
   * @param itemExclusionFilterName - Item exclusion filter name.
   * @param item - Item for which the exclusion filter is executed.
   * @returns true when the item is excluded; otherwise false.
   */
  private exclude(itemExclusionFilterName: string, item: IItem): boolean {
    if (itemExclusionFilterName === GlobalFilterService.excludeItemsWithoutMerchantFilterName) {
      return this.excludeItemWithoutMerchant(item)
    } else if (itemExclusionFilterName === GlobalFilterService.excludePresetBaseItemsFilterName) {
      return this.excludePresetBaseItem(item)
    } /* c8 ignore start */ else {
      return false
    } /* c8 ignore stop */
  }

  /**
   * Excludes an item without merchant.
   * @param item - Item.
   * @returns true when the item is excluded; otherwise false.
   */
  private excludeItemWithoutMerchant(item: IItem) {
    const isExcluded = item.prices.length === 0 && Services.get(ItemService).hasPrices

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
   * Gets a storage key.
   * @returns Storage key.
   */
  private getStorageKey(): string {
    const key = Services.get(WebsiteConfigurationService).configuration.globalFilterStorageKey

    return key
  }

  /**
   * Reads the saved global filter and initializes the current filter with it.
   */
  private initialize(): void {
    if (this.isInitialized) {
      return
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
    const tarkovValuesService = Services.get(TarkovValuesService)

    for (const merchant of tarkovValuesService.values.merchants.filter(m => m.showInFilter)) {
      const savedMerchantFilter = savedFilter.merchantFilters.find(sf => sf.merchant === merchant.name)

      this.filter.merchantFilters.push({
        enabled: savedMerchantFilter?.enabled ?? true,
        merchantLevel: savedMerchantFilter?.merchantLevel ?? merchant.maxLevel,
        merchant: savedMerchantFilter?.merchant ?? merchant.name
      })
    }

    // Item filters
    const excludeItemsWithoutMerchantFilter = savedFilter.itemExclusionFilters.find(f => f.name === GlobalFilterService.excludeItemsWithoutMerchantFilterName)
    this.filter.itemExclusionFilters.push({
      enabled: excludeItemsWithoutMerchantFilter?.enabled ?? true,
      name: GlobalFilterService.excludeItemsWithoutMerchantFilterName
    })

    const excludePresetBaseItemsFilter = savedFilter.itemExclusionFilters.find(f => f.name === GlobalFilterService.excludePresetBaseItemsFilterName)
    this.filter.itemExclusionFilters.push({
      enabled: excludePresetBaseItemsFilter?.enabled ?? true,
      name: GlobalFilterService.excludePresetBaseItemsFilterName
    })

    this.isInitialized = true
  }

  /**
   * Indicates whether a price matches the merchant filters.
   * @param merchantFilters - Merchant filters.
   * @param price - Price.
   * @returns true when price matches the filters; otherwise false.
   */
  private isPriceMatchingFilter(merchantFilters: IMerchantFilter[], price: IPrice): boolean {
    const result = merchantFilters.some(mf =>
      mf.enabled
      && mf.merchant === price.merchant
      && mf.merchantLevel >= price.merchantLevel)

    return result
  }

  /**
   * Saves the current global filter.
   */
  private saveGlobalFilter(): void {
    const storageKey = this.getStorageKey()
    localStorage.setItem(storageKey, JSON.stringify(this.filter))

    this.emitter.emit(GlobalFilterService.changeEvent)
  }
}
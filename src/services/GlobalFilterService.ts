import { TinyEmitter } from 'tiny-emitter'
import { IItem } from '../models/item/IItem'
import { IModdable } from '../models/item/IModdable'
import { IPrice } from '../models/item/IPrice'
import { IGlobalFilter } from '../models/utils/IGlobalFilter'
import { IMerchantFilter } from '../models/utils/IMerchantFilter'
import { ItemPropertiesService } from './ItemPropertiesService'
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
    excludeItemsWithoutMatchingPrice: true,
    excludePresetBaseItems: true,
    merchantFilters: []
  }

  /**
   * Gets the gloval filter.
   * @returns Global.
   */
  public get(): IGlobalFilter {
    this.initialize()
    const filter = {
      ...this.filter // Creating a copy without reference so the filter can be changed in the UI without changing here until the user saveds it
    }

    return filter
  }

  /**
   * Gets the the prices of an item that corresponds to the merchant filters.
   * Returned prices are as follows :
   * - the standard matching price with the lowest value in main currency
   * - all matching barters because we do not know at this stage their value in main currency
   * - arbritrarily, first price with a currency that has no value only when there are no matching standard prices nor barters
   * @param item - Item.
   * @returns Price.
   */
  public getMatchingPrices(item: IItem): IPrice[] {
    this.initialize()
    const matchingPrices = item.prices.filter(p => this.isPriceMatchingFilter(this.filter.merchantFilters, p))

    let standardPriceWithLowestValueInMainCurrency: IPrice | undefined = undefined
    const barters: IPrice[] = []
    let firstPriceWithCurrencyWithNoValueWithLowestValue: IPrice | undefined = undefined

    for (const matchingPrice of matchingPrices) {
      if (matchingPrice.currencyName === 'barter') {
        barters.push(matchingPrice)
      } else if (matchingPrice.valueInMainCurrency === 0) {
        // If there are multiple prices with different currencies without a value, we arbitriraly take into account the first currency found
        // and try to find the price with this currency and the lowest value
        if (firstPriceWithCurrencyWithNoValueWithLowestValue == null
          || (firstPriceWithCurrencyWithNoValueWithLowestValue.currencyName === matchingPrice.currencyName
            && matchingPrice.value < firstPriceWithCurrencyWithNoValueWithLowestValue.value)) {
          firstPriceWithCurrencyWithNoValueWithLowestValue = matchingPrice
        }
      } else if (standardPriceWithLowestValueInMainCurrency == null
        || matchingPrice.valueInMainCurrency < standardPriceWithLowestValueInMainCurrency.valueInMainCurrency) {
        standardPriceWithLowestValueInMainCurrency = matchingPrice
      }
    }

    if (standardPriceWithLowestValueInMainCurrency != null) {
      return [standardPriceWithLowestValueInMainCurrency, ...barters]
    } else if (barters.length > 0) {
      return barters
    }

    return firstPriceWithCurrencyWithNoValueWithLowestValue != null
      ? [firstPriceWithCurrencyWithNoValueWithLowestValue]
      : []
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
   * @returns `true` if the merchant has levels ; otherwise `false`.
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
   * @returns `true` when the item has prices that match the merchant filters; otherwise `false`.
   */
  public isMatchingFilter(item: IItem): boolean {
    this.initialize()

    if (this.filter.excludePresetBaseItems) {
      const isExcluded = this.excludePresetBaseItem(item)

      if (isExcluded) {
        return false
      }
    }

    if (this.filter.excludeItemsWithoutMatchingPrice) {
      const hasMatchingPrice = item.prices.some(p => this.isPriceMatchingFilter(this.filter.merchantFilters, p))

      return hasMatchingPrice
    }

    return true
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
   * Excludes an item which is the base item of a preset.
   * @param item - Item.
   * @returns `true` when the item is excluded; otherwise `false`.
   */
  private excludePresetBaseItem(item: IItem): boolean {
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
      excludeItemsWithoutMatchingPrice: true,
      excludePresetBaseItems: true,
      merchantFilters: []
    }

    const storageKey = this.getStorageKey()
    const serializedFilters = localStorage.getItem(storageKey)

    if (serializedFilters != null) {
      savedFilter = JSON.parse(serializedFilters)
    }

    // Initializing merchant filters
    const tarkovValuesService = Services.get(TarkovValuesService)
    const merchants = tarkovValuesService.values.merchants.filter(m => m.showInFilter).sort((m1, m2) => m1.order - m2.order)
    const orderedMerchantFilters: IMerchantFilter[] = []

    for (const merchant of merchants) {
      let merchantFilter = savedFilter.merchantFilters.find(sf => sf.merchant === merchant.name)

      if (merchantFilter == null) {
        merchantFilter = {
          enabled: true,
          merchantLevel: merchant.maxLevel,
          merchant: merchant.name
        }
      }

      orderedMerchantFilters.push(merchantFilter)
    }

    savedFilter.merchantFilters = orderedMerchantFilters
    this.filter = savedFilter

    this.isInitialized = true
  }

  /**
   * Indicates whether a price matches the merchant filters.
   * @param merchantFilters - Merchant filters.
   * @param price - Price.
   * @returns `true` when price matches the filters; otherwise `false`.
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
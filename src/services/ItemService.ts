import { IItem } from '../models/item/IItem'
import Result, { FailureType } from '../utils/Result'
import i18n from '../plugins/vueI18n'
import Services from './repository/Services'
import { ICurrency } from '../models/configuration/ICurrency'
import { NotificationService, NotificationType } from './NotificationService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import { TarkovValuesService } from './TarkovValuesService'
import { ItemFetcherService } from './ItemFetcherService'
import { IPrice } from '../models/item/IPrice'
import { GlobalFilterService } from './GlobalFilterService'
import { PresetService } from './PresetService'
import { ServiceInitializationState } from './repository/ServiceInitializationState'
import { TinyEmitter } from 'tiny-emitter'

/**
 * Represents a service responsible for managing items.
 */
export class ItemService {
  /**
   * Name of the event fired when items have finised loading.
   */
  public static initializationFinishedEvent = 'itemServiceInitialized'

  /**
   * Event emitter used to initialization state change.
   */
  public emitter = new TinyEmitter()

  /**
   * Indicates whether prices have successfully been fetched once.
   */
  public hasPrices = false

  /**
   * Initialization state of the service.
   */
  public get initializationState(): ServiceInitializationState {
    return this._initializationState
  }
  private _initializationState = ServiceInitializationState.initializing

  /**
   * Indicates whether data that is fetched only once and never expire has been cached or not.
   */
  private hasStaticDataCached = false

  /**
   * Fetched item categories.
   */
  private itemCategories: string[] = []

  /**
   * Fetched items.
   */
  private items: IItem[] = []

  /**
   * List of items filtered using the current global filter.
   */
  private filteredItems: IItem[] = []

  /**
   * Determines whether prices are being fetched or not.
   */
  private isFetchingPrices = false

  /**
   * Determines whether static data is being fetched or not.
   */
  private isFetchingStaticData = false

  /**
   * Date of the last time prices were fetched.
   */
  private lastPricesFetchDate: Date | undefined

  /**
   * Current prices fetching task.
   */
  private pricesFetchingPromise: Promise<void> = Promise.resolve()

  /**
   * Current static data fetching task.
   */
  private staticDataFetchingPromise: Promise<boolean> = Promise.resolve(false)

  /**
   * Initializes a new instance of the ItemService class.
   */
  constructor() {
    Services.get(GlobalFilterService).emitter.on(GlobalFilterService.changeEvent, () => this.updateFilteredItems())
  }

  /**
   * Gets currency.
   * @param name - Name of the currency.
   * @returns Currency.
   */
  public async getCurrency(name: string): Promise<Result<ICurrency>> {
    const currency = Services.get(TarkovValuesService).values.currencies.find(c => c.name === name)

    if (currency == null) {
      return Result.fail(FailureType.error, 'ItemService.getCurrency()', i18n.t('message.currencyNotFound', { currency: name }))
    }

    return Result.ok(currency)
  }

  /**
   * Gets an item. Updates the prices if the cache has expired.
   * @param id - Item ID.
   * @param useGlobalFilter - Indicates whether the global filter must be applied. False by default.
   * @returns Item.
   */
  public async getItem(id: string, useGlobalFilter = false): Promise<Result<IItem>> {
    const itemsResult = await this.getItems([id], useGlobalFilter)

    if (!itemsResult.success || itemsResult.value.length === 0) {
      return Result.fail(
        FailureType.error,
        'ItemService.getItem()',
        i18n.t('message.itemNotFound', { id })
      )
    }

    return Result.ok(itemsResult.value[0])
  }

  /**
   * Gets item categories.
   * @returns Item categories.
   */
  public async getItemCategories(): Promise<string[]> {
    await this.initialize()

    return this.itemCategories
  }

  /**
   * Gets items. Updates the prices if the cache has expired.
   * @param ids - Item IDs.
   * @param useGlobalFilter - Indicates whether the global filter must be applied. False by default.
   * @returns Items.
   */
  public async getItems(ids: string[], useGlobalFilter = false): Promise<Result<IItem[]>> {
    await this.initialize()

    let items: IItem[] = []

    if (useGlobalFilter) {
      items = this.findItems(ids, this.filteredItems)
    } else {
      items = this.findItems(ids, this.items)
    }

    if (items.length < ids.length && !useGlobalFilter) {
      const notFoundItemIds = ids.filter(id => !items.some(i => i.id === id))
      return Result.fail(
        FailureType.error,
        'ItemService.getItems()',
        i18n.t('message.itemsNotFound', { ids: `${notFoundItemIds.join('", "')}` })
      )
    }

    return Result.ok(items)
  }

  /**
   * Gets items of a specified category. Updates the prices if its cache has expired.
   * @param categoryIds - Category IDs.
   * @param useGlobalFilter - Indicates whether the global filter must be applied. False by default.
   */
  public async getItemsOfCategories(categoryIds: string[], useGlobalFilter = false): Promise<Result<IItem[]>> {
    await this.initialize()

    let items: IItem[]

    if (useGlobalFilter) {
      items = this.filteredItems.filter(i => categoryIds.some(id => id === i.categoryId))
    } else {
      items = this.items.filter(i => categoryIds.some(id => id === i.categoryId))
    }

    if (items.length === 0 && !useGlobalFilter) {
      return Result.fail(
        FailureType.error,
        'ItemService.getItemsOfCategories',
        i18n.t('message.itemsOfCategoriesNotFound', { ids: `${categoryIds.join('", "')}` }))
    }

    return Result.ok(items)
  }

  /**
   * Gets the main currency.
   * @returns Main currency.
   */
  public async getMainCurrency(): Promise<Result<ICurrency>> {
    const currency = Services.get(TarkovValuesService).values.currencies.find(c => c.mainCurrency)

    if (currency == null) {
      return Result.fail(FailureType.error, 'ItemService.getMainCurrency()', i18n.t('message.mainCurrencyNotFound'))
    }

    return Result.ok(currency)
  }

  /**
   * Initializes the data used by the service.
   */
  public async initialize(): Promise<void> {
    if (Services.get(WebsiteConfigurationService).initializationState === ServiceInitializationState.error) {
      this._initializationState = ServiceInitializationState.error

      return
    }

    if (!this.hasStaticDataCached) {
      if (!this.hasStaticDataCached) {
        const staticDataFetched = await this.fetchStaticData()

        if (staticDataFetched) {
          this._initializationState = ServiceInitializationState.initialized
        } else {
          this._initializationState = ServiceInitializationState.error
        }

        this.emitter.emit(ItemService.initializationFinishedEvent, this._initializationState)
      }
    }

    if (!this.hasValidCache()) {
      await this.fetchPrices()
    }
  }

  /**
   * Fetches item categories.
   */
  private async fetchItemCategories() {
    const itemCategoriesResult = await Services.get(ItemFetcherService).fetchItemCategories()

    if (!itemCategoriesResult.success) {
      return Result.failFrom(itemCategoriesResult)
    }

    this.itemCategories = itemCategoriesResult.value

    return Result.ok()
  }

  /**
   * Fetches items.
   * @param itemFetcherService - Item fetcher service.
   */
  private async fetchItems(): Promise<Result<void>> {
    const itemsResult = await Services.get(ItemFetcherService).fetchItems()

    if (!itemsResult.success) {
      return Result.failFrom(itemsResult)
    }

    this.items = itemsResult.value

    return Result.ok()
  }

  /**
   * Fetches prices.
   * If prices are already being fetched, waits for the operation to end before returning.
   * This should in theory never happen since fetchPrices() is only called in initialize() which executes nothing when another initialization is already being performed.
   */
  private async fetchPrices() {
    if (!this.isFetchingPrices) {
      this.pricesFetchingPromise = this.startPricesFetching()
    }

    await this.pricesFetchingPromise
  }

  /**
   *  Fetches static data.
   * If static data is already being fetched, waits for the operation to end before returning.
   * This should in theory never happen since fetchStaticData() is only called in initialize() which executes nothing when another initialization is already being performed.
   * @returns true when all static data has been fetched; otherwise false.
   */
  private async fetchStaticData(): Promise<boolean> {
    if (!this.isFetchingStaticData) {
      this.staticDataFetchingPromise = this.startStaticDataFetching()
    }

    const staticDataFetched = await this.staticDataFetchingPromise

    return staticDataFetched
  }

  /**
   * Finds items in a list of items.
   * @param ids - Ids of the items to find.
   * @param items - List of items in which the items must be found.
   * @returns Found items.
   */
  private findItems(ids: string[], items: IItem[]) {
    const foundItems: IItem[] = []

    for (const id of ids) {
      for (const item of items) {
        if (item.id === id) {
          foundItems.push(item)
          continue
        }
      }
    }

    return foundItems
  }

  /**
   * Determines whether the cache of an item is still valid or not.
   * @returns `true` if the cache of the item has not expired yet; otherwise `false`.
   */
  private hasValidCache(): boolean {
    const lastPricesFetchDate = this.lastPricesFetchDate ?? new Date(1)
    const duration = (new Date().getTime() - lastPricesFetchDate.getTime()) / 1000 // In seconds
    const cacheDuration = Services.get(WebsiteConfigurationService).configuration.cacheDuration

    return duration <= cacheDuration
  }

  /**
   * Starts prices fetching.
   */
  private async startPricesFetching(): Promise<void> {
    this.isFetchingPrices = true
    const itemFetcherService = Services.get(ItemFetcherService)

    const pricesResult = await itemFetcherService.fetchPrices()
    this.updateItemsPrices(pricesResult)
    this.updateFilteredItems() // Items and prices needed to filter

    this.isFetchingPrices = false
  }

  /**
   * Starts static data fetching.
   * @returns true when fetching has succeeded, otherwise false.
   */
  private async startStaticDataFetching(): Promise<boolean> {
    const presetsService = Services.get(PresetService)

    this.isFetchingStaticData = true

    const itemCategoriesFetchResult = await this.fetchItemCategories()

    if (!itemCategoriesFetchResult.success) {
      return false
    }

    const results: Result<void>[] = []
    await Promise.allSettled([
      this.fetchItems().then(r => results.push(r)),
      presetsService.fetchPresets().then(r => results.push(r))
    ])

    this.hasStaticDataCached = true

    const allFetched = results.every(r => r.success)

    if (allFetched) {
      await presetsService.updatePresetProperties(this.items)
    }

    this.isFetchingStaticData = false

    return allFetched
  }

  /**
   * Updates the value of the currencies.
   */
  private updateCurrencyValues() {
    const tarkovValuesService = Services.get(TarkovValuesService)

    for (const currency of tarkovValuesService.values.currencies) {
      if (currency.mainCurrency) {
        currency.value = 1
      } else {
        const currencyItem = this.items.find(i => i.id === currency.itemId)

        if (currencyItem != null && currencyItem.prices.length > 0) {
          currency.value = currencyItem.prices[0].value
        } else {
          // When the price of a currency is not found, we set its price to 0. It can happen when merchants stops selling the currencies.
          currency.value = 0
        }
      }
    }
  }

  /**
   * Updates the filtered items by applying the global filter to the items.
   */
  private updateFilteredItems() {
    this.filteredItems = this.items.filter(i => Services.get(GlobalFilterService).isMatchingFilter(i))
  }

  /**
   * Updates items prices.
   * @param pricesResult - Prices fetching result.
   */
  private updateItemsPrices(pricesResult: Result<IPrice[]>) {
    if (!pricesResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, i18n.t('message.pricesLoadingError'), true)

      // When an error occurs, we set the last fetch date in order to make the cache expire 20 seconds later.
      // This is to avoid making a new API request for each of the 2000+ items.
      const websiteConfigurationService = Services.get(WebsiteConfigurationService)

      this.lastPricesFetchDate = new Date()
      this.lastPricesFetchDate = new Date(
        this.lastPricesFetchDate.getTime()
        + (websiteConfigurationService.configuration.cacheDuration - (2 * websiteConfigurationService.configuration.fetchTimeout)) * 1000)

      return
    }

    for (const item of this.items) {
      const prices = pricesResult.value.filter(p => p.itemId === item.id)

      if (prices.length > 0) {
        item.prices = prices
      }
    }

    this.updateCurrencyValues()
    this.updatePricesInMainCurrency()

    this.lastPricesFetchDate = new Date()
    this.hasPrices = true
  }

  /**
   * Updates item prices in main currency.
   */
  private updatePricesInMainCurrency() {
    const tarkovValuesService = Services.get(TarkovValuesService)

    for (const item of this.items) {
      for (const price of item.prices.filter(p => p.currencyName !== 'barter')) {
        const currency = tarkovValuesService.values.currencies.find(c => c.name === price.currencyName)

        if (currency != null) {
          price.valueInMainCurrency = price.value * currency.value
        } else {
          price.valueInMainCurrency = 0
        }
      }
    }
  }
}

import { TinyEmitter } from 'tiny-emitter'
import Images from '../images'
import { ICurrency } from '../models/configuration/ICurrency'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
import vueI18n from '../plugins/vueI18n'
import { GlobalFilterService } from './GlobalFilterService'
import { ItemFetcherService } from './ItemFetcherService'
import { LogService } from './LogService'
import { NotificationService, NotificationType } from './NotificationService'
import { PresetService } from './PresetService'
import { TarkovValuesService } from './TarkovValuesService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import { ServiceInitializationState } from './repository/ServiceInitializationState'
import Services from './repository/Services'

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
   * Fetched items.
   */
  private get items(): IItem[] {
    if (this._items == null) {
      // This should never happen, data should have been loaded or a error message should have been displayed
      throw new Error(vueI18n.t('message.itemsNotFetched'))
    }

    return this._items
  }
  private _items: IItem[] | undefined

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
   * Gets all items.
   */
  public async getAll(): Promise<IItem[]> {
    await this.initialize()

    return this.items
  }

  /**
   * Gets currency.
   * @param name - Name of the currency.
   * @returns Currency.
   * @throws When the currency is not found.
   */
  public getCurrency(name: string): ICurrency {
    const currency = Services.get(TarkovValuesService).values.currencies.find(c => c.name === name)

    if (currency == null) {
      throw new Error(vueI18n.t('message.currencyNotFound', { currency: name }))
    }

    return currency
  }

  /**
   * Gets an item. Updates the prices if the cache has expired.
   * @param id - Item ID.
   * @returns Item.
   * @throws When the item is not found.
   */
  public async getItem(id: string): Promise<IItem> {
    const items = await this.getItems([id], false)

    return items[0]
  }

  /**
   * Gets items. Updates the prices if the cache has expired.
   * @param ids - Item IDs.
   * @param useGlobalFilter - Indicates whether the global filter must be applied. False by default.
   * @returns Items.
   * @throws When no item is found while the global filter is not used.
   */
  public async getItems(ids: string[], useGlobalFilter: boolean): Promise<IItem[]> {
    await this.initialize()

    let items: IItem[] = []

    if (useGlobalFilter) {
      items = this.findItems(ids, this.filteredItems)
    } else {
      items = this.findItems(ids, this.items)
    }

    if (items.length < ids.length && !useGlobalFilter) {
      const notFoundItemIds = ids.filter(id => !items.some(i => i.id === id))
      const notFoundItems = notFoundItemIds.map(id => ItemService.getNotFoundItem(id))

      // Returning unknown items when the requested items are not found
      items.push(...notFoundItems)

      Services.get(LogService).logError('message.itemsNotFound', { ids: `${notFoundItemIds.join('", "')}` })
    }

    return items
  }

  /**
   * Gets items of a specified category. Updates the prices if its cache has expired.
   * @param categoryIds - Category IDs.
   * @param useGlobalFilter - Indicates whether the global filter must be applied. False by default.
   * @returns Items belonging to the categories.
   * @throws When no item is found while the global filter is not used.
   */
  public async getItemsOfCategories(categoryIds: ItemCategoryId[], useGlobalFilter = false): Promise<IItem[]> {
    await this.initialize()

    let items: IItem[]

    if (useGlobalFilter) {
      items = this.filteredItems.filter(i => categoryIds.some(id => id === i.categoryId))
    } else {
      items = this.items.filter(i => categoryIds.some(id => id === i.categoryId))
    }

    if (items.length === 0 && !useGlobalFilter) {
      Services.get(LogService).logError('message.itemsOfCategoriesNotFound', { ids: `${categoryIds.join('", "')}` })
    }

    return items
  }

  /**
   * Gets the main currency.
   * @returns Main currency.
   * @throws When the main currency is not found.
   */
  public getMainCurrency(): ICurrency {
    const mainCurrency = Services.get(TarkovValuesService).values.currencies.find(c => c.mainCurrency)

    if (mainCurrency == null) {
      throw new Error(vueI18n.t('message.mainCurrencyNotFound'))
    }

    return mainCurrency
  }

  /**
   * Gets the item returned when getting an item that is not found in the items list.
   * @param id - ID of the item that is not found.
   * @returns Not found item.
   */
  public static getNotFoundItem(id: string): IItem {
    return {
      categoryId: ItemCategoryId.notFound,
      conflictingItemIds: [],
      iconLink: Images.unknownItem,
      id,
      imageLink: '',
      marketLink: '',
      maxStackableAmount: 1,
      name: vueI18n.t('caption.notFoundItem', { id }),
      prices: [],
      shortName: '',
      weight: 0,
      wikiLink: ''
    }
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
      const staticDataFetched = await this.fetchStaticData()

      if (staticDataFetched) {
        this._initializationState = ServiceInitializationState.initialized
      } else {
        this._initializationState = ServiceInitializationState.error
      }

      this.emitter.emit(ItemService.initializationFinishedEvent, this._initializationState)
    }

    if (!this.hasValidCache() && this._initializationState !== ServiceInitializationState.error) {
      await this.fetchPrices()
    }
  }

  /**
   * Fetches items.
   * @returns true when items have correctly been fetched; otherwise false.
   */
  private async fetchItems(): Promise<boolean> {
    const items = await Services.get(ItemFetcherService).fetchItems()

    if (items == undefined) {
      return false
    }

    this._items = items

    return true
  }

  /**
   * Fetches prices.
   * If prices are already being fetched, waits for the operation to end before returning.
   * This should in theory never happen since fetchPrices() is only called in initialize() which executes nothing when another initialization is already being performed.
   */
  private async fetchPrices(): Promise<void> {
    if (!this.isFetchingPrices) {
      this.pricesFetchingPromise = this.startPricesFetching()
    }

    await this.pricesFetchingPromise
  }

  /**
   * Fetches static data.
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
  private findItems(ids: string[], items: IItem[]): IItem[] {
    const foundItems: IItem[] = []

    for (const id of ids) {
      const foundItem = items.find(i => i.id === id)

      if (foundItem != null) {
        foundItems.push(foundItem)
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

    const prices = await Services.get(ItemFetcherService).fetchPrices()

    if (prices == undefined) {
      Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.pricesLoadingError'))

      // When an error occurs, we set the last fetch date in order to make the cache expire 20 seconds later.
      // This is to avoid making a new request for each of the 3000+ items.
      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      this.lastPricesFetchDate = new Date(
        new Date().getTime()
        + (websiteConfigurationService.configuration.cacheDuration - (2 * websiteConfigurationService.configuration.fetchTimeout)) * 1000)
    } else {
      this.updateItemsPrices(prices)
      this.updateFilteredItems() // Items and prices needed to filter
    }

    this.isFetchingPrices = false
  }

  /**
   * Starts static data fetching.
   * @returns true when fetching has succeeded, otherwise false.
   */
  private async startStaticDataFetching(): Promise<boolean> {
    const presetsService = Services.get(PresetService)

    this.isFetchingStaticData = true

    const fetchResults: boolean[] = []
    await Promise.allSettled([
      this.fetchItems().then(r => fetchResults.push(r)),
      presetsService.fetchPresets().then(r => fetchResults.push(r))
    ])

    this.hasStaticDataCached = true

    const allFetched = fetchResults.every(r => r)

    if (allFetched) {
      await presetsService.updatePresetProperties(this.items)
    }

    this.isFetchingStaticData = false

    return allFetched
  }

  /**
   * Updates the value of the currencies.
   */
  private updateCurrencyValues(): void {
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
  private updateFilteredItems(): void {
    this.filteredItems = this.items.filter(i => Services.get(GlobalFilterService).isMatchingFilter(i))
  }

  /**
   * Updates items prices.
   * @param prices - Fetched prices.
   */
  private updateItemsPrices(prices: IPrice[]): void {
    for (const item of this.items) {
      const itemPrices = prices.filter(p => p.itemId === item.id)

      if (itemPrices.length > 0) {
        item.prices = itemPrices
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
  private updatePricesInMainCurrency(): void {
    for (const item of this.items) {
      for (const price of item.prices.filter(p => p.currencyName !== 'barter')) {
        const currency = this.getCurrency(price.currencyName)
        price.valueInMainCurrency = price.value * currency.value
      }
    }
  }
}

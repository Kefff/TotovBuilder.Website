import { IItem } from '../models/item/IItem'
import Result, { FailureType } from '../utils/Result'
import i18n from '../plugins/vueI18n'
import Services from './repository/Services'
import { IItemFetcherService } from './fetchers/IItemFetcherService'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItemCategory } from '../models/item/IItemCategory'
import { ItemCategoryUtils } from '../utils/ItemCategoryUtils'
import { ICurrency } from '../models/item/ICurrency'
import Currencies from '../assets/data/currencies.json'
import { NotificationService, NotificationType } from './NotificationService'
import Configuration from '../../test-data/configuration.json'

/**
 * Represents a service responsible for managing items.
 */
export class ItemService {
  /**
   * Fetched currencies.
   */
  private currencies: ICurrency[] = []

  /**
   * Indicates whether data that never expire has been cached or not.
   */
  private hasStaticDataCached = false

  /**
   * Fetched item categories.
   */
  private itemCategories: IItemCategory[] = []

  /**
   * Fetched items.
   */
  private items: IItem[] = []

  /**
   * Determines whether market data is being fetched or not.
   */
  private isFetchingMarketData = false

  /**
   * Determines whether data is being fetched or not.
   */
  private isFetchingStaticData = false

  /**
   * Date of the last time data market data was fetched.
   */
  private lastMarketDataFetchDate: Date = new Date(1)

  /**
   * Fetched market data.
   */
  private marketData: Record<string, unknown>[] = []

  /**
   * Current market data fetching task.
   */
  private marketDataFetchingPromise: Promise<void> = Promise.resolve()

  /**
   * Fetched presets.
   */
  private presets: IInventoryItem[] = []

  /**
   * Current static data fetching task.
   */
  private staticDataFetchingPromise: Promise<void> = Promise.resolve()

  /**
   * Initializes a new instance of the ItemService class.
   */
  public constructor() {
    this.initialize()
  }

  /**
   * Gets currency.
   * @param name - Name of the currency.
   * @returns Currency.
   */
  public async getCurrency(name: string): Promise<Result<ICurrency>> {
    await this.initialize()
    const currency = this.currencies.find(c => c.name === name)

    if (currency === undefined) {
      return Result.fail(FailureType.error, 'ItemService.getCurrency()', i18n.t('message.currencyNotFound', { currency: name }))
    }

    return Result.ok(currency)
  }

  /**
   * Gets item categories.
   * @returns Item categories.
   */
  public async getItemCategories(): Promise<IItemCategory[]> {
    await this.initialize()

    return this.itemCategories
  }

  /**
   * Gets an item. Updates the market data if its cache has expired.
   * @param id - Item ID.
   * @returns Item or undefined if the item was not found.
   */
  public async getItem(id: string): Promise<Result<IItem>> {
    await this.initialize()

    const item = this.items.find(i => i.id === id)

    if (item === undefined) {
      return Result.fail(
        FailureType.error,
        'ItemService.getItem()',
        i18n.t('message.itemNotFound', { id })
      )
    }

    return Result.ok(item)
  }

  /**
   * Gets items of a specified category. Updates the market data if its cache has expired.
   * @param id - ID of the category of the items.
   * @returns Items
   */
  public async getItemsOfCategory(id: string): Promise<Result<IItem[]>> {
    await this.initialize()

    const items = this.items.filter(i => i.categoryId === id)

    if (items.length === 0) {
      return Result.fail(FailureType.error, 'ItemService.getByCategory', i18n.t('message.itemsOfCategoryNotFound', { id }))
    }

    return Result.ok(items)
  }

  /**
   * Gets the main currency.
   * @returns Main currency.
   */
  public async getMainCurrency(): Promise<Result<ICurrency>> {
    await this.initialize()
    const currency = this.currencies.find(c => c.mainCurrency)

    if (currency === undefined) {
      return Result.fail(FailureType.error, 'ItemService.getMainCurrency()', i18n.t('message.mainCurrencyNotFound'))
    }

    return Result.ok(currency)
  }

  /**
   * Gets the preset of an item.
   * @param id - ID of the item for which the preset must be found.
   * @returns Preset.
   */
  public async getPreset(id: string): Promise<IInventoryItem | undefined> {
    await this.initialize()

    const preset = this.presets.find(p => p.itemId === id) as IInventoryItem

    return preset
  }

  /**
   * Fetchs currencies.
   * @param itemFetcherService - Item fetcher service.
   */
  private async fetchCurrencies() {
    const currencies: ICurrency[] = []

    for (const currency of Currencies) {
      currencies.push({
        iconName: currency.iconName,
        mainCurrency: currency.mainCurrency,
        name: currency.name,
        itemId: currency.itemId,
        value: 0
      })
    }

    this.currencies = currencies
  }

  /**
   * Fetchs item categories.
   * @param itemFetcherService - Item fetcher service.
   */
  private async fetchItemCategories(itemFetcherService: IItemFetcherService) {
    const itemCategoriesResult = await itemFetcherService.fetchItemCategories()

    if (!itemCategoriesResult.success) {
      throw new Error()
    }

    this.itemCategories = itemCategoriesResult.value
  }


  /**
   * Fetchs items.
   * @param itemFetcherService - Item fetcher service.
   */
  private async fetchItems(itemFetcherService: IItemFetcherService) {
    const itemsResult = await itemFetcherService.fetchItems()

    if (!itemsResult.success) {
      throw new Error()
    }

    this.items = await this.getItemsFromTarkovItems(itemsResult.value)
  }

  /**
     * Fetches market data.
     * If market data is already being fetched, waits for the operation to end before returnin.
     */
  private async fetchMarketData() {
    if (this.isFetchingMarketData) {
      await this.marketDataFetchingPromise

      return
    }

    this.marketDataFetchingPromise = new Promise((resolve) => {
      this.isFetchingMarketData = true
      const itemFetcherService = Services.getByName<IItemFetcherService>('ItemFetcherService')

      itemFetcherService.fetchMarketData()
        .then(async (marketDataResult) => this.updateItemsMarketData(marketDataResult))
        .finally(() => {
          this.isFetchingMarketData = false
          resolve()
        })
    })
    await this.marketDataFetchingPromise
  }

  /**
   * Fetchs presets.
   * @param itemFetcherService - Item fetcher service.
   */
  private async fetchPresets(itemFetcherService: IItemFetcherService) {
    const presetsResult = await itemFetcherService.fetchPresets()

    if (!presetsResult.success) {
      throw new Error()
    }

    this.presets = presetsResult.value
  }

  /**
   * Fetches static data.
   * If static data is already being fetched, waits for the operation to end before returnin.
   */
  private async fetchStaticData(): Promise<void> {
    if (this.isFetchingStaticData) {
      await this.staticDataFetchingPromise

      return
    }

    this.staticDataFetchingPromise = new Promise<void>((resolve) => {
      this.isFetchingStaticData = true
      const itemFetcherService = Services.getByName<IItemFetcherService>('ItemFetcherService')

      this.fetchItemCategories(itemFetcherService)
        .then(async () => {
          await Promise.allSettled([
            this.fetchItems(itemFetcherService),
            this.fetchPresets(itemFetcherService),
            this.fetchCurrencies()
          ])
          this.hasStaticDataCached = true
        })
        .catch(() => {
          this.currencies = []
          this.itemCategories = []
          this.items = []
          this.presets = []

          this.hasStaticDataCached = false
        })
        .finally(() => {
          this.isFetchingStaticData = false
          resolve()
        })
    })
    await this.staticDataFetchingPromise
  }

  /**
   * Gets items from Tarkov items.
   * @param tarkovItems - Tarkov items.
   * @returns Items.
   */
  private async getItemsFromTarkovItems(tarkovItems: Record<string, unknown>[]): Promise<IItem[]> {
    const items: IItem[] = []

    for (const tarkovItem of tarkovItems) {
      const categoryId = this.getItemCategoryIdFromTarkovItem(tarkovItem)
      const readerService = ItemCategoryUtils.getReaderServiceForCategory(categoryId)

      const item = await readerService.read(tarkovItem, categoryId)
      items.push(item)
    }

    return items
  }

  /**
   * Gets an item category ID from its Tarkov item.
   * @param tarkovItem - Tarkov item.
   * @returns Item category ID.
   */
  private getItemCategoryIdFromTarkovItem(tarkovItem: Record<string, unknown>): string {
    const type = tarkovItem['_parent'] as string
    const category = this.itemCategories.find(c => c.types.some(t => t.id === type)) as IItemCategory

    /* istanbul ignore next */
    if (category === undefined) {
      Services.get(NotificationService).notify(NotificationType.error, i18n.t('message.itemCategoryNotFoundForType', { type }))
    }

    /* istanbul ignore next */
    return category?.id ?? ''
  }

  /**
   * Determines whether the cache of an item is still valid or not.
   * @param item - Item.
   * @returns `true` if the cache of the item has not expired yet; otherwise `false`.
   */
  private hasValidCache(): boolean {
    const duration = (new Date().getTime() - this.lastMarketDataFetchDate.getTime()) / 1000 // In seconds
    const maxCacheDuration = Number(Configuration.VITE_CACHE_DURATION)

    return duration <= maxCacheDuration
  }

  /**
   * Initializes the data used by the service
   */
  private async initialize() {
    if (!this.hasStaticDataCached) {
      await this.fetchStaticData()
    }

    if (!this.hasValidCache()) {
      await this.fetchMarketData()
    }
  }

  /**
   * Updates the value of the currencies.
   */
  private async updateCurrencyValues() {
    for (const currency of this.currencies) {
      if (currency.itemId === undefined) {
        currency.value = 1
      } else {
        const currencyItem = this.items.find(i => i.id === currency.itemId)

        if (currencyItem !== undefined) {
          /* istanbul ignore next */
          currency.value = currencyItem.prices[0].value ?? 0
        }
      }
    }
  }

  /**
   * Updates items market data.
   * @param marketDataResult - Market data fetching result.
   */
  private async updateItemsMarketData(marketDataResult: Result<Record<string, unknown>[]>) {
    if (!marketDataResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, i18n.t('message.cannotFetchPrices'), true)

      this.marketData = []

      // When an error occurs, we set the last fetch date in order to make the cache expire 20 seconds later.
      // This is to avoid making a new API request for each of the 2000+ items.
      const maxCacheDuration = Number(Configuration.VITE_CACHE_DURATION)
      const fetchTimeout = Number(Configuration.VITE_FETCH_TIMEOUT)
      this.lastMarketDataFetchDate = new Date()
      this.lastMarketDataFetchDate = new Date(this.lastMarketDataFetchDate.getTime() + (maxCacheDuration - (2 * fetchTimeout)) * 1000)

      return
    }

    this.marketData = marketDataResult.value

    for (const item of this.items) {
      const itemMarketData = this.marketData.find(md => md['id'] === item.id)

      if (itemMarketData !== undefined) {
        const readerService = ItemCategoryUtils.getReaderServiceForCategory(item.categoryId)
        await readerService.readMarketData(itemMarketData, item)
      }
    }

    await this.updateCurrencyValues()
    await this.updatePricesInMainCurrency()

    this.lastMarketDataFetchDate = new Date()
  }

  /**
   * Updates item prices in main currency.
   */
  private async updatePricesInMainCurrency() {
    for (const item of this.items) {
      for (const price of item.prices) {
        const currency = this.currencies.find(c => c.name === price.currencyName)

        /* istanbul ignore else */
        if (currency !== undefined) {
          price.valueInMainCurrency = price.value * currency.value
        } else {
          Services.get(NotificationService).notify(NotificationType.error, i18n.t('message.currencyNotFound', { currency: price.currencyName }))
        }
      }
    }
  }
}

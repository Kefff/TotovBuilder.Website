import { IItem } from '../models/item/IItem'
import Result, { FailureType } from '../utils/Result'
import i18n from '../plugins/vueI18n'
import Services from './repository/Services'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItemCategory } from '../models/configuration/IItemCategory'
import { ICurrency } from '../models/configuration/ICurrency'
import { NotificationService, NotificationType } from './NotificationService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import { TarkovValuesService } from './TarkovValuesService'
import { ItemFetcherService } from './ItemFetcherService'
import { IPrice } from '../models/item/IPrice'

/**
 * Represents a service responsible for managing items.
 */
export class ItemService {
  /**
   * Indicates whether data that is fetched only once and never expire has been cached or not.
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
  private lastPricesFetchDate: Date = new Date(1)

  /**
   * Current prices fetching task.
   */
  private pricesFetchingPromise: Promise<void> = Promise.resolve()

  /**
   * Fetched presets.
   */
  private presets: IInventoryItem[] = []

  /**
   * Current static data fetching task.
   */
  private staticDataFetchingPromise: Promise<void> = Promise.resolve()

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
   * Gets item categories.
   * @returns Item categories.
   */
  public async getItemCategories(): Promise<IItemCategory[]> {
    await this.initialize()

    return this.itemCategories
  }

  /**
   * Gets an item. Updates the prices if the cache has expired.
   * @param id - Item ID.
   * @returns Item or undefined if the item was not found.
   */
  public async getItem(id: string): Promise<Result<IItem>> {
    await this.initialize()

    const item = this.items.find(i => i.id === id)

    if (item == null) {
      return Result.fail(
        FailureType.error,
        'ItemService.getItem()',
        i18n.t('message.itemNotFound', { id })
      )
    }

    return Result.ok(item)
  }

  /**
   * Gets items of a specified category. Updates the prices if its cache has expired.
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
    const currency = Services.get(TarkovValuesService).values.currencies.find(c => c.mainCurrency)

    if (currency == null) {
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

    const preset = this.presets.find(p => p.itemId === id)

    return preset
  }

  /**
   * Initializes the data used by the service.
   */
  public async initialize(): Promise<void> {
    if (!this.hasStaticDataCached) {
      await this.fetchStaticData()
    }

    if (!this.hasValidCache()) {
      await this.fetchPrices()
    }
  }

  /**
   * Fetchs item categories.
   * @param itemFetcherService - Item fetcher service.
   */
  private async fetchItemCategories(itemFetcherService: ItemFetcherService) {
    const itemCategoriesResult = await itemFetcherService.fetchItemCategories()

    if (!itemCategoriesResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, itemCategoriesResult.failureMessage, true)

      return
    }

    this.itemCategories = itemCategoriesResult.value
  }

  /**
   * Fetchs items.
   * @param itemFetcherService - Item fetcher service.
   */
  private async fetchItems(itemFetcherService: ItemFetcherService) {
    const itemsResult = await itemFetcherService.fetchItems()

    if (!itemsResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, itemsResult.failureMessage, true)

      return
    }

    this.items = itemsResult.value
  }

  /**
   * Fetches prices.
   * If prices are already being fetched, waits for the operation to end before returning.
   * This should in theory never happen since fetchPrices() is only called in initialize() which executes nothing when another initialization is already being performed.
   */
  private async fetchPrices() {
    /* istanbul ignore else */
    if (!this.isFetchingPrices) {
      this.pricesFetchingPromise = new Promise((resolve) => {
        this.isFetchingPrices = true
        const itemFetcherService = Services.get(ItemFetcherService)

        itemFetcherService.fetchPrices()
          .then(async (pricesResult) => this.updateItemsPrices(pricesResult))
          .finally(() => {
            this.isFetchingPrices = false
            resolve()
          })
      })
    }

    await this.pricesFetchingPromise
  }

  /**
   * Fetchs presets.
   * @param itemFetcherService - Item fetcher service.
   */
  private async fetchPresets(itemFetcherService: ItemFetcherService) {
    const presetsResult = await itemFetcherService.fetchPresets()

    if (!presetsResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, presetsResult.failureMessage, true)

      return
    }

    this.presets = presetsResult.value
  }

  /**
   * Fetches static data.
   * If static data is already being fetched, waits for the operation to end before returning.
   * This should in theory never happen since fetchStaticData() is only called in initialize() which executes nothing when another initialization is already being performed.
   */
  private async fetchStaticData(): Promise<void> {
    /* istanbul ignore else */
    if (!this.isFetchingStaticData) {
      this.staticDataFetchingPromise = new Promise<void>((resolve) => {
        this.isFetchingStaticData = true
        const itemFetcherService = Services.get(ItemFetcherService)

        this.fetchItemCategories(itemFetcherService)
          .then(async () => {
            await Promise.allSettled([
              this.fetchItems(itemFetcherService),
              this.fetchPresets(itemFetcherService)
            ])
            this.hasStaticDataCached = true
          })
          .finally(() => {
            this.isFetchingStaticData = false
            resolve()
          })
      })
    }

    await this.staticDataFetchingPromise
  }

  /**
   * Determines whether the cache of an item is still valid or not.
   * @returns `true` if the cache of the item has not expired yet; otherwise `false`.
   */
  private hasValidCache(): boolean {
    const duration = (new Date().getTime() - this.lastPricesFetchDate.getTime()) / 1000 // In seconds
    const cacheDuration = Services.get(WebsiteConfigurationService).configuration.cacheDuration

    return duration <= cacheDuration
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

        if (currencyItem != null) {
          currency.value = currencyItem.prices[0].value
        }
      }
    }
  }

  /**
   * Updates items prices.
   * @param pricesResult - Prices fetching result.
   */
  private updateItemsPrices(pricesResult: Result<IPrice[]>) {
    if (!pricesResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, pricesResult.failureMessage, true)

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
  }

  /**
   * Updates item prices in main currency.
   */
  private updatePricesInMainCurrency() {
    const tarkovValuesService = Services.get(TarkovValuesService)

    for (const item of this.items) {
      for (const price of item.prices.filter(p => p.currencyName !== 'barter')) {
        const currency = tarkovValuesService.values.currencies.find(c => c.name === price.currencyName)

        /* istanbul ignore else */
        if (currency != null) {
          price.valueInMainCurrency = price.value * currency.value
        } else {
          Services.get(NotificationService).notify(NotificationType.error, i18n.t('message.currencyNotFound', { currency: price.currencyName }))
        }
      }
    }
  }
}

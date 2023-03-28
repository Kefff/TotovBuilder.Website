import { IItem } from '../models/item/IItem'
import Result, { FailureType } from '../utils/Result'
import i18n from '../plugins/vueI18n'
import Services from './repository/Services'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { ICurrency } from '../models/configuration/ICurrency'
import { NotificationService, NotificationType } from './NotificationService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import { TarkovValuesService } from './TarkovValuesService'
import { ItemFetcherService } from './ItemFetcherService'
import { IPrice } from '../models/item/IPrice'
import { MerchantFilterService } from './MerchantFilterService'

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
  private itemCategories: string[] = []

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
  private lastPricesFetchDate: Date | undefined

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
   * Gets an item. Updates the prices if the cache has expired.
   * @param id - Item ID.
   * @returns Item.
   */
  public async getItem(id: string): Promise<Result<IItem>> {
    const itemsResult = await this.getItems([id])

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
   * @param useMerchantFilter - Indicates whether the merchant filter must be applied. False by default.
   * @returns Items.
   */
  public async getItems(ids: string[], useMerchantFilter = false): Promise<Result<IItem[]>> {
    await this.initialize()

    let items: IItem[]

    if (useMerchantFilter) {
      items = this.items.filter(i => ids.some(id => id === i.id)
        && Services.get(MerchantFilterService).hasMatchingPrices(i, true))
    } else {
      items = this.items.filter(i => ids.some(id => id === i.id))
    }

    if (items.length < ids.length && !useMerchantFilter) {
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
   * @param useMerchantFilter - Indicates whether the merchant filter must be applied. False by default.
   */
  public async getItemsOfCategories(categoryIds: string[], useMerchantFilter = false): Promise<Result<IItem[]>> {
    await this.initialize()

    let items: IItem[]

    if (useMerchantFilter) {
      items = this.items.filter(i => categoryIds.some(id => id === i.categoryId)
        && Services.get(MerchantFilterService).hasMatchingPrices(i, true))
    } else {
      items = this.items.filter(i => categoryIds.some(id => id === i.categoryId))
    }

    if (items.length === 0 && !useMerchantFilter) {
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
    const lastPricesFetchDate = this.lastPricesFetchDate ?? new Date(1)
    const duration = (new Date().getTime() - lastPricesFetchDate.getTime()) / 1000 // In seconds
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

        /* istanbul ignore else */
        if (currencyItem != null && currencyItem.prices.length > 0) {
          currency.value = currencyItem.prices[0].value
        } else {
          // When the price of a currency is not found, we set its price to 0. It can happen when merchants stop selling the currencies.
          currency.value = 0
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

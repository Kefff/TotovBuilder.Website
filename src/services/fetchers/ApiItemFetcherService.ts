import { IItemFetcherService as IItemFetcherService } from './IItemFetcherService'
import Result, { FailureType } from '../../utils/Result'
import i18n from '../../plugins/vueI18n'
import { ApiService } from '../ApiService'
import Services from '../repository/Services'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IItemCategory } from '../../models/item/IItemCategory'
import Configuration from '../../../test-data/configuration.json'

/**
 * Represents a service responsible for fetching items through a web API.
 */
export class ApiItemFetcherService implements IItemFetcherService {
  /**
   * {@inheritDoc IItemFetcherService.fetchItemCategories}
   */
  public async fetchItemCategories(): Promise<Result<IItemCategory[]>> {
    const apiService = Services.get(ApiService)
    const itemCategoriesResult = await apiService.get<IItemCategory[]>(Configuration.VITE_ITEM_CATEGORIES_API as string)

    return itemCategoriesResult
  }

  /**
   * {@inheritDoc IItemFetcherService.fetchItems}
   */
  public async fetchItems(): Promise<Result<Record<string, unknown>[]>> {
    const apiService = Services.get(ApiService)
    const tarkovItemsResult = await apiService.get<Record<string, unknown>[]>(Configuration.VITE_ITEMS_API as string)

    if (!tarkovItemsResult.success) {
      return Result.failFrom(tarkovItemsResult)
    }

    if (tarkovItemsResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ApiItemFetcher.get()', i18n.t('message.itemsNotFetched'))
    }

    return Result.ok(tarkovItemsResult.value)
  }

  /**
  * {@inheritDoc IItemFetcherService.fetchMarketData}
  */
  public async fetchMarketData(): Promise<Result<Record<string, unknown>[]>> {
    const apiService = Services.get(ApiService)
    const marketDataResult = await apiService.get<Record<string, unknown>[]>(Configuration.VITE_MARKET_DATA_API as string)

    return marketDataResult
  }

  /**
   * {@inheritDoc IItemFetcherService.fetchPresets}
   */
  public async fetchPresets(): Promise<Result<IInventoryItem[]>> {
    const apiService = Services.get(ApiService)
    const presetsResult = await apiService.get<IInventoryItem[]>(Configuration.VITE_PRESETS_API as string)

    return presetsResult
  }
}
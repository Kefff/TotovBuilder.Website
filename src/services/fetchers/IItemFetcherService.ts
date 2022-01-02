import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IItemCategory } from '../../models/item/IItemCategory'
import Result from '../../utils/Result'

/**
 * Provides the functionalities of a service responsible for fetching items.
 */
export interface IItemFetcherService {
  /**
   * Fetches all item categories.
   * @returns Item categories.
   */
  fetchItemCategories(): Promise<Result<IItemCategory[]>>

  /**
   * Fetches all items.
   * @returns Items.
   */
  fetchItems(): Promise<Result<Record<string, unknown>[]>>

  /**
   * Fetches market data.
   * @returns Market data.
   */
  fetchMarketData(): Promise<Result<Record<string, unknown>[]>>

  /**
   * Fetches all presets.
   * @returns Presets.
   */
  fetchPresets(): Promise<Result<IInventoryItem[]>>
}
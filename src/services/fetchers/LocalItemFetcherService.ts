import Result from '../../utils/Result'
import { IItemFetcherService as IItemFetcherService } from './IItemFetcherService'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IItemCategory } from '../../models/item/IItemCategory'
import Configuration from '../../../test-data/configuration.json'

/**
 * Represents a service responsible for fetching items from a local file.
 * Used for development purpose.
 */
export class LocalItemFetcherService implements IItemFetcherService {
  /**
   * Indicates whether the service has been initialized or not.
   */
  private initialized = false

  /**
   * Item categories.
   */
  private itemCategories: IItemCategory[] = []

  /**
   * Items.
   */
  private tarkovItems: Record<string, unknown>[] = []

  /**
   * Market data.
   */
  private marketData: Record<string, unknown>[] = []

  /**
   * Presets.
   */
  private presets: IInventoryItem[] = []

  /**
   * {@inheritDoc IItemFetcherService.fetchItemCategories}
   */
  public async fetchItemCategories(): Promise<Result<IItemCategory[]>> {
    if (!this.initialized) {
      await this.initialize()
    }

    return Result.ok(this.itemCategories)
  }

  /**
   * {@inheritDoc IItemFetcherService.fetchItems}
   */
  public async fetchItems(): Promise<Result<Record<string, unknown>[]>> {
    if (!this.initialized) {
      await this.initialize()
    }

    return Result.ok(this.tarkovItems)
  }

  /**
   * {@inheritDoc IItemFetcherService.fetchMarketData}
   */
  public async fetchMarketData(): Promise<Result<Record<string, unknown>[]>> {
    if (!this.initialized) {
      await this.initialize()
    }

    return Result.ok(this.marketData)
  }

  /**
   * {@inheritDoc IItemFetcherService.fetchPresets}
   */
  public async fetchPresets(): Promise<Result<IInventoryItem[]>> {
    if (!this.initialized) {
      await this.initialize()
    }

    return Result.ok(this.presets)
  }

  private async initialize() {
    const debug = Configuration.VITE_DEBUG === 'true'

    if (debug) {
      // Loading dev assets only when in dev mode
      this.itemCategories = (await import('../../../test-data/item-categories.json')).default
      this.marketData = (await import('../../../test-data/market-data.json')).default
      this.tarkovItems = (await import('../../../test-data/items.json')).default as Record<string, unknown>[]
      this.presets = (await import('../../../test-data/presets.json')).default as unknown as IInventoryItem[]
    }

    this.initialized = true
  }
}
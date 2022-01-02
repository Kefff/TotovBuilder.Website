import { IItem } from '../../models/item/IItem'

/**
 * Provides the functionalities of an item reader.
 */
export interface IItemReaderService<T extends IItem> {
  /**
   * Reads Tarkov data to populate an item.
   * @param tarkovItem - Tarkov item.
   * @param categoryId - Category ID of the item.
   * @param itemToPopulate - Item that must be populated. If null, a new instance is created
   * @returns - Populated item.
   */
  read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<T>

  /**
   * Reads market data to populate an item.
   * @param marketData - Market data.
   * @param itemToPopulate - Item that must be populated.
   */
  readMarketData(marketData: Record<string, unknown>, itemToPopulate: T): Promise<T>
}
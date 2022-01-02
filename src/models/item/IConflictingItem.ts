/**
 * Provides the functionalities of a conflicting item.
 */
export interface IConflictingItem {
  /**
   * ID of one of the conflicting items for the item.
   */
  conflictingItemId: string | undefined

  /**
   * ID of the item that has conflicting items.
   */
  itemId: string,

  /**
   * "Path" to the mod slot in which the item is.
   */
  modSlotPath: string
}
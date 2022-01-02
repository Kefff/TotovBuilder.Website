import { IInventoryModSlot } from './IInventoryModSlot'

/**
 * Provides the functionalities of a an item in the inventory.
 */
export interface IInventoryItem {
  /**
   * Items contained in the item.
   */
  content: IInventoryItem[]

  /**
   * Item ID.
   */
  itemId: string

  /**
   * Mods slots.
   */
  modSlots: IInventoryModSlot[]

  /**
   * Number of items stacked.
   */
  quantity: number
}
import { IInventoryModSlot } from './IInventoryModSlot'

/**
 * Provides the functionalities of an item in the inventory.
 */
export interface IInventoryItem {
  /**
   * Items contained in the item.
   */
  content: IInventoryItem[]

  /**
   * Indicates whether the price of the item is used or not.
   * When undefined, the price is taken in consideration.
   */
  ignorePrice: boolean

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
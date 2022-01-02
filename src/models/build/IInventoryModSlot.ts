import { IInventoryItem } from './IInventoryItem'

/**
 * Provides the functionalities of a mod slot in an inventory item.
 */
export interface IInventoryModSlot {
  /**
   * Item.
   */
  item?: IInventoryItem

  /**
   * Name of the mod slot.
   */
  modSlotName: string
}
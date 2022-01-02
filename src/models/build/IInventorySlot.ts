import { IInventoryItem } from './IInventoryItem'

/**
 * Provides the functionalities of an inventory slot.
 */
export interface IInventorySlot {
  /**
   * Items contained in the slot.
   * Usually inventory slots contain only one item slot, but some inventory slots have more item slots (pockets for example).
   */
  items: (IInventoryItem | undefined)[]

  /**
   * ID of the type of the slot.
   */
  typeId: string
}
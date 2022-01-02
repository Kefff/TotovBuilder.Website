import { IInventorySlot } from './IInventorySlot'

/**
 * Provides the functionalities of a build.
 */
export interface IBuild {
  /**
   * ID.
   */
  id: string

  /**
   * Name.
   */
  name: string

  /**
   * Inventory slots.
   */
  inventorySlots: IInventorySlot[]

  /**
   * Last export date.
   */
  lastExported: Date | undefined,

  /**
   * Last update date.
   */
  lastUpdated: Date
}
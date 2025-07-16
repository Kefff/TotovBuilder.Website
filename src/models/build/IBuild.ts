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
  lastExported?: Date,

  /**
   * Last update date.
   */
  lastUpdated?: Date,

  /**
   * Last version of the website that updated the build.
   */
  lastWebsiteVersion?: string

  /**
   * URL for sharing the build.
   */
  sharabledUrl?: string
}
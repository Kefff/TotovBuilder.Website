import { IItemCategory } from '../item/IItemCategory'

/**
 * Provides the functionalities of an inventory slot type.
 */
export interface IInventorySlotType {
  /**
   * Categories of item can be used in the slot.
   */
  acceptedItemCategories: IItemCategory[]

  /**
   * Indicated wether the items contained in the inventory slot can be looted or not.
   * The price of non-lootable items does not count towards the total price of a build.
   * However, the price of items contained in a non-lootable item counts towards the total price of a build.
   */
  canBeLooted: boolean,

  /**
   * Custom icon.
   */
  customIcon?: string

  /**
   * IDs of the items that are present by default in the slot when a new build is created.
   */
  defaultItemsIds?: string[]

  /**
   * Order in which the inventory slot will appear in a build.
   */
  displayOrder: number

  /**
   * ID.
   */
  id: string

  /**
   * Icon.
   */
  icon?: string

  /**
   * Amount of item slots.
   * Usually inventory slots contain only one item slot, but some inventory slots have more item slots (pockets for example).
   */
  itemSlotsAmount: number
}
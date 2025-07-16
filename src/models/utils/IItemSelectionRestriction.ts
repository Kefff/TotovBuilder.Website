import { IItem } from '../item/IItem'

/**
 * Provides the functionalities of an item selection restriction
 */
export interface IItemSelectionRestriction {
  /**
   * Method for checking whether an item is restricted.
   * @returns Reason of the restriction if the item is restricted; otherwise undefined.
   */
  checkIsRestricted: (itemToCheckPath: string, itemToCheck: IItem) => string | undefined

  /**
   * Item that adds the restriction.
   */
  item: IItem

  /**
   * Path of the item that adds the restriction.
   */
  path: string
}
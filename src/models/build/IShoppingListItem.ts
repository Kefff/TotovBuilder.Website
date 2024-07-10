import { IItem } from '../item/IItem'
import { IPrice } from '../item/IPrice'


/**
 * Provides the functionalities of a shopping list item.
 */
export interface IShoppingListItem {
  /**
   * Indicates whether the price of the item is ignored.
   */
  ignorePrice: boolean

  /**
   * ID of the inventory slot in which the item is placed.
   */
  inventorySlotId: string | undefined

  /**
   * Item.
   */
  item: IItem

  /**
   * Indicates whether the price of the item is missing.
   */
  missingPrice: boolean

  /**
   * Price.
   */
  price: IPrice

  /**
   * Quantity.
   */
  quantity: number

  /**
   * Unit price.
   */
  unitPrice: IPrice
}
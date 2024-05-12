import { IItem } from '../item/IItem'
import { IPrice } from '../item/IPrice'


/**
 * Provides the functionalities of a shopping list item.
 */
export interface IShoppingListItem {
  /**
   * ID of the inventory slot in which the item is placed.
   */
  inventorySlotId: string | undefined

  /**
   * Item.
   */
  item: IItem

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
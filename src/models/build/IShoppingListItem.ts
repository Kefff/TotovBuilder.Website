import { IItem } from '../item/IItem'
import { IPrice } from '../item/IPrice'


/**
 * Provides the functionalities of a shopping list item.
 */
export interface IShoppingListItem {
  /**
   * Item.
   */
  item: IItem

  /**
   * Price.
   */
  price: IPrice

  /**
   * Unit price.
   */
  unitPrice: IPrice

  /**
   * Quantity.
   */
  quantity: number
}
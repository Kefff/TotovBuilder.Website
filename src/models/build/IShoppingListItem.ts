import { IPrice } from '../item/IPrice'


/**
 * Provides the functionalities of a shopping list item.
 */
export interface IShoppingListItem {
  /**
   * Link to the icon.
   */
  iconLink: string

  /**
   * ID.
   */
  id: string

  /**
   * Name.
   */
  name: string

  /**
   * Unit price.
   */
  unitPrice: IPrice

  /**
   * Quantity.
   */
  quantity: number
}
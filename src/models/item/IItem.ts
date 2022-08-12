import { IPrice } from './IPrice'

/**
 * Provides the functionalities of an item.
 */
export interface IItem {
  /**
   * ID of the category of the item.
   */
  categoryId: string

  /**
   * IDs of conflicting items.
   */
  conflictingItemIds: string[]

  /**
   * Link to the icon.
   */
  iconLink: string

  /**
   * ID.
   */
  id: string,

  /**
   * Link to the image.
   */
  imageLink: string

  /**
   * Maximum number of times the item can be stacked.
   */
  maxStackableAmount: number

  /**
   * Link to the item market page.
   */
  marketLink: string

  /**
   * Name.
   */
  name: string

  /**
   * Prices.
   */
  prices: IPrice[],

  /**
   * Short name.
   */
  shortName: string,

  /**
   * Weight in kilograms.
   */
  weight: number

  /**
   * Link to the item wiki page.
   */
  wikiLink: string
}
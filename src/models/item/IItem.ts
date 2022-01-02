import { IPrice } from '../utils/IPrice'

/**
 * Provides the functionalities of an item.
 */
export interface IItem {
  /**
   * Caption.
   */
  caption: string

  /**
   * ID of the category of the item.
   */
  categoryId: string

  /**
   * IDs of conflicting items.
   */
  conflictingItemIds: string[],

  /**
   * Description.
   */
  description: string,

  /**
   * Indicates whether the item has market data or not.
   */
  hasMarketData: boolean

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
  maxStackableAmount: number;

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
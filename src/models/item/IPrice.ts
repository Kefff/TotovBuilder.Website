import { IBarterItem } from './IBarterItem'

/**
 * Provides the functionalities of a price.
 */
export interface IPrice {
  /**
   * Barter items.
   */
  barterItems: IBarterItem[],

  /**
   * Name of the currency.
   */
  currencyName: string

  /**
   * Item ID.
   */
  itemId: string,

  /**
   * Merchant.
   */
  merchant: string

  /**
   * Merchant level.
   */
  merchantLevel: number

  /**
   * ID of the quest unlocking the trade.
   */
  questId: string

  /**
   * Value.
   */
  value: number

  /**
   * Value in main currency
   */
  valueInMainCurrency: number
}
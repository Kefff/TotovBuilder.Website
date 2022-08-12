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
   * Merchant.
   */
  merchant: string | undefined

  /**
   * Merchant level.
   */
  merchantLevel: number | undefined

  /**
   * ID of the quest unlocking the trade.
   */
  questId: string | undefined

  /**
   * Value.
   */
  value: number

  /**
   * Value in main currency
   */
  valueInMainCurrency: number
}
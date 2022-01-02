/**
 * Provides the functionalities of a price.
 */
export interface IPrice {
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
   * Requires a quest.
   */
  requiresQuest: boolean

  /**
   * Value.
   */
  value: number

  /**
   * Value in main currency
   */
  valueInMainCurrency: number
}
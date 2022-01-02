/**
 * Provides the functionalities of a currency.
 */
export interface ICurrency {
  /**
   * Icon name.
   */
  iconName: string

  /**
   * ID of the item representing the currency.
   */
  itemId?: string

  /**
   * Indicates whether the currency is the main currency or not.
   */
  mainCurrency: boolean

  /**
   * Name.
   */
  name: string

  /**
   * Value in main currency.
   */
  value: number
}
/**
 * Provides the functionalities of a merchant.
 */
export interface IMerchant {
  /**
   * Maximum level.
   */
  maxLevel: number

  /**
   * Minimum level.
   */
  minLevel: number
  /**
   * Name.
   */
  name: string

  /**
   * Indicates whether the merchant is showed in the merchants filter.
   */
  showInFilter: boolean
}
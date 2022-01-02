/**
 * Provides the functionalities of a merchant.
 */
export interface IMerchant {
  /**
   * Name.
   */
  name: string,

  /**
   * Minimum level.
   */
  minLevel: number,

  /**
   * Maximum level.
   */
  maxLevel: number,

  /**
   * Indicates whether the merchant is showed in the merchants filter.
   */
  showInFilter: boolean
}
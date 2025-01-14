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
   * Order of appearance.
   */
  order: number

  /**
   * Indicates whether the merchant is showed in the merchants filter.
   */
  showInFilter: boolean
}
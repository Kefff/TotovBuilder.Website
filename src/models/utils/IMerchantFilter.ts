/**
 * Provides the functionalities of a merchant filter.
 */
export interface IMerchantFilter {
  /**
   * Indicates whether the merchant is enabled or not.
   */
  enabled: boolean

  /**
   * Merchant.
   */
  merchant: string,

  /**
   * Merchant level.
   */
  merchantLevel: number,
}
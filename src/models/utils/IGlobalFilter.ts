import { IMerchantFilter } from './IMerchantFilter'

/**
 * Represents filters applied in the whole application.
 */
export interface IGlobalFilter {
  /**
   * Indicatew whether items that have no price matching the merchant filters are excluded.
   */
  excludeItemsWithoutMatchingPrice: boolean

  /**
   * Indicates whether the base items of presets are exluded.
   */
  excludePresetBaseItems: boolean

  /**
   * Merchant filters.
   */
  merchantFilters: IMerchantFilter[]
}
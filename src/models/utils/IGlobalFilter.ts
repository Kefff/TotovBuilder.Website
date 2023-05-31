import { IItemExclusionFilter } from './IItemExclusionFilter'
import { IMerchantFilter } from './IMerchantFilter'

/**
 * Represents filters applied in the whole application.
 */
export interface IGlobalFilter {
  /**
   * Item filters.
   */
  itemExclusionFilters: IItemExclusionFilter[]

  /**
   * Merchant filters.
   */
  merchantFilters: IMerchantFilter[]
}
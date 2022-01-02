import { IAmmunitionCount } from './IAmmunitionCount'
import { IInventoryPrice } from './IInventoryPrice'

/**
 * Represents a summary of a build.
 */
export interface IBuildSummary {
  /**
   * Ammunition counts.
   */
  ammunitionCounts: IAmmunitionCount[]
  /**
   * Ergonomics.
   */
  ergonomics: number | undefined

  /**
   * Ergonomics percentage modifier.
   */
  ergonomicsPercentageModifier: number

  /**
   * Indicates whether the build has been exported since it was last updated or not.
   */
  exported: boolean

  /**
   * Horizontal recoil.
   */
  horizontalRecoil: number | undefined

  /**
   * ID.
   */
  id: string

  /**
   * Last export date.
   */
  lastExported: Date | undefined,

  /**
   * Last update date.
   */
  lastUpdated: Date

  /**
   * Name.
   */
  name: string

  /**
   * Price.
   */
  price: IInventoryPrice

  /**
   * Vertical recoil.
   */
  verticalRecoil: number | undefined

  /**
   * Weight.
   */
  weight: number
}
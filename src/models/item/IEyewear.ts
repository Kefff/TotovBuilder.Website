import { IItem } from './IItem'

/**
 * Provides the functionalities of an eyewear item.
 */
export interface IEyewear extends IItem {
  /**
   * Blindness protection percentage.
   */
  blindnessProtectionPercentage: number
}
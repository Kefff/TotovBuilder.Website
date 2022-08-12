import { IItem } from './IItem'

/**
 * Provides the functionalities of eyewear.
 */
export interface IEyewear extends IItem {
  /**
   * Blindness protection percentage.
   */
  blindnessProtectionPercentage: number
}
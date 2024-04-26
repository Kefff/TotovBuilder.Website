import { IArmor } from './IArmor'

/**
 * Provides the functionalities of an armor mod.
 */
export interface IArmorMod extends IArmor {
  /**
   * Blindness protection percentage.
   */
  blindnessProtectionPercentage: number
}
import { IArmor } from './IArmor'
import { IModdable } from './IModdable'

/**
 * Provides the functionalities of an armor mod.
 */
export interface IArmorMod extends IArmor, IModdable {
  /**
   * Blindness protection percentage.
   */
  blindnessProtectionPercentage: number
}
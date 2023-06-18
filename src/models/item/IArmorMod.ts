import { IWearableModifiers } from '../utils/IWearableModifiers'
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

  /**
   * Wearable modifier of the whole preset added to the weapon in percentage.
   * Undefined if the item is not a preset.
   */
  presetWearableModifiers: IWearableModifiers | undefined
}
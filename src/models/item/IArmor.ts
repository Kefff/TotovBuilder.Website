import { IArmorModifiers } from '../utils/IArmorModifiers'
import { IModdable } from './IModdable'
import { IWearable } from './IWearable'

/**
 * Provides the functionalities of an armor.
 */
export interface IArmor extends IModdable, IWearable {
  /**
   * Armor class.
   */
  armorClass: number

  /**
   * List of areas protected by the armor.
   */
  armoredAreas: string[]

  /**
  * Blindness protection percentage.
  */
  blindnessProtectionPercentage: number

  /**
   * Durability
   */
  durability: number

  /**
   * Material which composes the armor.
   */
  material: string

  /**
   * Armor modifier of the whole preset added to the armor in percentage.
   * Undefined if the item is not a preset.
   */
  presetArmorModifiers: IArmorModifiers | undefined
}
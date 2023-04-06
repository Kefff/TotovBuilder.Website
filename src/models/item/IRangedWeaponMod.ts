import { IMod } from './IMod'

/**
 * Provides the functionalities of a ranged weapon mod.
 */
export interface IRangedWeaponMod extends IMod {
  /**
   * Modifier added to the weapon accuracy in percentage.
   */
  accuracyPercentageModifier: number

  /**
   * Modifier of the whole preset added to the weapon ergonomics in percentage.
   * Undefined if the item is not a preset.
   */
  presetRecoilPercentageModifier: number | undefined

  /**
   * Modifier added to the weapon recoil in percentage.
   */
  recoilPercentageModifier: number
}
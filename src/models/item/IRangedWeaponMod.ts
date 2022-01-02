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
   * Modifier added to the weapon recoil in percentage.
   */
  recoilPercentageModifier: number
}
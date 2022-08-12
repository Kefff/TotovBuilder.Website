import { IModdable } from './IModdable'

/**
 * Provides the functionalities of a ranged weapon.
 */
export interface IRangedWeapon extends IModdable {
  /**
   * Caliber.
   */
  caliber: string

  /**
   * Ergonomics.
   * Influences amongst other things the weapon sway, the amount of time the weapon can be held aiming
   * and the noise the weapon makes when aiming.
   */
  ergonomics: number

  /**
   * Fire modes.
   */
  fireMods: string[]

  /**
   * Fire rate in bullets per second.
   */
  fireRate: number

  /**
   * Horizontal recoil.
   */
  horizontalRecoil: number

  /**
   * Vertical recoil.
   */
  verticalRecoil: number
}
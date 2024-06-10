/**
 * Provides the functionalities of ranged weapon modifiers.
 */
export interface IRangedWeaponModifiers {
  /**
   * Ergonomics.
   */
  ergonomics: number

  /**
   * Horizontal recoil.
   */
  horizontalRecoil: number

  /**
   * Vertical recoil.
   */
  verticalRecoil: number
}
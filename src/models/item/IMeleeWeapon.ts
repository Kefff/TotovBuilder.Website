import { IItem } from './IItem'

/**
 * Provides the functionalities of a melee weapon.
 */
export interface IMeleeWeapon extends IItem {
  /**
   * Chop damage.
   */
  chopDamage: number

  /**
   * Hit radius in meters.
   */
  hitRadius: number

  /**
   * Stab damage.
   */
  stabDamage: number
}
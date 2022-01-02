import { IItem } from './IItem'

/**
 * Provides the functionalities of a grenade.
 */
export interface IGrenade extends IItem {
  /**
   * Delay before explosion in seconds.
   */
  explosionDelay: number

  /**
   * Type of ammunition of the fragments.
   */
  fragmentAmmunitionId: string

  /**
   * Number of fragments.
   */
  fragmentsAmount: number

  /**
   * Maximum explosion range in meters.
   */
  maximumExplosionRange: number

  /**
   * Minimum explosion range in meters.
   */
  minimumExplosionRange: number
}
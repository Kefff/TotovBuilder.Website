import { IItem } from './IItem'

/**
 * Provides the functionalities of a grenade.
 */
export interface IGrenade extends IItem {
  /**
   * Indicates whether the ammunitions can blind opponents.
   */
  blinding: boolean

  /**
   * Delay before explosion in seconds.
   */
  explosionDelay: number

  /**
   * Number of fragments.
   */
  fragmentsAmount: number

  /**
   * Explodes on impact.
   */
  impact: boolean

  /**
   * Maximum explosion range in meters.
   */
  maximumExplosionRange: number

  /**
   * Minimum explosion range in meters.
   */
  minimumExplosionRange: number

  /**
   * Emits smoke.
   */
  smoke: boolean
}
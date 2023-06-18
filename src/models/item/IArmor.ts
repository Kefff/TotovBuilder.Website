import { IWearable } from './IWearable'

/**
 * Provides the functionalities of an armor.
 */
export interface IArmor extends IWearable {
  /**
   * Armor class.
   */
  armorClass: number

  /**
   * List of areas protected by the armor.
   */
  armoredAreas: string[]

  /**
   * Durability
   */
  durability: number

  /**
   * Material which composes the armor.
   */
  material: string

  /**
   * Chance of ricochet.
   */
  ricochetChance: string
}
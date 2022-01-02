import { IItem } from './IItem'

/**
 * Provides the functionalities of an armor
 */
export interface IArmor extends IItem {
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
   * Modifier added to the weapon ergonomics in percentage.
   */
  ergonomicsPercentageModifier: number

  /**
   * Material which composes the armor.
   */
  material: string

  /**
   * Modifier added to the character movement speed in percentage.
   */
  movementSpeedPercentageModifier: number

  /**
   * Chance of ricochet.
   */
  ricochetChance?: string

  /**
   * Modifier added to the character turning speed in percentage.
   */
  turningSpeedPercentageModifier: number
}
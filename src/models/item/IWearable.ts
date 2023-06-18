import { IItem } from './IItem'

/**
 * Provides the functionalities of a wearable piece of equipment.
 */
export interface IWearable extends IItem {
  /**
   * Modifier added to the weapon ergonomics in percentage.
   */
  ergonomicsPercentageModifier: number

  /**
   * Modifier added to the character movement speed in percentage.
   */
  movementSpeedPercentageModifier: number

  /**
   * Modifier added to the character turning speed in percentage.
   */
  turningSpeedPercentageModifier: number
}
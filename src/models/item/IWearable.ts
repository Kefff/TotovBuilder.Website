import { IWearableModifiers } from '../utils/IWearableModifiers'
import { IItem } from './IItem'

/**
 * Provides the functionalities of a wearable piece of equipment.
 */
export interface IWearable extends IItem {
  /**
   * Modifier added to the weapon ergonomics in percentage.
   */
  ergonomicsModifierPercentage: number

  /**
   * Modifier added to the character movement speed in percentage.
   */
  movementSpeedModifierPercentage: number

  /**
   * Wearable modifier of the whole preset added to the weapon in percentage.
   * Undefined if the item is not a preset.
   */
  presetWearableModifiers: IWearableModifiers | undefined

  /**
   * Modifier added to the character turning speed in percentage.
   */
  turningSpeedModifierPercentage: number
}
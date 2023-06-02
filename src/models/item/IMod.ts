import { IModdable } from './IModdable'

/**
 * Provides the functionalities of a mod.
 */
export interface IMod extends IModdable {
  /**
   * Modifier added to the weapon ergonomics.
   */
  ergonomicsModifier: number

  /**
   * Modifier of the whole preset added to the weapon ergonomics.
   * Undefined if the item is not a preset.
   */
  presetErgonomicsModifier: number | undefined
}
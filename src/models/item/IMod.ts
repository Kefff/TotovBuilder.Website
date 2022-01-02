import { IModdable } from './IModdable'

/**
 * Provides the functionalities of a mod.
 */
export interface IMod extends IModdable {
  /**
   * Modifier added to the weapon ergonomics.
   */
  ergonomicsModifier: number
}
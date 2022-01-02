import { IItem } from './IItem'
import { IModSlot } from './IModSlot'

/**
 * Provides the functionalities of a moddable item.
 */
export interface IModdable extends IItem {
  /**
   * Mod slots.
   */
  modSlots: IModSlot[]
}
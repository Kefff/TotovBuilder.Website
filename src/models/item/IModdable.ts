import { IItem } from './IItem'
import { IModSlot } from './IModSlot'

/**
 * Provides the functionalities of a moddable item.
 */
export interface IModdable extends IItem {
  /**
   * Base item ID.
   */
  baseItemId: string | undefined

  /**
   * Default preset ID.
   */
  defaultPresetId: string | undefined

  /**
   * Mod slots.
   */
  modSlots: IModSlot[]
}
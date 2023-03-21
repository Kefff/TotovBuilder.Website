import { IItem } from './IItem'
import { IModSlot } from './IModSlot'

/**
 * Provides the functionalities of a moddable item.
 */
export interface IModdable extends IItem {
  /**
   * Base item ID.
   */
  baseItemId: string | null

  /**
   * Default preset ID.
   */
  defaultPresetId: string | null

  /**
   * Mod slots.
   */
  modSlots: IModSlot[]
}
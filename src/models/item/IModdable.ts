import { IItem } from './IItem'
import { IModSlot } from './IModSlot'

/**
 * Provides the functionalities of a moddable item.
 */
export interface IModdable extends IItem {
  /**
   * Base item ID.
   */
  baseItemId: string | null | undefined

  /**
   * Default preset ID.
   */
  defaultPresetId: string | null | undefined

  /**
   * Mod slots.
   */
  modSlots: IModSlot[]
}
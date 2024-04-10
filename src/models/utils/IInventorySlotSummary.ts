import { IInventorySlotType } from '../build/IInventorySlotType'
import { IArmorModifiers } from './IArmorModifiers'
import { IInventoryPrice } from './IInventoryPrice'
import { IWearableModifiers } from './IWearableModifiers'

/**
 * Represents a summary of an inventory slot.
 */
export interface IInventorySlotSummary {
  /**
   * Armor modifiers.
   */
  armorModifiers: IArmorModifiers | undefined

  /**
   * Ergonomics.
   */
  ergonomics: number | undefined

  /**
   * Horizontal recoil.
   */
  horizontalRecoil: number | undefined

  /**
   * Price.
   */
  price: IInventoryPrice

  /**
   * Inventory slot type.
   */
  type: IInventorySlotType

  /**
   * Vertical recoil.
   */
  verticalRecoil: number | undefined

  /**
   * Wearable modifiers.
   */
  wearableModifiers: IWearableModifiers

  /**
   * Weight.
   */
  weight: number
}
import { IInventorySlotType } from '../build/IInventorySlotType'
import { IArmorModifiers } from './IArmorModifiers'
import { IInventoryPrice } from './IInventoryPrice'
import { IRecoil } from './IRecoil'
import { IWearableModifiers } from './IWearableModifiers'

/**
 * Represents a summary of an inventory slot.
 */
export interface IInventorySlotSummary {
  /**
   * Armor modifiers.
   */
  armorModifiers: IArmorModifiers
  /**
   * Ergonomics.
   */
  ergonomics: number

  /**
   * Price.
   */
  price: IInventoryPrice

  /**
   * Recoil.
   */
  recoil: IRecoil

  /**
   * Inventory slot type.
   */
  type: IInventorySlotType

  /**
   * Wearable modifiers.
   */
  wearableModifiers: IWearableModifiers

  /**
   * Weight.
   */
  weight: number
}
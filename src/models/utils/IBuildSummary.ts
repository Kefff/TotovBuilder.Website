import { IShoppingListItem } from '../build/IShoppingListItem'
import { IArmorModifiers } from './IArmorModifiers'
import { IInventoryPrice } from './IInventoryPrice'
import { IRecoil } from './IRecoil'
import { IWearableModifiers } from './IWearableModifiers'

/**
 * Represents a summary of a build.
 */
export interface IBuildSummary {
  /**
   * Armor modifiers.
   */
  armorModifiers: IArmorModifiers

  /**
   * Ergonomics.
   */
  ergonomics: number

  /**
   * Indicates whether the build has been exported since it was last updated or not.
   */
  exported: boolean

  /**
   * ID.
   */
  id: string

  /**
   * Last export date.
   */
  lastExported: Date | undefined,

  /**
   * Last update date.
   */
  lastUpdated: Date | undefined

  /**
   * Name.
   */
  name: string

  /**
   * Price.
   */
  price: IInventoryPrice

  /**
   * Recoil.
   */
  recoil: IRecoil

  /**
   * List of all the items, their content and barter items to buy to make the build.
   */
  shoppingList: IShoppingListItem[]

  /**
   * Wearable modifiers.
   */
  wearableModifiers: IWearableModifiers

  /**
   * Weight.
   */
  weight: number
}
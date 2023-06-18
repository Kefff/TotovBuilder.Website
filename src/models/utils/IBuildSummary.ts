import { IShoppingListItem } from '../build/IShoppingListItem'
import { IInventoryPrice } from './IInventoryPrice'
import { IWearableModifiers } from './IWearableModifiers'

/**
 * Represents a summary of a build.
 */
export interface IBuildSummary {
  /**
   * Ergonomics.
   */
  ergonomics: number | undefined

  /**
   * Indicates whether the build has been exported since it was last updated or not.
   */
  exported: boolean

  /**
   * Horizontal recoil.
   */
  horizontalRecoil: number | undefined

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
   * List of all the items, their content and barter items to buy to make the build.
   */
  shoppingList: IShoppingListItem[]

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
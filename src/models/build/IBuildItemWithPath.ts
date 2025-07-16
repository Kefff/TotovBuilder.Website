import { IItem } from '../item/IItem'

/**
 * Provides the functionalities of a build item and its path.
 */
export interface IBuildItemWithPath {
  /**
   * Item.
   */
  item: IItem

  /**
   * Path.
   */
  path: string
}
import { IItemType } from './IItemType'

/**
 * Provides the functionalities of an item category.
 */
export interface IItemCategory {
  /**
   * ID.
   */
  id: string,

  /**
   * Items types that belong to this category.
   */
  types: IItemType[]
}
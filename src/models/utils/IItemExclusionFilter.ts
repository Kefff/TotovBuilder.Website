import { IItem } from '../item/IItem'

/**
 * Represents a filter used to exclude available items.
 */
export interface IItemExclusionFilter {
  /**
   * Indicates whether the filter is enabled.
   */
  enabled: boolean

  /**
   * Method indicating whether an item is excluded.
   * @returns true when the item is excluded; otherwise false.
   */
  exclude: (item: IItem) => boolean

  /**
   * Name of the filter.
   */
  name: string
}
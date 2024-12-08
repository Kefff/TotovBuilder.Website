import { IItem, ItemCategoryId } from '../item/IItem'
import SortingData from './SortingData'

/**
 * Represents the functionalities of data for filtering and sorting the items and builds list.
 */
export default class ItemFilterAndSortingData extends SortingData<IItem> {
  /**
   * Category of item being sorted.
   */
  public categoryId?: ItemCategoryId

  /**
   * Filter.
   */
  public filter?: string

  /**
   * Indicates whether the category should not be editable in the filter sidebar.
   */
  public isCategoryReadOnly = false
}
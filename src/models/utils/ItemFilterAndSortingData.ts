import { ItemSortingFunctions } from '../../services/sorting/functions/itemSortingFunctions'
import { IItem, ItemCategoryId } from '../item/IItem'
import SortingData from './SortingData'

/**
 * Represents the functionalities of data for filtering and sorting the items and builds list.
 */
export default class ItemFilterAndSortingData extends SortingData<IItem> {
  /**
     * Initializes a new instance of the SortingData class.
     */
  public constructor() {
    super(ItemSortingFunctions)
  }

  /**
   * Category of item being sorted.
   */
  public categoryId?: ItemCategoryId

  /**
   * Filter.
   */
  public filter?: string

  /**
   * Indicates whether the filter field should be focused.
   */
  public focusFilter?: boolean

  /**
   * Indicates whether the category should not be editable in the filter sidebar.
   */
  public isCategoryReadOnly = false
}
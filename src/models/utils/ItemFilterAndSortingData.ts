import { ItemSortingFunctions } from '../../services/sorting/functions/itemSortingFunctions'
import { IItem, ItemCategoryId } from '../item/IItem'
import SortingData from './SortingData'

/**
 * Represents the functionalities of data for filtering and sorting the items and builds list.
 */
export default class ItemFilterAndSortingData extends SortingData<IItem> {
  /**
   * Initializes a new instance of the SortingData class.
   * @param itemFilterAndSortingDataToCopy - Item filter and sorting data to copy.
   */
  public constructor(itemFilterAndSortingDataToCopy?: ItemFilterAndSortingData) {
    super(ItemSortingFunctions, itemFilterAndSortingDataToCopy)

    if (itemFilterAndSortingDataToCopy != null) {
      this.availableItemCategories = itemFilterAndSortingDataToCopy.availableItemCategories
      this.categoryId = itemFilterAndSortingDataToCopy.categoryId
      this.filter = itemFilterAndSortingDataToCopy.filter
      this.focusFilter = itemFilterAndSortingDataToCopy.focusFilter
    }
  }

  /**
   * List of category IDs that can be selected for filtering.
   */
  public availableItemCategories: ItemCategoryId[] = []

  /**
   * Category for filtering items.
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
   * Indicates whether the filter category fied is read only.
   * This is the case when only one category is available for selection.
   */
  public get isCategoryIdReadOnly(): boolean {
    return this.availableItemCategories.length === 1
  }
}
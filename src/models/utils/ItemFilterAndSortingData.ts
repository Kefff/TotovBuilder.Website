import Services from '../../services/repository/Services'
import { ItemSortingFunctions } from '../../services/sorting/functions/itemSortingFunctions'
import { SortingService } from '../../services/sorting/SortingService'
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
    }
  }

  /**
   * List of category IDs that can be selected for filtering.
   */
  public availableItemCategories: ItemCategoryId[] = []

  /**
   * Category for filtering items.
   */
  public get categoryId(): ItemCategoryId | undefined {
    return this._categoryId
  }
  public set categoryId(value: ItemCategoryId | undefined) {
    this._categoryId = value
    this.setSortingFunctions()
  }
  private _categoryId: ItemCategoryId | undefined

  /**
   * Indicates whether the filter category fied is read only.
   * This is the case when only one category is available for selection.
   */
  public get isCategoryIdReadOnly(): boolean {
    return this.availableItemCategories.length === 1
  }

  /**
   * Sets the sorting function based on the item category ID.
   */
  private setSortingFunctions(): void {
    this.sortingFunctions = Services.get(SortingService).getSortingFunctionsFromItemCategory(this.categoryId)

    if (this.sortingFunctions.functions[this.property] == null) {
      this.property = 'name'
    }
  }
}
import Services from '../../services/repository/Services'
import { ISortingFunctionList } from '../../services/sorting/functions/ISortingFunctionList'
import { SortingService } from '../../services/sorting/SortingService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { IItem, ItemCategoryId } from '../item/IItem'
import FilterAndSortingData, { FilterAndSortingDataType } from './FilterAndSortingData'
import { SortingOrder } from './SortingOrder'

/**
 * Represents the functionalities of data for filtering and sorting the items and builds list.
 */
export default class ItemFilterAndSortingData extends FilterAndSortingData<IItem> {
  /**
   * Initializes a new instance of the ItemFilterAndSortingData class.
   * @param sortingFunctions - Available sorting functions.
   * @param filterAndSortingDataToCopy - Sorting data to copy.
   */
  public constructor(sortingFunctions: ISortingFunctionList, itemFilterAndSortingDataToCopy?: ItemFilterAndSortingData) {
    super(sortingFunctions, itemFilterAndSortingDataToCopy)

    if (itemFilterAndSortingDataToCopy != null) {
      this._availableItemCategories = itemFilterAndSortingDataToCopy.availableItemCategories
      this._categoryId = itemFilterAndSortingDataToCopy.categoryId
    } else {
      this.setPropertiesFromLastSort()
    }
  }

  /**
   * List of category IDs that can be selected for filtering.
   */
  public get availableItemCategories(): ItemCategoryId[] {
    return this._availableItemCategories
  }
  public set availableItemCategories(value: ItemCategoryId[]) {
    this._availableItemCategories = value

    if (value.length === 1) {
      this.categoryId = value[0]
    }
  }
  private _availableItemCategories: ItemCategoryId[] = []

  /**
   * Category for filtering items.
   */
  public get categoryId(): ItemCategoryId | undefined {
    return this._categoryId
  }
  public set categoryId(value: ItemCategoryId | undefined) {
    if (value !== this._categoryId) {
      this._categoryId = value
      this.setSortingFunctions()
    }
  }
  private _categoryId: ItemCategoryId | undefined = undefined

  /**
   * Indicates whether the filter category field is read only.
   * This is the case when only one category is available for selection.
   */
  public get isCategoryIdReadOnly(): boolean {
    return this.availableItemCategories.length === 1
  }

  /** {@inheritDoc FilterAndSortingData."type"} */
  public type: FilterAndSortingDataType = FilterAndSortingDataType.item

  /** {@inheritDoc FilterAndSortingData.setOrder} */
  protected override setOrder(value: SortingOrder): void {
    super.setOrder(value)

    const configurationService = Services.get(WebsiteConfigurationService)

    if (this.categoryId != null) {
      localStorage.setItem(`${this.categoryId}${configurationService.configuration.itemCategorySortOrderStorageKeySuffix}`, this.order.toString())
    } else {
      localStorage.setItem(configurationService.configuration.itemsSortOrderStorageKey, this.order.toString())
    }
  }

  /** {@inheritDoc FilterAndSortingData.setProperty} */
  protected override setProperty(value: string): void {
    super.setProperty(value)

    const configurationService = Services.get(WebsiteConfigurationService)

    if (this.categoryId != null) {
      localStorage.setItem(`${this.categoryId}${configurationService.configuration.itemCategorySortPropertyStorageKeySuffix}`, this.property)
    } else {
      localStorage.setItem(configurationService.configuration.itemsSortPropertyStorageKey, this.property)
    }
  }

  /**
   * Set the property and order based on the last sort used for the item category.
   */
  private setPropertiesFromLastSort(): void {
    const configurationService = Services.get(WebsiteConfigurationService)
    let orderStorageKey: string
    let propertyStorageKey: string

    if (this.categoryId != null) {
      orderStorageKey = `${this.categoryId}${configurationService.configuration.itemCategorySortOrderStorageKeySuffix}`
      propertyStorageKey = `${this.categoryId}${configurationService.configuration.itemCategorySortPropertyStorageKeySuffix}`
    } else {
      orderStorageKey = configurationService.configuration.itemsSortOrderStorageKey
      propertyStorageKey = configurationService.configuration.itemsSortPropertyStorageKey
    }

    const order = localStorage.getItem(orderStorageKey)
    const property = localStorage.getItem(propertyStorageKey)

    if (property != null) {
      this.property = property
    }

    if (order != null) {
      this.order = Number(order)
    }
  }

  /**
   * Sets the sorting function based on the item category ID.
   */
  private setSortingFunctions(): void {
    this.sortingFunctions = Services.get(SortingService).getSortingFunctionsFromItemCategory(this.categoryId)
    this.setPropertiesFromLastSort()

    if (this.sortingFunctions.functions[this.property] == null) {
      this.property = 'name'
    }
  }
}
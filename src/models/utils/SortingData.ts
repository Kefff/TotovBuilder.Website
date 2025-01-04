import { ISortingFunction } from '../../services/sorting/functions/ISortingFunction'
import { ISortingFunctionList } from '../../services/sorting/functions/ISortingFunctionList'
import StringUtils from '../../utils/StringUtils'
import { IItem } from '../item/IItem'
import { IBuildSummary } from './IBuildSummary'
import { SortingOrder } from './SortingOrder'

/**
 * Represents sorting data for items.
 */
export default class SortingData<T extends IBuildSummary | IItem> {
  /**
   * Initializes a new instance of the SortingData class.
   * @param sortingFunctions - Available sorting functions.
   * @param filterAndSortingDataToCopy - Sorting data to copy.
   */
  public constructor(sortingFunctions: ISortingFunctionList, filterAndSortingDataToCopy?: SortingData<T>) {
    this._sortingFunctions = sortingFunctions
    this.setSortableProperties(sortingFunctions)
    this.currentSortingFunction = sortingFunctions.functions[this.property]

    if (filterAndSortingDataToCopy != null) {
      this.currentSortingFunction = filterAndSortingDataToCopy.currentSortingFunction
      this.filter = filterAndSortingDataToCopy.filter
      this.focusFilter = filterAndSortingDataToCopy.focusFilter
      this.order = filterAndSortingDataToCopy.order
      this.property = filterAndSortingDataToCopy.property
    }
  }

  /**
   * Comparison function to used for sorting.
   */
  public currentSortingFunction: ISortingFunction

  /**
   * Filter.
   */
  public filter?: string

  /**
   * Indicates whether the filter field should be focused.
   */
  public focusFilter?: boolean

  /**
   * Sorting order.
   */
  public order = SortingOrder.asc

  /**
   * Property used to sort.
   */
  public property = 'name'

  /**
   * Properties available for sorting.
   */
  public sortableProperties: { name: string, caption: string }[] = []

  /**
   * List of available sorting functions.
   */
  public get sortingFunctions(): ISortingFunctionList {
    return this._sortingFunctions
  }
  protected set sortingFunctions(value) {
    if (value == null) {
      throw new Error('connard')
    }
    this._sortingFunctions = value
    this.setSortableProperties(value)
  }
  private _sortingFunctions: ISortingFunctionList

  /**
   * Sets the properties available for sorting based on the provided sorting functions.
   */
  protected setSortableProperties(sortingFunctions: ISortingFunctionList): void {
    const properties: { name: string, caption: string }[] = []

    for (const propertyName of Object.keys(sortingFunctions.functions)) {
      properties.push({
        name: propertyName,
        caption: `caption.${propertyName}`
      })
    }

    properties.sort((p1, p2) => StringUtils.compare(p1.caption, p2.caption))
    this.sortableProperties = properties
  }
}
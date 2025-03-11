import { ISortingFunction } from '../../services/sorting/functions/ISortingFunction'
import { ISortingFunctionList } from '../../services/sorting/functions/ISortingFunctionList'
import { ItemSortingFunctions } from '../../services/sorting/functions/itemSortingFunctions'
import StringUtils from '../../utils/StringUtils'
import { IItem } from '../item/IItem'
import { IBuildSummary } from './IBuildSummary'
import { SortingOrder } from './SortingOrder'

/**
 * Represents data for filtering and sorting elements.
 */
export default abstract class FilterAndSortingData<T extends IBuildSummary | IItem> {
  /**
   * Initializes a new instance of the FilterAndSortingData class.
   * @param sortingFunctions - Available sorting functions.
   * @param filterAndSortingDataToCopy - Sorting data to copy.
   */
  public constructor(sortingFunctions: ISortingFunctionList, filterAndSortingDataToCopy?: FilterAndSortingData<T>) {
    if (filterAndSortingDataToCopy == null) {
      this.sortingFunctions = sortingFunctions
      this.currentSortingFunction = this._sortingFunctions.functions[this.property]
    } else {
      this.currentSortingFunction = filterAndSortingDataToCopy.currentSortingFunction
      this.filter = filterAndSortingDataToCopy.filter
      this._order = filterAndSortingDataToCopy.order
      this._property = filterAndSortingDataToCopy.property
      this.sortableProperties = filterAndSortingDataToCopy.sortableProperties
      this._sortingFunctions = filterAndSortingDataToCopy.sortingFunctions
    }
  }

  /**
   * Comparison function to used for sorting.
   */
  public currentSortingFunction: ISortingFunction

  /**
   * Filter.
   */
  public filter: string | undefined = undefined

  /**
   * Sorting order.
   */
  public get order(): SortingOrder {
    return this._order
  }
  public set order(value: SortingOrder) {
    this.setOrder(value)
  }
  private _order: SortingOrder = SortingOrder.asc

  /**
   * Property used to sort.
   */
  public get property(): string {
    return this._property
  }
  public set property(value: string) {
    this.setProperty(value)
  }
  private _property: string = 'name'

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
    this._sortingFunctions = value
    this.setSortableProperties(value)
  }
  private _sortingFunctions: ISortingFunctionList = ItemSortingFunctions

  /**
   * Type of filter and sorting data.
   */
  public abstract type: FilterAndSortingDataType

  /**
   * Sets the sorting order.
   * @param value - Sorting order.
   */
  protected setOrder(value: SortingOrder): void {
    if (value !== this._order) {
      this._order = value
    }
  }

  /**
   * Sets the sorting property.
   * @param value - Sorting property.
   */
  protected setProperty(value: string): void {
    this.order = value === this._property ? -this.order : SortingOrder.asc
    this._property = value
    this.currentSortingFunction = this.sortingFunctions.functions[this.property]
  }

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

/**
 * Types of filter and sorting data.
 */
export enum FilterAndSortingDataType {
  'build',
  'item'
}
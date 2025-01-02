import { compareByString } from '../../services/sorting/SortingService'
import { ISortingFunction } from '../../services/sorting/functions/ISortingFunction'
import { ISortingFunctionList } from '../../services/sorting/functions/ISortingFunctionList'
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
  public constructor(sortingFunctions: ISortingFunctionList<T>, filterAndSortingDataToCopy?: SortingData<T>) {
    this.sortingFunctions = sortingFunctions

    if (filterAndSortingDataToCopy != null) {
      this.currentSortingFunction = filterAndSortingDataToCopy.currentSortingFunction
      this.order = filterAndSortingDataToCopy.order
      this.property = filterAndSortingDataToCopy.property
    }
  }

  /**
   * Sorting order.
   */
  public order = SortingOrder.asc

  /**
   * Property used to sort.
   */
  public property = 'name'

  /**
   * List of available sorting functions.
   */
  public sortingFunctions: ISortingFunctionList<T>

  /**
   * Comparison function to used for sorting.
   */
  public currentSortingFunction: ISortingFunction<T> = {
    comparisonFunction: (element1: T, element1Value: string | number, element2: T, element2Value: string | number) => compareByString(element1 as unknown as Record<string, unknown>, element1Value, element2 as unknown as Record<string, unknown>, element2Value),
    comparisonValueObtentionPromise: (element: T) => Promise.resolve(element.name)
  }
}
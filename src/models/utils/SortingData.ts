import { compareByString } from '../../services/sorting/SortingService'
import { ISortingFunction } from '../../services/sorting/functions/ISortingFunction'
import { IItem } from '../item/IItem'
import { IBuildSummary } from './IBuildSummary'
import { SortingOrder } from './SortingOrder'

/**
 * Represents sorting data for items.
 */
export default class SortingData<T extends IBuildSummary | IItem> {
  /**
   * Sorting order.
   */
  public order = SortingOrder.asc

  /**
   * Property used to sort.
   */
  public property = 'name'

  /**
   * Comparison function to used for sorting.
   */
  public sortingFunction: ISortingFunction<T> = {
    comparisonFunction: (element1: T, element1Value: string | number, element2: T, element2Value: string | number) => compareByString(element1 as unknown as Record<string, unknown>, element1Value, element2 as unknown as Record<string, unknown>, element2Value),
    comparisonValueObtentionFunction: (element: T) => Promise.resolve(element.name)
  }
}
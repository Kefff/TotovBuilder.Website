import { compareByString } from '../../services/sorting/ItemSortingService'
import { ISortingFunction } from '../../services/sorting/functions/ISortingFunction'
import { IItem } from '../item/IItem'
import { SortingOrder } from './SortingOrder'

/**
 * Provides the functionalities of sorting data for items.
 */
export default class ItemSortingData {
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
  public sortingFunction: ISortingFunction = {
    comparisonFunction: compareByString,
    comparisonValueObtentionFunction: (item: IItem) => Promise.resolve(item.name)
  }
}
import { compareByString } from '../../services/sorting/SortingService'
import { ISortingFunction } from '../../services/sorting/functions/ISortingFunction'
import { IItem } from '../item/IItem'

/**
 * Prodides the functionalities of data used for sorting.
 */
export default class SortingData {
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

/**
 * Sorting order.
 */
export enum SortingOrder {
  /**
   * Ascendent.
   */
  asc = 1,

  /**
   * Descendant
   */
  desc = -1
}
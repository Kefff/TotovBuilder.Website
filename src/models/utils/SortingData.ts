import { compareByString } from '../../services/sorting/SortingService'
import { ISortingFunction } from '../../services/sorting/functions/ISortingFunction'
import { IItem } from '../item/IItem'

/**
 * Prodides the functionalities of data used for sorting.
 */
export default class SortingData<TItem extends IItem> {
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
  public sortingFunction: ISortingFunction<TItem> = {
    comparisonFunction: compareByString,
    comparisonValueObtentionFunction: async (item: IItem) => item.name
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
import { ItemSortingFunctions } from '../../services/sorting/functions/ItemSortingFunction'
import { IItem } from '../item/IItem'

/**
 * Prodides the functionalities of data used for sorting.
 */
export default class SortingData {
  /**
   * Property used to sort.
   */
  public property = 'name'

  /**
   * Sorting order.
   */
  public order = SortingOrder.asc

  /**
   * Comparison function to used for sorting.
   */
  public comparisonFunction: (item1: IItem, item1ValueToCompare: string | number, item2: IItem, item2ValueToCompare: string | number) => number = ItemSortingFunctions.compareByString

  /**
   * Function for getting the data that will be used to sort. Uses the `property` to retreive the data.
   */
  public getValueToCompareFunction: (item: IItem) => (string | number) | Promise<string | number> = (item: IItem) => item.name
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
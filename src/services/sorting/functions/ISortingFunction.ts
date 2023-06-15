import { IItem } from '../../../models/item/IItem'

/**
 * Provides the functionalities of a sorting function.
 */
export interface ISortingFunction<TItem extends IItem> {
  /**
   * Comparison function.
   * @param item1 - First item. It is required here as the comparison function can use values from the item such as its name or category in addition to item1Value when comparing.
   * @param item1Value - Value from the first item used to compare.
   * @param item2 - Second item. It is required here as the comparison function can use values from the item such as its name or category in addition to item1Value when comparing.
   * @param item2Value - Value from the second item used to compare.
   */
  comparisonFunction: (item1: TItem, item1Value: string | number, item2: TItem, item2Value: string | number) => number

  /**
   * Function for getting the value used to compare.
   * This is required since the value sometimes needs to be gotten using asynchronous operations.
   * Therefore the sorting service needs to asynchronously get values before sorting them.
   * @param item - Item from which the value is gotten.
   */
  comparisonValueObtentionFunction: (item: TItem) => Promise<number | string>
}
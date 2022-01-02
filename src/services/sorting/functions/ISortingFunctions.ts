import { IItem } from '../../../models/item/IItem'

/**
 * Provides the functionalities of a sorting service providing a liste of sorting properties and their associated sorting function.
 */
export interface ISortingFunctions {
  /**
   * List of sorting properties and their associated comparison function.
   */
  comparisonFunctions: { [property: string]: (item1: IItem, item1ValueToCompare: string | number, item2: IItem, item2ValueToCompare: string | number) => number }

  /**
   * List of sorting properties and their associated function used to get the vale that will be used for the comparison.
   */
  getValueToCompareFunctions: { [property: string]: (item: IItem) => (string | number) | Promise<string | number> }
}
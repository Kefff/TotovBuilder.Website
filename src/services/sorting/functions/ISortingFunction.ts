import { IItem } from '../../../models/item/IItem'
import { IBuildSummary } from '../../../models/utils/IBuildSummary'

/**
 * Provides the functionalities of a sorting function.
 */
export interface ISortingFunction {
  /**
   * Comparison function.
   * @param element1 - First element. It is required here as the comparison function can use values from the element such as its name in addition to element1Value when comparing.
   * @param element1Value - Value from the first element used to compare.
   * @param element2 - Second element. It is required here as the comparison function can use values from the element such as its name in addition to element2Value when comparing.
   * @param element2Value - Value from the second element used to compare.
   */
  comparisonFunction: <T extends IBuildSummary | IItem>(element1: T, element1Value: string | number, element2: T, element2Value: string | number) => number

  /**
   * Function for getting the value used to compare.
   * This is required since the value sometimes needs to be gotten using asynchronous operations.
   * Therefore the sorting service needs to asynchronously get values before sorting them.
   * @param element - Element from which the value is gotten.
   */
  comparisonValueObtentionPromise: <T extends IBuildSummary | IItem>(element: T) => Promise<number | string>
}
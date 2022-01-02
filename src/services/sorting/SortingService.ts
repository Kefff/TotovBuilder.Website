import { IItem } from '../../models/item/IItem'
import vueI18n from '../../plugins/vueI18n'
import Result, { FailureType } from '../../utils/Result'
import SortingData from '../../models/utils/SortingData'
import { ISortingFunctions } from './functions/ISortingFunctions'

/**
 * Represents a service responsible for sorting items.
 */
export class SortingService {
  /**
   * Initializes a new instance of the SortingService class.
   * @param sortingFunctions - List of services providing the sorting functions to use.
   */
  constructor(private sortingFunctions: ISortingFunctions[]) { }

  /**
   * Sorts a collection of items according to sorting data.
   * Allows the use of asynchronous comparison functions.
   * @param items - Collection of items.
   * @param sortingData - Sorting data.
   */
  public static async sort(items: IItem[], sortingData: SortingData): Promise<IItem[]> {
    const itemsWithValueToSort = new Array<{ item: IItem, valueToCompare: string | number }>(items.length)

    for (let i = 0; i < items.length; i++) {
      const valueToCompare = await sortingData.getValueToCompareFunction(items[i])
      itemsWithValueToSort[i] = {
        item: items[i],
        valueToCompare
      }
    }

    itemsWithValueToSort.sort((iwvts1, iwvts2) => sortingData.comparisonFunction(iwvts1.item, iwvts1.valueToCompare, iwvts2.item, iwvts2.valueToCompare))
    const result = itemsWithValueToSort.map(iwvts => iwvts.item)

    return result
  }

  /**
   * Updates sorting data by setting the sorting property, the new sorting order and the associated comparison function.
   * @param sortingData - Sorting data to update.
   * @param newProperty - New sorting property.
   * @returns Updated sorting data.
   */
  public setSortingProperty(sortingData: SortingData, newSortingProperty: string): Result<SortingData> {
    const newSortingData = new SortingData()
    newSortingData.property = newSortingProperty

    for (const sortingFunction of this.sortingFunctions) {
      const getValueToCompareFunction = sortingFunction.getValueToCompareFunctions[newSortingProperty]
      const comparisonFunction = sortingFunction.comparisonFunctions[newSortingProperty]

      if (comparisonFunction !== undefined && getValueToCompareFunction !== undefined) {
        if (sortingData.property === newSortingProperty) {
          newSortingData.order = -sortingData.order
        }

        newSortingData.comparisonFunction = (item1: IItem, item1ValueToCompare: string | number, item2: IItem, item2ValueToCompare: string | number) => comparisonFunction(item1, item1ValueToCompare, item2, item2ValueToCompare) * newSortingData.order
        newSortingData.getValueToCompareFunction = getValueToCompareFunction

        return Result.ok(newSortingData)
      }
    }

    return Result.fail(
      FailureType.error,
      'OptionSortingService.getSortingFunction()',
      vueI18n.t('message.sortingFunctionNotFound', { property: newSortingProperty }))
  }
}
import { IItem } from '../../models/item/IItem'
import SortingData, { SortingOrder } from '../../models/utils/SortingData'
import StringUtils from '../../utils/StringUtils'
import { LogService } from '../LogService'
import Services from '../repository/Services'
import { ISortingFunctionList } from './functions/ISortingFunctionList'

/**
 * Represents a service responsible for sorting items.
 */
export class SortingService<TItem extends IItem> {
  /**
   * Sorting data.
   * By default, sorts by name.
   */
  private sortingData = new SortingData<TItem>()

  /**
   * Initializes a new instance of the SortingService class.
   * @param sortingFunctions - Sorting functions to use.
   */
  constructor(private sortingFunctions: ISortingFunctionList<TItem>) { }

  /**
   * Sorts a collection of items according to sorting data.
   * Allows the use of asynchronous comparison functions.
   * @param items - Collection of items.
   * @param sortingData - Sorting data.
   */
  public static async sort<TItem extends IItem>(items: TItem[], sortingData: SortingData<TItem>): Promise<TItem[]> {
    const itemsWithSortingValue = await Promise.all(items.map(i => SortingService.getItemAndSortingValue(i, sortingData)))
    itemsWithSortingValue.sort((iwsv1, iwsv2) => sortingData.sortingFunction.comparisonFunction(iwsv1.item, iwsv1.value, iwsv2.item, iwsv2.value))
    const result = itemsWithSortingValue.map(iwsv1 => iwsv1.item)

    return result
  }

  /**
   * Gets an item and its sorting value.
   * @param item - Item.
   * @returns Item and its sorting value.
   */
  private static async getItemAndSortingValue<TItem extends IItem>(item: TItem, sortingData: SortingData<TItem>): Promise<{ item: TItem, value: number | string }> {
    const value = await sortingData.sortingFunction.comparisonValueObtentionFunction(item)

    return { item, value }
  }

  /**
   * Updates sorting data by setting the sorting property, the new sorting order and the associated comparison function.
   * @param property - Property that will be used to sort.
   * @returns Updated sorting data.
   */
  public setSortingProperty(property: string): SortingData<TItem> | undefined {
    const sortingFunction = this.sortingFunctions[property]

    if (sortingFunction == null) {
      Services.get(LogService).logError('message.sortingFunctionNotFound', { property: property })

      return undefined
    }

    const order = this.sortingData.property === property ? -this.sortingData.order : SortingOrder.asc

    this.sortingData = new SortingData<TItem>()
    this.sortingData.property = property
    this.sortingData.order = order
    this.sortingData.sortingFunction.comparisonFunction = (item1: TItem, item1ValueToCompare: string | number, item2: TItem, item2ValueToCompare: string | number) => {
      return sortingFunction.comparisonFunction(item1, item1ValueToCompare, item2, item2ValueToCompare) * this.sortingData.order
    }
    this.sortingData.sortingFunction.comparisonValueObtentionFunction = sortingFunction.comparisonValueObtentionFunction

    return this.sortingData
  }
}

/**
 * Compare items by category.
 * @param item1 - First item.
 * @param item2 - Second item.
 * @returns Comparison value.
 */
export function compareByCategory(item1: IItem, item2: IItem): number {
  return StringUtils.compare(item1.categoryId, item2.categoryId)
}

/**
 * Compare items by category and name.
 * @param item1 - First item.
 * @param item2 - Second item.
 * @returns Comparison value.
 */
export function compareByName(item1: IItem, item2: IItem): number {
  return StringUtils.compare(item1.name, item2.name)
}

/**
* Compares items by a a property of type number.
* @param item1 - First item.
* @param item1ValueToCompare - Number value obtained from the first item used to compare.
* @param item2 - Second item.
* @param item2ValueToCompare - Number value obtained from the first item used to compare.
* @returns Comparison value.
*/
export function compareByNumber(item1: IItem, item1ValueToCompare: string | number, item2: IItem, item2ValueToCompare: string | number): number {
  let comparisonValue = compareByCategory(item1, item2)

  if (comparisonValue === 0) {
    comparisonValue = (item1ValueToCompare as number ?? 0) - (item2ValueToCompare as number ?? 0)
  }

  if (comparisonValue === 0) {
    comparisonValue = compareByName(item1, item2)
  }

  return comparisonValue
}

/**
 * Compares items by a property of type string.
 * @param item1 - First item.
 * @param item1ValueToCompare - String value obtained from the first item used to compare.
 * @param item2 - Second item.
 * @param item2ValueToCompare - String value obtained from the second item used to compare.
 * @returns Comparison value.
 */
export function compareByString(item1: IItem, item1ValueToCompare: string | number, item2: IItem, item2ValueToCompare: string | number): number {
  let comparisonValue = compareByCategory(item1, item2)

  if (comparisonValue === 0) {
    comparisonValue = StringUtils.compare(item1ValueToCompare as string, item2ValueToCompare as string)
  }

  if (comparisonValue === 0) {
    comparisonValue = compareByName(item1, item2)
  }

  return comparisonValue
}
import { IItem } from '../../models/item/IItem'
import ItemSortingData from '../../models/utils/ItemSortingData'
import { SortingOrder } from '../../models/utils/SortingOrder'
import StringUtils from '../../utils/StringUtils'
import { LogService } from '../LogService'
import Services from '../repository/Services'
import { ISortingFunctionList } from './functions/ISortingFunctionList'

/**
 * Represents a service responsible for sorting items.
 */
export class ItemSortingService {
  /**
   * Sorts a collection of items according to sorting data.
   * Allows the use of asynchronous comparison functions.
   * @param items - Collection of items.
   * @param sortingData - Sorting data.
   */
  public async sort<TItem extends IItem>(items: TItem[], sortingData: ItemSortingData): Promise<TItem[]> {
    const itemsWithSortingValue = await Promise.all(items.map(i => this.getItemAndSortingValue(i, sortingData)))
    itemsWithSortingValue.sort((iwsv1, iwsv2) => sortingData.sortingFunction.comparisonFunction(iwsv1.item, iwsv1.value, iwsv2.item, iwsv2.value))
    const result = itemsWithSortingValue.map(iwsv1 => iwsv1.item)

    return result
  }

  /**
   * Updates sorting data by setting the sorting property, the new sorting order and the associated comparison function.
   * @param property - Property that will be used to sort.
   * @returns Updated sorting data.
   */
  public setSortingProperty(sortingData: ItemSortingData, sortingFunctions: ISortingFunctionList, property: string): ItemSortingData | undefined {
    const sortingFunction = sortingFunctions[property]

    if (sortingFunction == null) {
      Services.get(LogService).logError('message.sortingFunctionNotFound', { property: property })

      return undefined
    }

    sortingData.order = sortingData.property === property ? -sortingData.order : SortingOrder.asc
    sortingData.property = property
    sortingData.sortingFunction.comparisonFunction = (item1: IItem, item1ValueToCompare: string | number, item2: IItem, item2ValueToCompare: string | number) => {
      return sortingFunction.comparisonFunction(item1, item1ValueToCompare, item2, item2ValueToCompare) * sortingData.order
    }
    sortingData.sortingFunction.comparisonValueObtentionFunction = sortingFunction.comparisonValueObtentionFunction

    return sortingData
  }

  /**
   * Gets an item and its sorting value.
   * @param item - Item.
   * @returns Item and its sorting value.
   */
  private async getItemAndSortingValue<TItem extends IItem>(item: TItem, sortingData: ItemSortingData): Promise<{ item: TItem, value: number | string }> {
    const value = await sortingData.sortingFunction.comparisonValueObtentionFunction(item)

    return { item, value }
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
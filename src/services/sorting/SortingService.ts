import { IItem } from '../../models/item/IItem'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import SortingData from '../../models/utils/SortingData'
import { SortingOrder } from '../../models/utils/SortingOrder'
import StringUtils from '../../utils/StringUtils'
import { LogService } from '../LogService'
import Services from '../repository/Services'
import ISortingFunctionList from './functions/ISortingFunctionList'

/**
 * Represents a service responsible for sorting elements.
 */
export class SortingService {
  /**
   * Sorts a collection of items according to sorting data.
   * Allows the use of asynchronous comparison functions.
   * @param elements - Collection of items.
   * @param sortingData - Sorting data.
   */
  public async sort<T extends IBuildSummary | IItem>(elements: T[], sortingData: SortingData<T>): Promise<T[]> {
    const elementWithSortingValue = await Promise.all(elements.map(e => this.getElementAndSortingValue(e, sortingData)))
    elementWithSortingValue.sort((ewsv1, ewsv2) => sortingData.sortingFunction.comparisonFunction(ewsv1.element, ewsv1.value, ewsv2.element, ewsv2.value))
    const result = elementWithSortingValue.map(ewsv => ewsv.element)

    return result
  }

  /**
   * Updates sorting data by setting the sorting property, the new sorting order and the associated comparison function.
   * @param property - Property that will be used to sort.
   * @returns Updated sorting data.
   */
  public setSortingProperty<T extends IBuildSummary | IItem>(
    sortingData: SortingData<T>,
    sortingFunctions: ISortingFunctionList<T>,
    property: string,
    order?: SortingOrder): SortingData<T> {
    const sortingFunction = sortingFunctions[property]

    if (sortingFunction == null) {
      Services.get(LogService).logError('message.sortingFunctionNotFound', { property: property })

      return sortingData
    }

    if (order != null) {
      sortingData.order = order
    } else {
      sortingData.order = sortingData.property === property ? -sortingData.order : SortingOrder.asc
    }

    sortingData.property = property
    sortingData.sortingFunction.comparisonFunction = (element1: T, element1Value: string | number, element2: T, element2Value: string | number) => {
      return sortingFunction.comparisonFunction(element1, element1Value, element2, element2Value) * sortingData.order
    }
    sortingData.sortingFunction.comparisonValueObtentionFunction = sortingFunction.comparisonValueObtentionFunction

    return sortingData
  }

  /**
   * Gets an element and its sorting value.
   * @param element - Element.
   * @returns Element and its sorting value.
   */
  private async getElementAndSortingValue<T extends IBuildSummary | IItem>(element: T, sortingData: SortingData<T>): Promise<{ element: T, value: number | string }> {
    const value = await sortingData.sortingFunction.comparisonValueObtentionFunction(element)

    return { element, value }
  }
}

/**
 * Compares elements by category and name.
 * @param element - First element.
 * @param element - Second element.
 * @returns Comparison value.
 */
export function compareByElementName(element1: Record<string, unknown>, element2: Record<string, unknown>): number {
  return StringUtils.compare(element1.name as string, element2.name as string)
}

/**
 * Compares items by category.
 * @param item1 - First item.
 * @param item2 - Second item.
 * @returns Comparison value.
 */
export function compareByItemCategory(item1: IItem, item2: IItem): number {
  return StringUtils.compare(item1.categoryId, item2.categoryId)
}

/**
 * Compares items by category, a property of type number and name.
 * @param item1 - First item.
 * @param item1Value - Number value obtained from the first item used to compare.
 * @param item2 - Second item.
 * @param item2Value - Number value obtained from the second item used to compare.
 * @returns Comparison value.
 */
export function compareByItemNumber(item1: IItem, item1Value: string | number, item2: IItem, item2Value: string | number): number {
  let comparisonValue = compareByItemCategory(item1, item2)

  if (comparisonValue === 0) {
    comparisonValue = compareByNumber(item1 as unknown as Record<string, unknown>, item1Value, item2 as unknown as Record<string, unknown>, item2Value)
  }

  return comparisonValue
}

/**
 * Compares items by category, a property of type string and name.
 * @param item1 - First item.
 * @param item1Value - String value obtained from the first item used to compare.
 * @param item2 - Second item.
 * @param item2Value - String value obtained from the second item used to compare.
 * @returns Comparison value.
 */
export function compareByItemString(item1: IItem, item1Value: string | number, item2: IItem, item2Value: string | number): number {
  let comparisonValue = compareByItemCategory(item1, item2)

  if (comparisonValue === 0) {
    comparisonValue = compareByString(item1 as unknown as Record<string, unknown>, item1Value, item2 as unknown as Record<string, unknown>, item2Value)
  }

  return comparisonValue
}

/**
* Compares elements by a property of type number and by name.
* @param element1 - First element.
* @param element1Value - Number value obtained from the first element used to compare.
* @param element2 - Second element.
* @param element2Value - Number value obtained from the second element used to compare.
* @returns Comparison value.
*/
export function compareByNumber(element1: Record<string, unknown>, element1Value: string | number, element2: Record<string, unknown>, element2Value: string | number): number {
  let comparisonValue = (element1Value as number ?? 0) - (element2Value as number ?? 0)

  if (comparisonValue === 0) {
    comparisonValue = compareByElementName(element1, element2)
  }

  return comparisonValue
}

/**
 * Compares elements by a property of type string and by name.
 * @param element1 - First element.
 * @param element1Value - String value obtained from the first element used to compare.
 * @param element2 - Second element.
 * @param element2Value - String value obtained from the second element used to compare.
 * @returns Comparison value.
 */
export function compareByString(element1: Record<string, unknown>, element1Value: string | number, element2: Record<string, unknown>, element2Value: string | number): number {
  let comparisonValue = StringUtils.compare(element1Value as string, element2Value as string)

  if (comparisonValue === 0) {
    comparisonValue = compareByElementName(element1, element2)
  }

  return comparisonValue
}
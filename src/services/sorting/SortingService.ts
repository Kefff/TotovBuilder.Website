import { IItem, ItemCategoryId } from '../../models/item/IItem'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import SortingData from '../../models/utils/SortingData'
import { SortingOrder } from '../../models/utils/SortingOrder'
import StringUtils from '../../utils/StringUtils'
import { LogService } from '../LogService'
import Services from '../repository/Services'
import { AmmunitionSortingFunctions } from './functions/AmmunitionSortingFunctions'
import { ArmorModSortingFunctions } from './functions/ArmorModSortingFunctions'
import { ArmorSortingFunctions } from './functions/ArmorSortingFunctions'
import { BackpackSortingFunctions } from './functions/BackpackSortingFunctions'
import { ContainerSortingFunctions } from './functions/ContainerSortingFunctions'
import { EyewearSortingFunctions } from './functions/EyewearSortingFunctions'
import { GrenadeSortingFunctions } from './functions/GrenadeSortingFunctions'
import { HeadwearSortingFunctions } from './functions/HeadwearSortingFunctions'
import { IItemSortingFunctionList, ISortingFunctionList } from './functions/ISortingFunctionList'
import { ItemSortingFunctions } from './functions/ItemSortingFunctions'
import { MagazineSortingFunctions } from './functions/MagazineSortingFunctions'
import { MeleeWeaponSortingFunctions } from './functions/MeleeWeaponSortingFunctions'
import { ModSortingFunctions } from './functions/ModSortingFunctions'
import { RangedWeaponModSortingFunctions } from './functions/RangedWeaponModSortingFunctions'
import { RangedWeaponSortingFunctions } from './functions/RangedWeaponSortingFunctions'
import { VestSortingFunctions } from './functions/VestSortingFunctions'
import { WearableSortingFunctions } from './functions/WearableSortingFunctions'

/**
 * Represents a service responsible for sorting elements.
 */
export class SortingService {
  /**
   * Gets the sorting functions for sorting the specified category of item.
   * @param itemCategoryId - Item category. When not set, basic item sorting functions are returned.
   * @returns Sorting functions.
   */
  public getSortingFunctionsFromItemCategory(itemCategoryId: ItemCategoryId | undefined = undefined): IItemSortingFunctionList {
    if (itemCategoryId == null) {
      return ItemSortingFunctions
    }

    const sortingFunctions = [
      AmmunitionSortingFunctions,
      ArmorModSortingFunctions,
      ArmorSortingFunctions,
      BackpackSortingFunctions,
      ContainerSortingFunctions,
      EyewearSortingFunctions,
      GrenadeSortingFunctions,
      HeadwearSortingFunctions,
      ItemSortingFunctions,
      MagazineSortingFunctions,
      MeleeWeaponSortingFunctions,
      ModSortingFunctions,
      RangedWeaponModSortingFunctions,
      RangedWeaponSortingFunctions,
      VestSortingFunctions,
      WearableSortingFunctions
    ]
    const sortingFunctionsForItemType = sortingFunctions.find(sf => sf.itemCategoryIds.includes(itemCategoryId))

    return sortingFunctionsForItemType as IItemSortingFunctionList
  }

  /**
   * Sorts a collection of items according to sorting data.
   * Allows the use of asynchronous comparison functions.
   * @param elements - Collection of items.
   * @param sortingData - Sorting data.
   */
  public async sortAsync<T extends IBuildSummary | IItem>(elements: T[], sortingData: SortingData<T>): Promise<T[]> {
    const elementWithSortingValue = await Promise.all(elements.map(e => this.getElementAndSortingValueAsync(e, sortingData)))
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
    const sortingFunction = sortingFunctions.functions[property]

    if (sortingFunction == null) {
      Services.get(LogService).logError('message.sortingFunctionNotFound', { property: property })

      return sortingData
    }

    const updatedSortingData = { ...sortingData } // To avoid mutating models which prevents them to be updated and trigger sorting

    if (order != null) {
      updatedSortingData.order = order
    } else {
      updatedSortingData.order = updatedSortingData.property === property ? -sortingData.order : SortingOrder.asc
    }

    updatedSortingData.property = property
    updatedSortingData.sortingFunction.comparisonFunction = (element1: T, element1Value: string | number, element2: T, element2Value: string | number): number => {
      return sortingFunction.comparisonFunction(element1, element1Value, element2, element2Value) * updatedSortingData.order
    }
    updatedSortingData.sortingFunction.comparisonValueObtentionPromise = sortingFunction.comparisonValueObtentionPromise

    return updatedSortingData
  }

  /**
   * Gets an element and its sorting value.
   * @param element - Element.
   * @returns Element and its sorting value.
   */
  private async getElementAndSortingValueAsync<T extends IBuildSummary | IItem>(element: T, sortingData: SortingData<T>): Promise<{ element: T, value: number | string }> {
    const value = await sortingData.sortingFunction.comparisonValueObtentionPromise(element)

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
  const comparisonValue = compareByString(item1 as unknown as Record<string, unknown>, item1.categoryId, item2 as unknown as Record<string, unknown>, item2.categoryId)

  return comparisonValue
}

/**
 * Compares items by a property of type number and name.
 * @param item1 - First item.
 * @param item1Value - Number value obtained from the first item used to compare.
 * @param item2 - Second item.
 * @param item2Value - Number value obtained from the second item used to compare.
 * @returns Comparison value.
 */
export function compareByItemNumber(item1: IItem, item1Value: string | number, item2: IItem, item2Value: string | number): number {
  const comparisonValue = compareByNumber(item1 as unknown as Record<string, unknown>, item1Value, item2 as unknown as Record<string, unknown>, item2Value)

  return comparisonValue
}

/**
 * Compares items by a property of type string and name.
 * @param item1 - First item.
 * @param item1Value - String value obtained from the first item used to compare.
 * @param item2 - Second item.
 * @param item2Value - String value obtained from the second item used to compare.
 * @returns Comparison value.
 */
export function compareByItemString(item1: IItem, item1Value: string | number, item2: IItem, item2Value: string | number): number {
  const comparisonValue = compareByString(item1 as unknown as Record<string, unknown>, item1Value, item2 as unknown as Record<string, unknown>, item2Value)

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
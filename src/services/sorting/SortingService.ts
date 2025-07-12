import { IItem, ItemCategoryId } from '../../models/item/IItem'
import FilterAndSortingData from '../../models/utils/FilterAndSortingData'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import StringUtils from '../../utils/StringUtils'
import { IItemSortingFunctionList } from './functions/ISortingFunctionList'
import {
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
} from './functions/itemSortingFunctions'

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
    let sortingFunctionsForCategory = sortingFunctions.find(sf => sf.itemCategoryIds.includes(itemCategoryId))

    if (sortingFunctionsForCategory == null) {
      sortingFunctionsForCategory = ItemSortingFunctions
    }

    return sortingFunctionsForCategory as IItemSortingFunctionList
  }

  /**
   * Sorts elements based on sorting data.
   * @param elements - Elements to sort.
   * @param sortingData - Sorting data.
   * @returns Sorted elements.
   */
  public async sortAsync<TElement extends IBuildSummary | IItem>(elements: TElement[], sortingData: FilterAndSortingData<TElement>): Promise<TElement[]> {
    const elementsWithSortingValue = await Promise.all(elements.map(e => this.getElementAndSortingValueAsync(e, sortingData)))
    elementsWithSortingValue.sort((ewsv1, ewsv2) => sortingData.currentSortingFunction.comparisonFunction(ewsv1.element, ewsv1.value, ewsv2.element, ewsv2.value) * sortingData.order)
    const result = elementsWithSortingValue.map(ewsv => ewsv.element)

    return result
  }

  /**
   * Gets an element and its sorting value.
   * @param element - Element.
   * @returns Element and its sorting value.
   */
  private async getElementAndSortingValueAsync<TElement extends IBuildSummary | IItem, TSortingData extends FilterAndSortingData<IBuildSummary> | FilterAndSortingData<IItem>>(element: TElement, sortingData: TSortingData): Promise<{ element: TElement, value: number | string }> {
    const value = await sortingData.currentSortingFunction.comparisonValueObtentionPromise(element)

    return { element, value }
  }
}

/**
 * Compares elements by category and name.
 * @param element - First element.
 * @param element - Second element.
 * @returns Comparison value.
 */
export function compareByElementName(element1: object, element2: object): number {
  const el1 = element1 as Record<string, unknown>
  const el2 = element2 as Record<string, unknown>
  const result = StringUtils.compare(el1.name as string, el2.name as string)

  return result
}

/**
* Compares elements by a property of type number and by name.
* @param element1 - First element.
* @param element1Value - Number value obtained from the first element used to compare.
* @param element2 - Second element.
* @param element2Value - Number value obtained from the second element used to compare.
* @returns Comparison value.
*/
export function compareByNumber(element1: object, element1Value: string | number, element2: object, element2Value: string | number): number {
  let comparisonValue = (element1Value as number) - (element2Value as number)

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
export function compareByString(element1: object, element1Value: string | number, element2: object, element2Value: string | number): number {
  let comparisonValue = StringUtils.compare(element1Value as string, element2Value as string)

  if (comparisonValue === 0) {
    comparisonValue = compareByElementName(element1, element2)
  }

  return comparisonValue
}
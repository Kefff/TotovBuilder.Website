import { IItem, ItemCategoryId } from '../../models/item/IItem'
import FilterAndSortingData from '../../models/utils/FilterAndSortingData'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { SortingOrder } from '../../models/utils/SortingOrder'
import StringUtils from '../../utils/StringUtils'
import { LogService } from '../LogService'
import Services from '../repository/Services'
import { IItemSortingFunctionList } from './functions/ISortingFunctionList'
import { AmmunitionSortingFunctions, ArmorModSortingFunctions, ArmorSortingFunctions, BackpackSortingFunctions, ContainerSortingFunctions, EyewearSortingFunctions, GrenadeSortingFunctions, HeadwearSortingFunctions, ItemSortingFunctions, MagazineSortingFunctions, MeleeWeaponSortingFunctions, ModSortingFunctions, RangedWeaponModSortingFunctions, RangedWeaponSortingFunctions, VestSortingFunctions, WearableSortingFunctions } from './functions/ItemSortingFunctions'

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

  public async sortAsync<TElement extends IBuildSummary | IItem>(elements: TElement[], sortingData: FilterAndSortingData<TElement>): Promise<TElement[]> {
    const elementsWithSortingValue = await Promise.all(elements.map(e => this.getElementAndSortingValueAsync(e, sortingData)))
    elementsWithSortingValue.sort((ewsv1, ewsv2) => sortingData.currentSortingFunction.comparisonFunction(ewsv1.element, ewsv1.value, ewsv2.element, ewsv2.value) * sortingData.order)
    const result = elementsWithSortingValue.map(ewsv => ewsv.element)

    return result
  }

  /**
   * Updates sorting data by setting the sorting property, the new sorting order and the associated comparison function.
   * @param sortingData - Sorting data to update.
   * @param property - Property.
   * @param order - Order.
   */
  public setSortingProperty(sortingData: FilterAndSortingData<IBuildSummary>, property: string, order?: SortingOrder): void
  public setSortingProperty(sortingData: FilterAndSortingData<IItem>, property: string, order?: SortingOrder): void
  public setSortingProperty<T extends IBuildSummary | IItem>(sortingData: FilterAndSortingData<T>, property: string, order?: SortingOrder): void {
    const sortingFunction = sortingData.sortingFunctions.functions[property]

    if (sortingFunction == null) {
      Services.get(LogService).logError('message.sortingFunctionNotFound', { property: property })

      return
    }

    sortingData.currentSortingFunction = sortingFunction

    if (order != null) {
      sortingData.order = order
    } else {
      sortingData.order = sortingData.property === property ? -sortingData.order : SortingOrder.asc
    }

    sortingData.property = property
    sortingData.currentSortingFunction.comparisonValueObtentionPromise = sortingFunction.comparisonValueObtentionPromise
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
  return StringUtils.compare(el1.name as string, el2.name as string)
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
export function compareByString(element1: object, element1Value: string | number, element2: object, element2Value: string | number): number {
  let comparisonValue = StringUtils.compare(element1Value as string, element2Value as string)

  if (comparisonValue === 0) {
    comparisonValue = compareByElementName(element1, element2)
  }

  return comparisonValue
}
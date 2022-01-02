import { IItem } from '../../../models/item/IItem'
import StringUtils from '../../../utils/StringUtils'
import { InventoryItemService } from '../../InventoryItemService'
import Services from '../../repository/Services'
import { ISortingFunctions } from './ISortingFunctions'

/**
 * Represents a collection of functions for sorting items.
 */
export class ItemSortingFunctions implements ISortingFunctions {
  /**
   * {@inheritDoc ISortingFunctions.comparisonFunctions}
   */
  public comparisonFunctions: { [property: string]: (item1: IItem, item1ValueToCompare: string | number, item2: IItem, item2ValueToCompare: string | number) => number } = {
    caption: ItemSortingFunctions.compareByString,
    categoryId: (item1, item1ValueToCompare, item2) => ItemSortingFunctions.compareByCategory(item1, item2),
    price: ItemSortingFunctions.compareByNumber
  }

  /**
   * {@inheritDoc ISortingFunctions.comparisonFunctions}
   */
  public getValueToCompareFunctions: { [property: string]: (item: IItem) => (string | number) | Promise<string | number> } = {
    caption: (item: IItem) => item.caption,
    categoryId: (item: IItem) => item.categoryId,
    price: (item: IItem) => ItemSortingFunctions.getPrice(item)
  }

  /**
   * Compares items by category, a number and a caption.
   * @param property - Name of the number property used for comparison.
   * @param item1 - First item.
   * @param item1ValueToCompare - Number value obtained from the first item used to compare.
   * @param item2 - Second item.
   * @param item2ValueToCompare - Number value obtained from the first item used to compare.
   * @returns Comparison value.
   */
  public static compareByNumber(item1: IItem, item1ValueToCompare: string | number, item2: IItem, item2ValueToCompare: string | number): number {
    let comparisonValue = ItemSortingFunctions.compareByCategory(item1, item2)

    if (comparisonValue === 0) {
      comparisonValue = (item1ValueToCompare as number) - (item2ValueToCompare as number)
    }

    if (comparisonValue === 0) {
      comparisonValue = ItemSortingFunctions.compareByCaption(item1, item2)
    }

    return comparisonValue
  }

  /**
   * Compares items by category, a string and a caption.
   * @param item1 - First item.
   * @param item1ValueToCompare - String value obtained from the first item used to compare.
   * @param item2 - Second item.
   * @param item2ValueToCompare - String value obtained from the second item used to compare.
   * @returns Comparison value.
   */
  public static compareByString(item1: IItem, item1ValueToCompare: string | number, item2: IItem, item2ValueToCompare: string | number): number {
    let comparisonValue = ItemSortingFunctions.compareByCategory(item1, item2)

    if (comparisonValue === 0) {
      comparisonValue = StringUtils.compare(item1ValueToCompare as string, item2ValueToCompare as string)
    }

    if (comparisonValue === 0) {
      comparisonValue = ItemSortingFunctions.compareByCaption(item1, item2)
    }

    return comparisonValue
  }

  /**
   * Compare items by category and caption.
   * @param item1 - First item.
   * @param item2 - Second item.
   * @returns Comparison value.
   */
  private static compareByCaption(item1: IItem, item2: IItem): number {
    return StringUtils.compare(item1.caption, item2.caption)
  }

  /**
   * Compare items by category.
   * @param item1 - First item.
   * @param item2 - Second item.
   * @returns Comparison value.
   */
  private static compareByCategory(item1: IItem, item2: IItem): number {
    return StringUtils.compare(item1.categoryId, item2.categoryId)
  }

  /**
   * Gets the price of an item to compare.
   * @param item - Item.
   * @returns Price.
   */
  private static async getPrice(item: IItem): Promise<number> {
    const inventoryItemService = Services.get(InventoryItemService)
    const priceResult = await inventoryItemService.getPrice({
      content: [],
      itemId: item.id,
      modSlots: [],
      quantity: 1
    })

    return priceResult.success ? priceResult.value.unitPrice.valueInMainCurrency : 0
  }
}
import { IItem } from '../../../models/item/IItem'
import { InventoryItemService } from '../../InventoryItemService'
import Services from '../../repository/Services'
import { compareByCategory, compareByNumber, compareByString } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting items.
 */
export const ItemSortingFunctions: ISortingFunctionList<IItem> = {
  categoryId: {
    comparisonFunction: (item1: IItem, item1Value: string | number, item2: IItem) => compareByCategory(item1, item2),
    comparisonValueObtentionFunction: async () => ''
  },
  name: {
    comparisonFunction: compareByString,
    comparisonValueObtentionFunction: async (item: IItem) => item.name
  },
  price: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => await getPrice(i)
  }
}

/**
 * Gets the price of an item to compare.
 * @param item - Item.
 * @returns Price.
 */
async function getPrice(item: IItem): Promise<number> {
  const inventoryItemService = Services.get(InventoryItemService)
  const priceResult = await inventoryItemService.getPrice({
    content: [],
    ignorePrice: false,
    itemId: item.id,
    modSlots: [],
    quantity: 1
  })

  return priceResult.success ? priceResult.value.unitPrice.valueInMainCurrency : 0
}
import { IItem } from '../../../models/item/IItem'
import { InventoryItemService } from '../../InventoryItemService'
import Services from '../../repository/Services'
import { compareByItemNumber, compareByItemString, compareByString } from '../SortingService'
import { ISortingFunctionList } from './SortingFunctionList'

/**
 * Functions for sorting items.
 */
export const ItemSortingFunctions: ISortingFunctionList<IItem> = {
  categoryId: {
    comparisonFunction: (i1, i1v, i2, i2v) => compareByString(i1 as unknown as Record<string, unknown>, i1v, i2 as unknown as Record<string, unknown>, i2v),
    comparisonValueObtentionFunction: i => Promise.resolve(i.categoryId)
  },
  name: {
    comparisonFunction: compareByItemString,
    comparisonValueObtentionFunction: i => Promise.resolve(i.name)
  },
  price: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: async i => await getPrice(i)
  }
}

/**
 * Gets the price of an item to compare.
 * @param item - Item.
 * @returns Price.
 */
async function getPrice(item: IItem): Promise<number> {
  const inventoryItemService = Services.get(InventoryItemService)
  const price = await inventoryItemService.getPrice({
    content: [],
    ignorePrice: false,
    itemId: item.id,
    modSlots: [],
    quantity: 1
  })

  return price.unitPrice.valueInMainCurrency
}
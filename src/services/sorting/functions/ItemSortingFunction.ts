import { IItem } from '../../../models/item/IItem'
import { InventoryItemService } from '../../InventoryItemService'
import Services from '../../repository/Services'
import { compareByCategory, compareByNumber, compareByString } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting items.
 */
export const ItemSortingFunctions: ISortingFunctionList = {
  categoryId: {
    comparisonFunction: (item1: IItem, item1Value: string | number, item2: IItem) => compareByCategory(item1, item2),
    comparisonValueObtentionFunction: () => Promise.resolve('')
  },
  name: {
    comparisonFunction: compareByString,
    comparisonValueObtentionFunction: i => Promise.resolve(i.name)
  },
  price: {
    comparisonFunction: compareByNumber,
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
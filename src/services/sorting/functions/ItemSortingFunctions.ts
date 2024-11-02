import { IItem, ItemCategoryId } from '../../../models/item/IItem'
import { InventoryItemService } from '../../InventoryItemService'
import Services from '../../repository/Services'
import { compareByItemNumber, compareByItemString } from '../SortingService'
import { IItemSortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting items.
 */
export const ItemSortingFunctions: IItemSortingFunctionList = {
  itemCategoryIds: [
    ItemCategoryId.armband,
    ItemCategoryId.currency,
    ItemCategoryId.faceCover,
    ItemCategoryId.headphones,
    ItemCategoryId.other,
    ItemCategoryId.special
  ],
  functions: {
    categoryId: {
      comparisonFunction: (i1, i1v, i2, i2v) => compareByItemString(i1, i1v, i2, i2v),
      comparisonValueObtentionPromise: i => Promise.resolve(i.categoryId)
    },
    name: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemString(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(i.name)
    },
    price: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: async i => await getPriceAsync(i)
    },
    weight: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(i.weight)
    }
  }
}

/**
 * Gets the price of an item to compare.
 * @param item - Item.
 * @returns Price.
 */
async function getPriceAsync(item: IItem): Promise<number> {
  const inventoryItemService = Services.get(InventoryItemService)
  const price = await inventoryItemService.getPriceAsync({
    content: [],
    ignorePrice: false,
    itemId: item.id,
    modSlots: [],
    quantity: 1
  })

  return price.unitPrice.valueInMainCurrency
}
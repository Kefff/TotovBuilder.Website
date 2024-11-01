import { IArmor } from '../../../models/item/IArmor'
import { ItemCategoryId } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import { IItemSortingFunctionList } from './ISortingFunctionList'
import { WearableSortingFunctions } from './WearableSortingFunctions'

/**
 * Functions for sorting armors.
 */
export const ArmorSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...WearableSortingFunctions.functions,
    armorClass: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve((i as IArmor).armorClass)
    },
    durability: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve((i as IArmor).durability)
    }
  },
  itemCategoryIds: [ItemCategoryId.armor]
}
import { ItemCategoryId } from '../../../models/item/IItem'
import { IMod } from '../../../models/item/IMod'
import { compareByItemNumber } from '../SortingService'
import { IItemSortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunctions'


/**
 * Functions for sorting mods.
 */
export const ModSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    ergonomicsModifier: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IMod).ergonomicsModifier)
    }
  },
  itemCategoryIds: [ItemCategoryId.mod]
}
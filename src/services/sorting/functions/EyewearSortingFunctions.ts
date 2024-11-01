import { IEyewear } from '../../../models/item/IEyewear'
import { ItemCategoryId } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import { IItemSortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunctions'
/**
 * Functions for sorting eyewear.
 */
export const EyewearSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    blindnessProtectionPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve((i as IEyewear).blindnessProtectionPercentage)
    }
  },
  itemCategoryIds: [ItemCategoryId.eyewear]
}
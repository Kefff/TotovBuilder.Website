import { ItemCategoryId } from '../../../models/item/IItem'
import { IMagazine } from '../../../models/item/IMagazine'
import { compareByItemNumber } from '../SortingService'
import { ContainerSortingFunctions } from './ContainerSortingFunctions'
import { IItemSortingFunctionList } from './ISortingFunctionList'
import { ModSortingFunctions } from './ModSortingFunctions'


/**
 * Functions for sorting magazines.
 */
export const MagazineSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ContainerSortingFunctions.functions,
    ...ModSortingFunctions.functions,
    checkSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve((i as IMagazine).checkSpeedModifierPercentage)
    },
    loadSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve((i as IMagazine).loadSpeedModifierPercentage)
    }
  },
  itemCategoryIds: [ItemCategoryId.magazine]
}
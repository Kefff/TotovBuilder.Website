import { ItemCategoryId } from '../../../models/item/IItem'
import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import { compareByItemNumber } from '../SortingService'
import { IItemSortingFunctionList } from './ISortingFunctionList'
import { ModSortingFunctions } from './ModSortingFunctions'

/**
 * Functions for sorting ranged weapon mods.
 */
export const RangedWeaponModSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ModSortingFunctions.functions,
    accuracyModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IRangedWeaponMod).accuracyModifierPercentage)
    },
    recoilModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IRangedWeaponMod).recoilModifierPercentage)
    }
  },
  itemCategoryIds: [ItemCategoryId.rangedWeaponMod]
}
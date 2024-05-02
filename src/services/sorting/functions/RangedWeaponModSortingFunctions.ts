import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ModSortingFunctions } from './ModSortingFunctions'

/**
 * Functions for sorting ranged weapon mods.
 */
export const RangedWeaponModSortingFunctions: ISortingFunctionList<IRangedWeaponMod> = {
  ...ModSortingFunctions,
  accuracyModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.accuracyModifierPercentage
  },
  recoilModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.recoilModifierPercentage
  }
}
import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ModSortingFunctions } from './ModSortingFunctions'

/**
 * Functions for sorting ranged weapon mods.
 */
export const RangedWeaponModSortingFunctions: ISortingFunctionList<IRangedWeaponMod> = {
  ...ModSortingFunctions,
  accuracyPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.accuracyPercentageModifier
  },
  recoilPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.recoilPercentageModifier
  }
}
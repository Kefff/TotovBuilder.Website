import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import { compareByNumber } from '../ItemSortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ModSortingFunctions } from './ModSortingFunctions'

/**
 * Functions for sorting ranged weapon mods.
 */
export const RangedWeaponModSortingFunctions: ISortingFunctionList = {
  ...ModSortingFunctions,
  accuracyModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeaponMod).accuracyModifierPercentage)
  },
  recoilModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeaponMod).recoilModifierPercentage)
  }
}
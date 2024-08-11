import { IItem } from '../../../models/item/IItem'
import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import { compareByItemNumber } from '../SortingService'
import ISortingFunctionList from './ISortingFunctionList'
import { ModSortingFunctions } from './ModSortingFunctions'

/**
 * Functions for sorting ranged weapon mods.
 */
export const RangedWeaponModSortingFunctions: ISortingFunctionList<IItem> = {
  ...ModSortingFunctions,
  accuracyModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeaponMod).accuracyModifierPercentage)
  },
  recoilModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeaponMod).recoilModifierPercentage)
  }
}
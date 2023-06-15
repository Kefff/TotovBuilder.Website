import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import { compareByNumber, compareByString } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting ranged weapons.
 */
export const RangedWeaponSortingFunctions: ISortingFunctionList<IRangedWeapon> = {
  ...ItemSortingFunctions,
  caliber: {
    comparisonFunction: compareByString,
    comparisonValueObtentionFunction: async (i) => i.caliber
  },
  ergonomics: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.ergonomics
  },
  fireRate: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.fireRate
  },
  horizontalRecoil: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.horizontalRecoil
  },
  verticalRecoil: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.verticalRecoil
  }
}
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
    comparisonValueObtentionFunction: i => Promise.resolve(i.caliber)
  },
  ergonomics: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.presetErgonomics ?? i.ergonomics)
  },
  fireRate: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.fireRate)
  },
  horizontalRecoil: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.presetHorizontalRecoil ?? i.horizontalRecoil)
  },
  verticalRecoil: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.presetVerticalRecoil ?? i.verticalRecoil)
  }
}
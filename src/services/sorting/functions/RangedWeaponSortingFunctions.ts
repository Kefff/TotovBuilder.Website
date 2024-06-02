import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import { compareByNumber, compareByString } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting ranged weapons.
 */
export const RangedWeaponSortingFunctions: ISortingFunctionList = {
  ...ItemSortingFunctions,
  caliber: {
    comparisonFunction: compareByString,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeapon).caliber)
  },
  ergonomics: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeapon).presetErgonomics ?? (i as IRangedWeapon).ergonomics)
  },
  fireRate: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeapon).fireRate)
  },
  horizontalRecoil: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeapon).presetHorizontalRecoil ?? (i as IRangedWeapon).horizontalRecoil)
  },
  verticalRecoil: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeapon).presetVerticalRecoil ?? (i as IRangedWeapon).verticalRecoil)
  }
}
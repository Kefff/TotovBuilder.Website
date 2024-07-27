import { IItem } from '../../../models/item/IItem'
import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import { compareByItemNumber, compareByItemString } from '../SortingService'
import { ItemSortingFunctions } from './ItemSortingFunctions'
import { ISortingFunctionList } from './SortingFunctionList'

/**
 * Functions for sorting ranged weapons.
 */
export const RangedWeaponSortingFunctions: ISortingFunctionList<IItem> = {
  ...ItemSortingFunctions,
  caliber: {
    comparisonFunction: compareByItemString,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeapon).caliber)
  },
  ergonomics: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(
      (i as IRangedWeapon).presetRangedWeaponModifiers?.ergonomics
      ?? (i as IRangedWeapon).ergonomics)
  },
  fireRate: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeapon).fireRate)
  },
  horizontalRecoil: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(
      (i as IRangedWeapon).presetRangedWeaponModifiers?.horizontalRecoil
      ?? (i as IRangedWeapon).horizontalRecoil)
  },
  verticalRecoil: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(
      (i as IRangedWeapon).presetRangedWeaponModifiers?.verticalRecoil
      ?? (i as IRangedWeapon).verticalRecoil)
  }
}
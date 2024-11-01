import { ItemCategoryId } from '../../../models/item/IItem'
import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import { compareByItemNumber, compareByItemString } from '../SortingService'
import { IItemSortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunctions'

/**
 * Functions for sorting ranged weapons.
 */
export const RangedWeaponSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    caliber: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemString(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeapon).caliber)
    },
    ergonomics: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve(
        (i as IRangedWeapon).presetRangedWeaponModifiers?.ergonomics
        ?? (i as IRangedWeapon).ergonomics)
    },
    fireRate: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve((i as IRangedWeapon).fireRate)
    },
    horizontalRecoil: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve(
        (i as IRangedWeapon).presetRangedWeaponModifiers?.horizontalRecoil
        ?? (i as IRangedWeapon).horizontalRecoil)
    },
    verticalRecoil: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve(
        (i as IRangedWeapon).presetRangedWeaponModifiers?.verticalRecoil
        ?? (i as IRangedWeapon).verticalRecoil)
    }
  },
  itemCategoryIds: [ItemCategoryId.mainWeapon, ItemCategoryId.secondaryWeapon]
}
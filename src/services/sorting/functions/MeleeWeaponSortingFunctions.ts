import { ItemCategoryId } from '../../../models/item/IItem'
import { IMeleeWeapon } from '../../../models/item/IMeleeWeapon'
import { compareByItemNumber } from '../SortingService'
import { IItemSortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunctions'

/**
 * Functions for sorting melee weapons.
 */
export const MeleeWeaponSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    chopDamage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve((i as IMeleeWeapon).chopDamage)
    },
    hitRadius: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve((i as IMeleeWeapon).hitRadius)
    },
    stabDamage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve((i as IMeleeWeapon).stabDamage)
    }
  },
  itemCategoryIds: [ItemCategoryId.meleeWeapon]
}
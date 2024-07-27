import { IItem } from '../../../models/item/IItem'
import { IMeleeWeapon } from '../../../models/item/IMeleeWeapon'
import { compareByItemNumber } from '../SortingService'
import { ItemSortingFunctions } from './ItemSortingFunctions'
import { ISortingFunctionList } from './SortingFunctionList'

/**
 * Functions for sorting melee weapons.
 */
export const MeleeWeaponSortingFunctions: ISortingFunctionList<IItem> = {
  ...ItemSortingFunctions,
  chopDamage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMeleeWeapon).chopDamage)
  },
  hitRadius: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMeleeWeapon).hitRadius)
  },
  stabDamage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMeleeWeapon).stabDamage)
  }
}
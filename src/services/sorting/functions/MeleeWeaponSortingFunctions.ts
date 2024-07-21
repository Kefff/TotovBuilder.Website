import { IMeleeWeapon } from '../../../models/item/IMeleeWeapon'
import { compareByNumber } from '../ItemSortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting melee weapons.
 */
export const MeleeWeaponSortingFunctions: ISortingFunctionList = {
  ...ItemSortingFunctions,
  chopDamage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMeleeWeapon).chopDamage)
  },
  hitRadius: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMeleeWeapon).hitRadius)
  },
  stabDamage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMeleeWeapon).stabDamage)
  }
}
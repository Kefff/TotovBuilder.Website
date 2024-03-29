import { IMeleeWeapon } from '../../../models/item/IMeleeWeapon'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting melee weapons.
 */
export const MeleeWeaponSortingFunctions: ISortingFunctionList<IMeleeWeapon> = {
  ...ItemSortingFunctions,
  chopDamage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.chopDamage
  },
  hitRadius: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.hitRadius
  },
  stabDamage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.stabDamage
  }
}
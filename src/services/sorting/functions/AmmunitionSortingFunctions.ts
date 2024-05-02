import { IAmmunition } from '../../../models/item/IAmmunition'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting ammunition.
 */
export const AmmunitionSortingFunctions: ISortingFunctionList<IAmmunition> = {
  ...ItemSortingFunctions,
  accuracyModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.accuracyModifierPercentage
  },
  fleshDamage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.fleshDamage
  },
  fragmentationChance: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.fragmentationChance
  },
  penetrationPower: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.penetrationPower
  },
  recoilModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.recoilModifierPercentage
  }
}
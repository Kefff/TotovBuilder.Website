import { IAmmunition } from '../../../models/item/IAmmunition'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting ammunition.
 */
export const AmmunitionSortingFunctions: ISortingFunctionList<IAmmunition> = {
  ...ItemSortingFunctions,
  accuracyPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.accuracyPercentageModifier
  },
  fleshDamage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.fleshDamage
  },
  fragmentationChancePercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.fragmentationChancePercentage
  },
  penetrationPower: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.penetrationPower
  },
  recoilPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.recoilPercentageModifier
  }
}
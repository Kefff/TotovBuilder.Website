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
    comparisonValueObtentionFunction: i => Promise.resolve(i.accuracyModifierPercentage)
  },
  fleshDamage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.fleshDamage)
  },
  fragmentationChance: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.fragmentationChance)
  },
  penetrationPower: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.penetrationPower)
  },
  recoilModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.recoilModifierPercentage)
  }
}
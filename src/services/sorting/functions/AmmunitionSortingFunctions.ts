import { IAmmunition } from '../../../models/item/IAmmunition'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting ammunition.
 */
export const AmmunitionSortingFunctions: ISortingFunctionList = {
  ...ItemSortingFunctions,
  accuracyModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IAmmunition).accuracyModifierPercentage)
  },
  fleshDamage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IAmmunition).fleshDamage)
  },
  fragmentationChance: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IAmmunition).fragmentationChance)
  },
  penetrationPower: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IAmmunition).penetrationPower)
  },
  recoilModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IAmmunition).recoilModifierPercentage)
  }
}
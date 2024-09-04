import { IAmmunition } from '../../../models/item/IAmmunition'
import { IItem } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import ISortingFunctionList from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunctions'

/**
 * Functions for sorting ammunition.
 */
export const AmmunitionSortingFunctions: ISortingFunctionList<IItem> = {
  ...ItemSortingFunctions,
  accuracyModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IAmmunition).accuracyModifierPercentage)
  },
  fleshDamage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IAmmunition).fleshDamage)
  },
  fragmentationChance: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IAmmunition).fragmentationChance)
  },
  penetrationPower: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IAmmunition).penetrationPower)
  },
  recoilModifier: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IAmmunition).recoilModifier)
  }
}
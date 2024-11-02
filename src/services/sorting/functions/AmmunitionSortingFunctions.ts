import { IAmmunition } from '../../../models/item/IAmmunition'
import { ItemCategoryId } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import { IItemSortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunctions'

/**
 * Functions for sorting ammunition.
 */
export const AmmunitionSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    accuracyModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).accuracyModifierPercentage)
    },
    fleshDamage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).fleshDamage * (i as IAmmunition).projectiles)
    },
    fragmentationChance: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).fragmentationChance)
    },
    penetratedArmorLevel: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).penetrationPower) // Since the penetratedArmorLevel is calculated from the penetrationPower, we can sort by penetrationPower which is more precise
    },
    penetrationPower: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).penetrationPower)
    },
    recoilModifier: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).recoilModifier)
    }
  },
  itemCategoryIds: [ItemCategoryId.ammunition]
}
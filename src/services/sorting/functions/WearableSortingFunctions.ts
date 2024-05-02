import { IWearable } from '../../../models/item/IWearable'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting wearable pieces of equipment.
 */
export const WearableSortingFunctions: ISortingFunctionList<IWearable> = {
  ...ItemSortingFunctions,
  ergonomicsModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.ergonomicsModifierPercentage
  },
  movementSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.movementSpeedModifierPercentage
  },
  turningSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.turningSpeedModifierPercentage
  }
}
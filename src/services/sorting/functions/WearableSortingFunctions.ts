import { IWearable } from '../../../models/item/IWearable'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting wearable pieces of equipment.
 */
export const WearableSortingFunctions: ISortingFunctionList<IWearable> = {
  ...ItemSortingFunctions,
  ergonomicsPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.ergonomicsPercentageModifier
  },
  movementSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.movementSpeedPercentageModifier
  },
  turningSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.turningSpeedPercentageModifier
  }
}
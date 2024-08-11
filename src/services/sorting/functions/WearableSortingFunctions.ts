import { IItem } from '../../../models/item/IItem'
import { IWearable } from '../../../models/item/IWearable'
import { compareByItemNumber } from '../SortingService'
import ISortingFunctionList from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunctions'

/**
 * Functions for sorting wearable pieces of equipment.
 */
export const WearableSortingFunctions: ISortingFunctionList<IItem> = {
  ...ItemSortingFunctions,
  ergonomicsModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IWearable).ergonomicsModifierPercentage)
  },
  movementSpeedModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IWearable).movementSpeedModifierPercentage)
  },
  turningSpeedModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IWearable).turningSpeedModifierPercentage)
  }
}
import { IEyewear } from '../../../models/item/IEyewear'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'
/**
 * Functions for sorting eyewear.
 */
export const EyewearSortingFunctions: ISortingFunctionList<IEyewear> = {
  ...ItemSortingFunctions,
  blindnessProtectionPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.blindnessProtectionPercentage
  }
}
import { IEyewear } from '../../../models/item/IEyewear'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'
/**
 * Functions for sorting eyewear.
 */
export const EyewearSortingFunctions: ISortingFunctionList = {
  ...ItemSortingFunctions,
  blindnessProtectionPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IEyewear).blindnessProtectionPercentage)
  }
}
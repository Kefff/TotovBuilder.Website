import { IEyewear } from '../../../models/item/IEyewear'
import { IItem } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import ISortingFunctionList from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunctions'
/**
 * Functions for sorting eyewear.
 */
export const EyewearSortingFunctions: ISortingFunctionList<IItem> = {
  ...ItemSortingFunctions,
  blindnessProtectionPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IEyewear).blindnessProtectionPercentage)
  }
}
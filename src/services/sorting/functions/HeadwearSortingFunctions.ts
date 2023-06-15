import { IHeadwear } from '../../../models/item/IHeadwear'
import { compareByNumber } from '../SortingService'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting headwear.
 */
export const HeadwearSortingFunctions: ISortingFunctionList<IHeadwear> = {
  ...ArmorSortingFunctions,
  ricochetChance: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => ricochetChances[i.ricochetChance]
  }
}

const ricochetChances: { [ricocherChance: string]: number } = {
  None: 0,
  Low: 1,
  Medium: 2,
  High: 3
}
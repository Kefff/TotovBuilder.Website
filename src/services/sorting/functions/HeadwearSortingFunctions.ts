import { IHeadwear } from '../../../models/item/IHeadwear'
import { compareByNumber } from '../SortingService'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting headwear.
 */
export const HeadwearSortingFunctions: ISortingFunctionList = {
  ...ArmorSortingFunctions,
  ergonomicsModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IHeadwear).presetWearableModifiers?.ergonomicsModifierPercentage ?? (i as IHeadwear).ergonomicsModifierPercentage)
  },
  movementSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IHeadwear).presetWearableModifiers?.movementSpeedModifierPercentage ?? (i as IHeadwear).movementSpeedModifierPercentage)
  },
  ricochetChance: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(ricochetChances[(i as IHeadwear).ricochetChance])
  },
  turningSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IHeadwear).presetWearableModifiers?.turningSpeedModifierPercentage ?? (i as IHeadwear).turningSpeedModifierPercentage)
  }
}

const ricochetChances: { [ricocherChance: string]: number } = {
  None: 0,
  Low: 1,
  Medium: 2,
  High: 3
}
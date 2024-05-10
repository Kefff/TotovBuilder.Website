import { IHeadwear } from '../../../models/item/IHeadwear'
import { compareByNumber } from '../SortingService'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting headwear.
 */
export const HeadwearSortingFunctions: ISortingFunctionList<IHeadwear> = {
  ...ArmorSortingFunctions,
  ergonomicsModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.presetWearableModifiers?.ergonomicsModifierPercentage ?? i.ergonomicsModifierPercentage)
  },
  movementSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.presetWearableModifiers?.movementSpeedModifierPercentage ?? i.movementSpeedModifierPercentage)
  },
  ricochetChance: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(ricochetChances[i.ricochetChance])
  },
  turningSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.presetWearableModifiers?.turningSpeedModifierPercentage ?? i.turningSpeedModifierPercentage)
  }
}

const ricochetChances: { [ricocherChance: string]: number } = {
  None: 0,
  Low: 1,
  Medium: 2,
  High: 3
}
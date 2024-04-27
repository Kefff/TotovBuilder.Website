import { IHeadwear } from '../../../models/item/IHeadwear'
import { compareByNumber } from '../SortingService'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting headwear.
 */
export const HeadwearSortingFunctions: ISortingFunctionList<IHeadwear> = {
  ...ArmorSortingFunctions,
  ergonomicsPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.ergonomicsPercentageModifier ?? i.ergonomicsPercentageModifier
  },
  movementSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.movementSpeedPercentageModifier ?? i.movementSpeedPercentageModifier
  },
  ricochetChance: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => ricochetChances[i.ricochetChance]
  },
  turningSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.turningSpeedPercentageModifier ?? i.turningSpeedPercentageModifier
  }
}

const ricochetChances: { [ricocherChance: string]: number } = {
  None: 0,
  Low: 1,
  Medium: 2,
  High: 3
}
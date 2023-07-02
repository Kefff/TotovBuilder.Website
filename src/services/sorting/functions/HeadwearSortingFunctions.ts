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
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.ergonomicsPercentageModifierWithMods ?? i.ergonomicsPercentageModifier
  },
  movementSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.movementSpeedPercentageModifierWithMods ?? i.movementSpeedPercentageModifier
  },
  ricochetChance: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => ricochetChances[i.ricochetChance]
  },
  turningSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.turningSpeedPercentageModifierWithMods ?? i.turningSpeedPercentageModifier
  }
}

const ricochetChances: { [ricocherChance: string]: number } = {
  None: 0,
  Low: 1,
  Medium: 2,
  High: 3
}
import { IArmorMod } from '../../../models/item/IArmorMod'
import { compareByNumber } from '../SortingService'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting armor mods.
 */
export const ArmorModSortingFunctions: ISortingFunctionList<IArmorMod> = {
  ...ArmorSortingFunctions,
  ergonomicsPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.ergonomicsPercentageModifier ?? i.ergonomicsPercentageModifier
  },
  movementSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.movementSpeedPercentageModifier ?? i.movementSpeedPercentageModifier
  },
  turningSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.turningSpeedPercentageModifier ?? i.turningSpeedPercentageModifier
  }
}
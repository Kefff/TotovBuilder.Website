import { IArmorMod } from '../../../models/item/IArmorMod'
import { compareByNumber } from '../SortingService'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting armor mods.
 */
export const ArmorModSortingFunctions: ISortingFunctionList<IArmorMod> = {
  ...ArmorSortingFunctions,
  ergonomicsModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.ergonomicsModifierPercentage ?? i.ergonomicsModifierPercentage
  },
  movementSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.movementSpeedModifierPercentage ?? i.movementSpeedModifierPercentage
  },
  turningSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.turningSpeedModifierPercentage ?? i.turningSpeedModifierPercentage
  }
}
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
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.ergonomicsPercentageModifierWithMods ?? i.ergonomicsPercentageModifier
  },
  movementSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.movementSpeedPercentageModifierWithMods ?? i.movementSpeedPercentageModifier
  },
  turningSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.presetWearableModifiers?.turningSpeedPercentageModifierWithMods ?? i.turningSpeedPercentageModifier
  }
}
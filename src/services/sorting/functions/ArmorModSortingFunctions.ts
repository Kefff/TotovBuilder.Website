import { IArmorMod } from '../../../models/item/IArmorMod'
import { compareByNumber } from '../ItemSortingService'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting armor mods.
 */
export const ArmorModSortingFunctions: ISortingFunctionList = {
  ...ArmorSortingFunctions,
  ergonomicsModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IArmorMod).presetWearableModifiers?.ergonomicsModifierPercentage ?? (i as IArmorMod).ergonomicsModifierPercentage)
  },
  movementSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IArmorMod).presetWearableModifiers?.movementSpeedModifierPercentage ?? (i as IArmorMod).movementSpeedModifierPercentage)
  },
  turningSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IArmorMod).presetWearableModifiers?.turningSpeedModifierPercentage ?? (i as IArmorMod).turningSpeedModifierPercentage)
  }
}
import { IArmorMod } from '../../../models/item/IArmorMod'
import { IItem } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import ISortingFunctionList from './ISortingFunctionList'

/**
 * Functions for sorting armor mods.
 */
export const ArmorModSortingFunctions: ISortingFunctionList<IItem> = {
  ...ArmorSortingFunctions,
  ergonomicsModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(
      (i as IArmorMod).presetWearableModifiers?.ergonomicsModifierPercentage
      ?? (i as IArmorMod).ergonomicsModifierPercentage)
  },
  movementSpeedModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(
      (i as IArmorMod).presetWearableModifiers?.movementSpeedModifierPercentage
      ?? (i as IArmorMod).movementSpeedModifierPercentage)
  },
  turningSpeedModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(
      (i as IArmorMod).presetWearableModifiers?.turningSpeedModifierPercentage
      ?? (i as IArmorMod).turningSpeedModifierPercentage)
  }
}
import { IArmorMod } from '../../../models/item/IArmorMod'
import { ItemCategoryId } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { IItemSortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting armor mods.
 */
export const ArmorModSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ArmorSortingFunctions.functions,
    ergonomicsModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve(
        (i as IArmorMod).presetWearableModifiers?.ergonomicsModifierPercentage
        ?? (i as IArmorMod).ergonomicsModifierPercentage)
    },
    movementSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve(
        (i as IArmorMod).presetWearableModifiers?.movementSpeedModifierPercentage
        ?? (i as IArmorMod).movementSpeedModifierPercentage)
    },
    turningSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve(
        (i as IArmorMod).presetWearableModifiers?.turningSpeedModifierPercentage
        ?? (i as IArmorMod).turningSpeedModifierPercentage)
    }
  },
  itemCategoryIds: [ItemCategoryId.armorMod]
}
import { IHeadwear } from '../../../models/item/IHeadwear'
import { ItemCategoryId } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { IItemSortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting headwear.
 */
export const HeadwearSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ArmorSortingFunctions.functions,
    ergonomicsModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(
        (i as IHeadwear).presetWearableModifiers?.ergonomicsModifierPercentage
        ?? (i as IHeadwear).ergonomicsModifierPercentage)
    },
    movementSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((
        i as IHeadwear).presetWearableModifiers?.movementSpeedModifierPercentage
        ?? (i as IHeadwear).movementSpeedModifierPercentage)
    },
    ricochetChance: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(ricochetChances[(i as IHeadwear).ricochetChance])
    },
    turningSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(
        (i as IHeadwear).presetWearableModifiers?.turningSpeedModifierPercentage
        ?? (i as IHeadwear).turningSpeedModifierPercentage)
    }
  },
  itemCategoryIds: [ItemCategoryId.headwear]
}

const ricochetChances: { [ricocherChance: string]: number } = {
  None: 0,
  Low: 1,
  Medium: 2,
  High: 3
}
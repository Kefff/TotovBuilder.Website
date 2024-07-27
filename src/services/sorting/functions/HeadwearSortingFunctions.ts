import { IHeadwear } from '../../../models/item/IHeadwear'
import { IItem } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ISortingFunctionList } from './SortingFunctionList'

/**
 * Functions for sorting headwear.
 */
export const HeadwearSortingFunctions: ISortingFunctionList<IItem> = {
  ...ArmorSortingFunctions,
  ergonomicsModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(
      (i as IHeadwear).presetWearableModifiers?.ergonomicsModifierPercentage
      ?? (i as IHeadwear).ergonomicsModifierPercentage)
  },
  movementSpeedModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((
      i as IHeadwear).presetWearableModifiers?.movementSpeedModifierPercentage
      ?? (i as IHeadwear).movementSpeedModifierPercentage)
  },
  ricochetChance: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(ricochetChances[(i as IHeadwear).ricochetChance])
  },
  turningSpeedModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(
      (i as IHeadwear).presetWearableModifiers?.turningSpeedModifierPercentage
      ?? (i as IHeadwear).turningSpeedModifierPercentage)
  }
}

const ricochetChances: { [ricocherChance: string]: number } = {
  None: 0,
  Low: 1,
  Medium: 2,
  High: 3
}
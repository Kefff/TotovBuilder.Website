import { IGrenade } from '../../../models/item/IGrenade'
import { IItem } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import { ItemSortingFunctions } from './ItemSortingFunctions'
import { ISortingFunctionList } from './SortingFunctionList'

/**
 * Functions for sorting grenades.
 */
export const GrenadeSortingFunctions: ISortingFunctionList<IItem> = {
  ...ItemSortingFunctions,
  explosionDelay: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IGrenade).explosionDelay)
  },
  fragmentsAmount: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IGrenade).fragmentsAmount)
  },
  maximumExplosionRange: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IGrenade).maximumExplosionRange)
  }
}
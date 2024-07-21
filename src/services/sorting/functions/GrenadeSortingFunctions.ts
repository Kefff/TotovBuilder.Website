import { IGrenade } from '../../../models/item/IGrenade'
import { compareByNumber } from '../ItemSortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting grenades.
 */
export const GrenadeSortingFunctions: ISortingFunctionList = {
  ...ItemSortingFunctions,
  explosionDelay: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IGrenade).explosionDelay)
  },
  fragmentsAmount: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IGrenade).fragmentsAmount)
  },
  maximumExplosionRange: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IGrenade).maximumExplosionRange)
  }
}
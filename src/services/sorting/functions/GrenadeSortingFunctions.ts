import { IGrenade } from '../../../models/item/IGrenade'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting grenades.
 */
export const GrenadeSortingFunctions: ISortingFunctionList<IGrenade> = {
  ...ItemSortingFunctions,
  explosionDelay: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.explosionDelay)
  },
  fragmentsAmount: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.fragmentsAmount)
  },
  maximumExplosionRange: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.maximumExplosionRange)
  }
}
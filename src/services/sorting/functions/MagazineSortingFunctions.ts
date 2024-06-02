import { IMagazine } from '../../../models/item/IMagazine'
import { compareByNumber } from '../SortingService'
import { ContainerSortingFunctions } from './ContainerSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ModSortingFunctions } from './ModSortingFunctions'


/**
 * Functions for sorting magazines.
 */
export const MagazineSortingFunctions: ISortingFunctionList = {
  ...ContainerSortingFunctions,
  ...ModSortingFunctions,
  checkSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMagazine).checkSpeedModifierPercentage)
  },
  loadSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMagazine).loadSpeedModifierPercentage)
  }
}
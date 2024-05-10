import { IMagazine } from '../../../models/item/IMagazine'
import { compareByNumber } from '../SortingService'
import { ContainerSortingFunctions } from './ContainerSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ModSortingFunctions } from './ModSortingFunctions'


/**
 * Functions for sorting magazines.
 */
export const MagazineSortingFunctions: ISortingFunctionList<IMagazine> = {
  ...ContainerSortingFunctions,
  ...ModSortingFunctions,
  checkSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.checkSpeedModifierPercentage)
  },
  loadSpeedModifierPercentage: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.loadSpeedModifierPercentage)
  }
}
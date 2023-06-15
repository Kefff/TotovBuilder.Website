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
  checkSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.checkSpeedPercentageModifier
  },
  loadSpeedPercentageModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.loadSpeedPercentageModifier
  }
}
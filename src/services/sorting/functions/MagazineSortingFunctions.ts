import { IItem } from '../../../models/item/IItem'
import { IMagazine } from '../../../models/item/IMagazine'
import { compareByItemNumber } from '../SortingService'
import { ContainerSortingFunctions } from './ContainerSortingFunctions'
import ISortingFunctionList from './ISortingFunctionList'
import { ModSortingFunctions } from './ModSortingFunctions'


/**
 * Functions for sorting magazines.
 */
export const MagazineSortingFunctions: ISortingFunctionList<IItem> = {
  ...ContainerSortingFunctions,
  ...ModSortingFunctions,
  checkSpeedModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMagazine).checkSpeedModifierPercentage)
  },
  loadSpeedModifierPercentage: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMagazine).loadSpeedModifierPercentage)
  }
}
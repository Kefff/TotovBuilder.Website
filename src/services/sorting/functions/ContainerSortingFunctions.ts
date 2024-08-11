import { IContainer } from '../../../models/item/IContainer'
import { IItem } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import ISortingFunctionList from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunctions'

/**
 * Functions for sorting containers.
 */
export const ContainerSortingFunctions: ISortingFunctionList<IItem> = {
  ...ItemSortingFunctions,
  capacity: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IContainer).capacity)
  }
}
import { IContainer } from '../../../models/item/IContainer'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting containers.
 */
export const ContainerSortingFunctions: ISortingFunctionList<IContainer> = {
  ...ItemSortingFunctions,
  capacity: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.capacity)
  }
}
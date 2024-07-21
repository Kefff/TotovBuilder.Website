import { IContainer } from '../../../models/item/IContainer'
import { compareByNumber } from '../ItemSortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Functions for sorting containers.
 */
export const ContainerSortingFunctions: ISortingFunctionList = {
  ...ItemSortingFunctions,
  capacity: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IContainer).capacity)
  }
}
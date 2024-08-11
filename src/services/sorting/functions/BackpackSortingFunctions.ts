import { IItem } from '../../../models/item/IItem'
import { ContainerSortingFunctions } from './ContainerSortingFunctions'
import ISortingFunctionList from './ISortingFunctionList'
import { WearableSortingFunctions } from './WearableSortingFunctions'

/**
 * Functions for sorting backpacks.
 */
export const BackpackSortingFunctions: ISortingFunctionList<IItem> = {
  ...ContainerSortingFunctions,
  ...WearableSortingFunctions
}
import { ContainerSortingFunctions } from './ContainerSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'
import { WearableSortingFunctions } from './WearableSortingFunctions'

/**
 * Functions for sorting backpacks.
 */
export const BackpackSortingFunctions: ISortingFunctionList = {
  ...ContainerSortingFunctions,
  ...WearableSortingFunctions
}
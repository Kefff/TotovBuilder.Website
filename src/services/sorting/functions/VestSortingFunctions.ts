import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ContainerSortingFunctions } from './ContainerSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting vests.
 */
export const VestSortingFunctions: ISortingFunctionList = {
  ...ArmorSortingFunctions,
  ...ContainerSortingFunctions
}
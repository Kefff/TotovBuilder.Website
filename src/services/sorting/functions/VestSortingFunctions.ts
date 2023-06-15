import { IVest } from '../../../models/item/IVest'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ContainerSortingFunctions } from './ContainerSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting vests.
 */
export const VestSortingFunctions: ISortingFunctionList<IVest> = {
  ...ArmorSortingFunctions,
  ...ContainerSortingFunctions
}
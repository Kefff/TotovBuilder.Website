import { IItem } from '../../../models/item/IItem'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ContainerSortingFunctions } from './ContainerSortingFunctions'
import { ISortingFunctionList } from './SortingFunctionList'

/**
 * Functions for sorting vests.
 */
export const VestSortingFunctions: ISortingFunctionList<IItem> = {
  ...ArmorSortingFunctions,
  ...ContainerSortingFunctions
}
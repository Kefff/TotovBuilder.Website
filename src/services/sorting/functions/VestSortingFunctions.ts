import { ItemCategoryId } from '../../../models/item/IItem'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ContainerSortingFunctions } from './ContainerSortingFunctions'
import { IItemSortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting vests.
 */
export const VestSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ArmorSortingFunctions.functions,
    ...ContainerSortingFunctions.functions
  },
  itemCategoryIds: [ItemCategoryId.vest]
}
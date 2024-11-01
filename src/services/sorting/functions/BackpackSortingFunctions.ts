import { ItemCategoryId } from '../../../models/item/IItem'
import { ContainerSortingFunctions } from './ContainerSortingFunctions'
import { IItemSortingFunctionList } from './ISortingFunctionList'
import { WearableSortingFunctions } from './WearableSortingFunctions'

/**
 * Functions for sorting backpacks.
 */
export const BackpackSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ContainerSortingFunctions.functions,
    ...WearableSortingFunctions.functions
  },
  itemCategoryIds: [ItemCategoryId.backpack]
}
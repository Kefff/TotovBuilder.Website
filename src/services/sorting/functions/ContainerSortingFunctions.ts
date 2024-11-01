import { IContainer } from '../../../models/item/IContainer'
import { ItemCategoryId } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import { IItemSortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunctions'

/**
 * Functions for sorting containers.
 */
export const ContainerSortingFunctions: IItemSortingFunctionList = {
  itemCategoryIds: [ItemCategoryId.container, ItemCategoryId.securedContainer],
  functions: {
    ...ItemSortingFunctions.functions,
    capacity: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionFunction: i => Promise.resolve((i as IContainer).capacity)
    }
  }
}
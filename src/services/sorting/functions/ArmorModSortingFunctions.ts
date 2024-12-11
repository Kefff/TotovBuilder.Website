import { ItemCategoryId } from '../../../models/item/IItem'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { IItemSortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting armor mods.
 */
export const ArmorModSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ArmorSortingFunctions.functions
  },
  itemCategoryIds: [ItemCategoryId.armorMod]
}
import { IArmor } from '../../../models/item/IArmor'
import { ArmorSortingFunctions } from './ArmorSortingFunctions'
import { ISortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting armor mods.
 */
export const ArmorModSortingFunctions: ISortingFunctionList<IArmor> = {
  ...ArmorSortingFunctions
}
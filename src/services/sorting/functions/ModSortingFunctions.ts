import { IMod } from '../../../models/item/IMod'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'


/**
 * Functions for sorting mods.
 */
export const ModSortingFunctions: ISortingFunctionList<IMod> = {
  ...ItemSortingFunctions,
  ergonomicsModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.ergonomicsModifier
  }
}
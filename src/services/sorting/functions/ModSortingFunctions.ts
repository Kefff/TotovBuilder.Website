import { IMod } from '../../../models/item/IMod'
import { compareByNumber } from '../ItemSortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunction'


/**
 * Functions for sorting mods.
 */
export const ModSortingFunctions: ISortingFunctionList = {
  ...ItemSortingFunctions,
  ergonomicsModifier: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMod).ergonomicsModifier)
  }
}
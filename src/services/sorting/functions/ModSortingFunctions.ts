import { IItem } from '../../../models/item/IItem'
import { IMod } from '../../../models/item/IMod'
import { compareByItemNumber } from '../SortingService'
import ISortingFunctionList from './ISortingFunctionList'
import { ItemSortingFunctions } from './ItemSortingFunctions'


/**
 * Functions for sorting mods.
 */
export const ModSortingFunctions: ISortingFunctionList<IItem> = {
  ...ItemSortingFunctions,
  ergonomicsModifier: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IMod).ergonomicsModifier)
  }
}
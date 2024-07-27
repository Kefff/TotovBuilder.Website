import { IItem } from '../../../models/item/IItem'
import { IMod } from '../../../models/item/IMod'
import { compareByItemNumber } from '../SortingService'
import { ItemSortingFunctions } from './ItemSortingFunctions'
import { ISortingFunctionList } from './SortingFunctionList'


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
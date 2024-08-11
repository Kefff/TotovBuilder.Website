import { IArmor } from '../../../models/item/IArmor'
import { IItem } from '../../../models/item/IItem'
import { compareByItemNumber } from '../SortingService'
import ISortingFunctionList from './ISortingFunctionList'
import { WearableSortingFunctions } from './WearableSortingFunctions'

/**
 * Functions for sorting armors.
 */
export const ArmorSortingFunctions: ISortingFunctionList<IItem> = {
  ...WearableSortingFunctions,
  armorClass: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IArmor).armorClass)
  },
  durability: {
    comparisonFunction: compareByItemNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IArmor).durability)
  }
}
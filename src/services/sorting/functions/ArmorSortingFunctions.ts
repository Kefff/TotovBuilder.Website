import { IArmor } from '../../../models/item/IArmor'
import { compareByNumber } from '../SortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { WearableSortingFunctions } from './WearableSortingFunctions'

/**
 * Functions for sorting armors.
 */
export const ArmorSortingFunctions: ISortingFunctionList<IArmor> = {
  ...WearableSortingFunctions,
  armorClass: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.armorClass)
  },
  durability: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve(i.durability)
  }
}
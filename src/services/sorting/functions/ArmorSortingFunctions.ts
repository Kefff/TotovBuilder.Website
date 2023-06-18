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
    comparisonValueObtentionFunction: async (i) => i.armorClass
  },
  durability: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: async (i) => i.durability
  }
}
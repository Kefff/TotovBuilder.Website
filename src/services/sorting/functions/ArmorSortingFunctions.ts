import { IArmor } from '../../../models/item/IArmor'
import { compareByNumber } from '../ItemSortingService'
import { ISortingFunctionList } from './ISortingFunctionList'
import { WearableSortingFunctions } from './WearableSortingFunctions'

/**
 * Functions for sorting armors.
 */
export const ArmorSortingFunctions: ISortingFunctionList = {
  ...WearableSortingFunctions,
  armorClass: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IArmor).armorClass)
  },
  durability: {
    comparisonFunction: compareByNumber,
    comparisonValueObtentionFunction: i => Promise.resolve((i as IArmor).durability)
  }
}
import { IArmor } from '../../../models/item/IArmor'
import { IItem } from '../../../models/item/IItem'
import { ISortingFunctions } from './ISortingFunctions'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Represents a collection of functions for sorting armors.
 */
export class ArmorSortingFunctions implements ISortingFunctions {
  /**
   * {@inheritDoc ISortingFunctions.comparisonFunctions}
   */
  public comparisonFunctions: { [property: string]: (item1: IItem, item2ValueToCompare: string | number, item2: IItem, item1ValueToCompare: string | number) => number } = {
    armorClass: ItemSortingFunctions.compareByNumber,
    durability: ItemSortingFunctions.compareByNumber,
    ergonomicsPercentageModifier: ItemSortingFunctions.compareByNumber
  }

  /**
   * {@inheritDoc ISortingFunctions.valueToCompareGettingFunctions}
   */
  public getValueToCompareFunctions: { [property: string]: (item: IItem) => (string | number) | Promise<string | number> } = {
    armorClass: (item: IItem) => (item as IArmor).armorClass,
    durability: (item: IItem) => (item as IArmor).durability,
    ergonomicsPercentageModifier: (item: IItem) => (item as IArmor).ergonomicsPercentageModifier
  }
}
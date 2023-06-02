import { IItem } from '../../../models/item/IItem'
import { IMagazine } from '../../../models/item/IMagazine'
import { ISortingFunctions } from './ISortingFunctions'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Represents a collection of functions for sorting magazines.
 */
export class MagazineSortingFunctions implements ISortingFunctions {
  /**
   * {@inheritDoc ISortingFunctions.comparisonFunctions}
   */
  public comparisonFunctions: { [property: string]: (item1: IItem, item2ValueToCompare: string | number, item2: IItem, item1ValueToCompare: string | number) => number } = {
    loadSpeedPercentageModifier: ItemSortingFunctions.compareByNumber,
    checkSpeedPercentageModifier: ItemSortingFunctions.compareByNumber,
    ergonomicsModifier: ItemSortingFunctions.compareByNumber
  }

  /**
   * {@inheritDoc ISortingFunctions.valueToCompareGettingFunctions}
   */
  public getValueToCompareFunctions: { [property: string]: (item: IItem) => (string | number) | Promise<string | number> } = {
    loadSpeedPercentageModifier: (item: IItem) => (item as IMagazine).loadSpeedPercentageModifier,
    checkSpeedPercentageModifier: (item: IItem) => (item as IMagazine).checkSpeedPercentageModifier,
    ergonomicsModifier: (item: IItem) => (item as IMagazine).presetErgonomicsModifier ?? (item as IMagazine).ergonomicsModifier
  }
}
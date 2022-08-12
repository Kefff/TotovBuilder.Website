import { IGrenade } from '../../../models/item/IGrenade'
import { IItem } from '../../../models/item/IItem'
import { ISortingFunctions } from './ISortingFunctions'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Represents a collection of functions for sorting grenades.
 */
export class GrenadeSortingFunctions implements ISortingFunctions {
  /**
   * {@inheritDoc ISortingFunctions.comparisonFunctions}
   */
  public comparisonFunctions: { [property: string]: (item1: IItem, item2ValueToCompare: string | number, item2: IItem, item1ValueToCompare: string | number) => number } = {
    explosionDelay: ItemSortingFunctions.compareByNumber,
    maximumExplosionRange: ItemSortingFunctions.compareByNumber,
    fragmentsAmount: ItemSortingFunctions.compareByNumber
  }

  /**
   * {@inheritDoc ISortingFunctions.valueToCompareGettingFunctions}
   */
  public getValueToCompareFunctions: { [property: string]: (item: IItem) => (string | number) | Promise<string | number> } = {
    explosionDelay: (item: IItem) => (item as IGrenade).explosionDelay,
    maximumExplosionRange: (item: IItem) => (item as IGrenade).maximumExplosionRange,
    fragmentsAmount: (item: IItem) => (item as IGrenade).fragmentsAmount
  }
}
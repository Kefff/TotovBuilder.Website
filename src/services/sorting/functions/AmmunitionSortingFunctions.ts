import { IAmmunition } from '../../../models/item/IAmmunition'
import { IItem } from '../../../models/item/IItem'
import { ISortingFunctions } from './ISortingFunctions'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Represents a collection of functions for sorting ammunition.
 */
export class AmmunitionSortingFunctions implements ISortingFunctions {
  /**
   * {@inheritDoc ISortingFunctions.comparisonFunctions}
   */
  public comparisonFunctions: { [property: string]: (item1: IItem, item2ValueToCompare: string | number, item2: IItem, item1ValueToCompare: string | number) => number } = {
    fleshDamage: ItemSortingFunctions.compareByNumber,
    penetrationPower: ItemSortingFunctions.compareByNumber,
    fragmentationChancePercentage: ItemSortingFunctions.compareByNumber,
    recoilPercentageModifier: ItemSortingFunctions.compareByNumber,
    accuracyPercentageModifier: ItemSortingFunctions.compareByNumber
  }

  /**
   * {@inheritDoc ISortingFunctions.valueToCompareGettingFunctions}
   */
  public getValueToCompareFunctions: { [property: string]: (item: IItem) => (string | number) | Promise<string | number> } = {
    fleshDamage: (item: IItem) => (item as IAmmunition).fleshDamage,
    penetrationPower: (item: IItem) => (item as IAmmunition).penetrationPower,
    fragmentationChancePercentage: (item: IItem) => (item as IAmmunition).fragmentationChancePercentage,
    recoilPercentageModifier: (item: IItem) => (item as IAmmunition).recoilPercentageModifier,
    accuracyPercentageModifier: (item: IItem) => (item as IAmmunition).accuracyPercentageModifier
  }
}
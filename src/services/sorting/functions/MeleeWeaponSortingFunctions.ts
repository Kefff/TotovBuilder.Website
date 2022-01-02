import { IItem } from '../../../models/item/IItem'
import { IMeleeWeapon } from '../../../models/item/IMeleeWeapon'
import { ISortingFunctions } from './ISortingFunctions'
import { ItemSortingFunctions } from './ItemSortingFunction'

/**
 * Represents a collection of functions for sorting melee weapons.
 */
export class MeleeWeaponSortingFunctions implements ISortingFunctions {
  /**
   * {@inheritDoc ISortingFunctions.comparisonFunctions}
   */
  public comparisonFunctions: { [property: string]: (item1: IItem, item2ValueToCompare: string | number, item2: IItem, item1ValueToCompare: string | number) => number } = {
    stabDamage: ItemSortingFunctions.compareByNumber,
    chopDamage: ItemSortingFunctions.compareByNumber,
    hitRadius: ItemSortingFunctions.compareByNumber
  }

  /**
   * {@inheritDoc ISortingFunctions.valueToCompareGettingFunctions}
   */
  public getValueToCompareFunctions: { [property: string]: (item: IItem) => (string | number) | Promise<string | number> } = {
    stabDamage: (item: IItem) => (item as IMeleeWeapon).stabDamage,
    chopDamage: (item: IItem) => (item as IMeleeWeapon).chopDamage,
    hitRadius: (item: IItem) => (item as IMeleeWeapon).hitRadius
  }
}